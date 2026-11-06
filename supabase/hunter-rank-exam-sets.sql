-- Run only after hunter-rank-phase0.sql, in a reviewed database migration.
-- Published content is immutable: historical answers must always be scored
-- against the same questions and solutions.
create table if not exists public.hunter_rank_exam_sets (
  month_key text primary key check (month_key ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  questions jsonb not null check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) = 30),
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
alter table public.hunter_rank_exam_sets enable row level security;
grant all on public.hunter_rank_exam_sets to service_role;
-- No client policies: only the authenticated server's service-role client reads
-- this table, so question answers are never exposed via the Supabase client.
create or replace function public.prevent_published_hunter_set_change()
returns trigger language plpgsql set search_path = public as $$
begin
  if old.status = 'published' then
    raise exception 'Published Hunter Rank exam sets are immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
drop trigger if exists hunter_exam_set_immutable on public.hunter_rank_exam_sets;
create trigger hunter_exam_set_immutable before update or delete on public.hunter_rank_exam_sets
for each row execute function public.prevent_published_hunter_set_change();

-- Monthly attempts are written only by authenticated server endpoints after
-- checking the student's identity. Other exam sessions retain their policies.
create or replace function public.guard_hunter_rank_session_write()
returns trigger language plpgsql set search_path = public as $$
declare old_rank boolean := false; new_rank boolean := false;
begin
  if tg_op <> 'INSERT' then old_rank := old.exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$'; end if;
  if tg_op <> 'DELETE' then new_rank := new.exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$'; end if;
  if (old_rank or new_rank) and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Hunter Rank attempts can only be changed by the server';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
drop trigger if exists guard_hunter_rank_session_write on public.exam_sessions;
create trigger guard_hunter_rank_session_write before insert or update or delete on public.exam_sessions
for each row execute function public.guard_hunter_rank_session_write();
