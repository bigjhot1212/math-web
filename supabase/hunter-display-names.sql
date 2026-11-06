-- Hunter names are public aliases chosen by students. Each row preserves the
-- alias in effect from its Bangkok calendar month onward.
create table if not exists public.hunter_display_names (
  user_id uuid not null references auth.users(id) on delete cascade,
  month_key text not null check (month_key ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  display_name text not null check (char_length(display_name) between 3 and 24),
  created_at timestamptz not null default now(),
  primary key (user_id, month_key)
);
alter table public.hunter_display_names enable row level security;
grant select on public.hunter_display_names to authenticated;
grant all on public.hunter_display_names to service_role;
drop policy if exists "Students can read own hunter names" on public.hunter_display_names;
create policy "Students can read own hunter names" on public.hunter_display_names
  for select to authenticated using (auth.uid() = user_id);
