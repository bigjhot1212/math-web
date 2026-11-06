-- Phase 0: immutable monthly Hunter Rank results, privacy-safe leaderboard data,
-- one attempt per user/month, and an audit trail for every official result change.

create extension if not exists pgcrypto;

create table if not exists public.hunter_rank_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_key text not null check (month_key ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  exam_session_id text not null unique,
  exam_type text not null check (exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$'),
  question_set_hash text not null check (length(question_set_hash) = 64),
  question_ids jsonb not null default '[]'::jsonb,
  earned_points integer not null check (earned_points >= 0),
  penalty_points integer not null check (penalty_points >= 0),
  net_points integer not null check (net_points >= 0),
  maximum_points integer not null check (maximum_points > 0),
  rating integer not null check (rating between 0 and 100),
  rank_code text not null check (rank_code in ('F', 'E', 'D', 'C', 'B', 'A', 'S')),
  scoring_version text not null,
  finalization_reason text not null check (finalization_reason in ('submitted', 'left_exam', 'time_expired', 'recovered')),
  submitted_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month_key)
);

create index if not exists hunter_rank_results_month_rating_idx
  on public.hunter_rank_results (month_key, rating desc, submitted_at asc);

-- The database, not only the UI, enforces one monthly attempt.
create unique index if not exists exam_sessions_one_hunter_rank_attempt_idx
  on public.exam_sessions (user_id, exam_type)
  where exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$';

alter table public.hunter_rank_results enable row level security;
-- Supabase projects can disable automatic table exposure. RLS still limits
-- authenticated users to their own rows; only the service role writes results.
grant select on public.hunter_rank_results to authenticated;
grant all on public.hunter_rank_results to service_role;

drop policy if exists "Students can read own Hunter Rank result" on public.hunter_rank_results;
create policy "Students can read own Hunter Rank result"
  on public.hunter_rank_results for select
  using (auth.uid() = user_id);

-- There are deliberately no client insert/update/delete policies. Official results are
-- written by the authenticated server route through the service-role client only.

create table if not exists public.hunter_rank_audit_log (
  id bigint generated always as identity primary key,
  result_id uuid not null,
  user_id uuid not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  actor_user_id uuid,
  old_record jsonb,
  new_record jsonb,
  created_at timestamptz not null default now()
);

alter table public.hunter_rank_audit_log enable row level security;
grant all on public.hunter_rank_audit_log to service_role;
grant usage, select on sequence public.hunter_rank_audit_log_id_seq to service_role;

create or replace function public.audit_hunter_rank_result()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.hunter_rank_audit_log (
    result_id,
    user_id,
    action,
    actor_user_id,
    old_record,
    new_record
  ) values (
    case when tg_op = 'DELETE' then old.id else new.id end,
    case when tg_op = 'DELETE' then old.user_id else new.user_id end,
    lower(tg_op),
    auth.uid(),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists hunter_rank_results_audit on public.hunter_rank_results;
create trigger hunter_rank_results_audit
after insert or update or delete on public.hunter_rank_results
for each row execute function public.audit_hunter_rank_result();

create or replace function public.reject_hunter_rank_result_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'Official Hunter Rank results are immutable. Record a correction separately.';
end;
$$;

drop trigger if exists hunter_rank_results_reject_mutation on public.hunter_rank_results;
create trigger hunter_rank_results_reject_mutation
before update or delete on public.hunter_rank_results
for each row execute function public.reject_hunter_rank_result_mutation();

-- Backfill completed monthly attempts without changing any existing exam session.
with ranked_sessions as (
  select
    id::text as exam_session_id,
    user_id,
    substring(exam_type from 13 for 7) as month_key,
    exam_type,
    greatest(coalesce(score, 0), 0)::integer as net_points,
    greatest(coalesce(total_questions, 0), 1)::integer as maximum_points,
    submitted_at,
    question_ids,
    row_number() over (
      partition by user_id, exam_type
      order by submitted_at asc, id asc
    ) as attempt_number
  from public.exam_sessions
  where submitted_at is not null
    and exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$'
), normalized as (
  select
    *,
    least(100, greatest(0, round((net_points::numeric / maximum_points) * 100)::integer)) as rating
  from ranked_sessions
  where attempt_number = 1
)
insert into public.hunter_rank_results (
  user_id,
  month_key,
  exam_session_id,
  exam_type,
  question_set_hash,
  question_ids,
  earned_points,
  penalty_points,
  net_points,
  maximum_points,
  rating,
  rank_code,
  scoring_version,
  finalization_reason,
  submitted_at
)
select
  user_id,
  month_key,
  exam_session_id,
  exam_type,
  encode(digest(coalesce(question_ids, '[]'::jsonb)::text, 'sha256'), 'hex'),
  coalesce(question_ids, '[]'::jsonb),
  net_points,
  0,
  net_points,
  maximum_points,
  rating,
  case
    when rating >= 90 then 'S'
    when rating >= 80 then 'A'
    when rating >= 70 then 'B'
    when rating >= 60 then 'C'
    when rating >= 50 then 'D'
    when rating >= 40 then 'E'
    else 'F'
  end,
  'hunter-rank-legacy-v1',
  'recovered',
  submitted_at
from normalized
where month_key is not null
on conflict (user_id, month_key) do nothing;
