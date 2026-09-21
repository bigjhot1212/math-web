create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) <= 160),
  grade text not null check (char_length(grade) <= 160),
  province text not null check (char_length(province) <= 160),
  desired_faculty text not null check (char_length(desired_faculty) <= 160),
  desired_university text not null check (char_length(desired_university) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;

create policy "Students can read own profile" on public.student_profiles
  for select to authenticated using (auth.uid() = user_id);
create policy "Students can create own profile" on public.student_profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Students can update own profile" on public.student_profiles
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
