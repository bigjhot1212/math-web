-- Courses for students who registered before the website existed. Each row grants one
-- course to one email; the first time that student signs in (with a confirmed email),
-- the rows become topic_purchases and are removed. Row level security with NO policies:
-- only the server, using the service role key, reads or writes this table.

create table if not exists public.course_invites (
  email text not null check (email = lower(email) and char_length(email) <= 320),
  topic_id text not null check (char_length(topic_id) <= 100),
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  primary key (email, topic_id)
);

alter table public.course_invites enable row level security;
