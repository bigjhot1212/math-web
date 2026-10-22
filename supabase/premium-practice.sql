-- Premium practice: past-exam question bank for students who bought a course,
-- plus pre-approved emails for students who registered before the website existed.
-- Both tables have row level security enabled and NO policies, so the browser can
-- never read them directly. The server reads them with the service role key after
-- checking that the student has premium access.

create table if not exists public.premium_questions (
  id text primary key check (char_length(id) <= 160),
  exam text not null check (char_length(exam) <= 80),            -- e.g. 'PAT1', 'วิชาสามัญ', 'A-Level'
  exam_year integer check (exam_year between 2400 and 2700),     -- Buddhist year, e.g. 2563
  exam_round text check (char_length(exam_round) <= 80),         -- e.g. 'มี.ค.', 'ต.ค.'
  question_number integer,
  topic_id text not null check (char_length(topic_id) <= 100),   -- same ids as the practice topics
  subtopic text not null default '' check (char_length(subtopic) <= 160),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  type text not null default 'multiple-choice' check (type in ('multiple-choice', 'short-answer')),
  content jsonb not null,                                        -- { text, image?, choices? }
  answer text not null,
  accepted_answers jsonb,
  hint text not null default '',
  solution jsonb not null default '{"steps": []}'::jsonb,        -- { steps: [], keyFormula? }
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists premium_questions_filter_idx
  on public.premium_questions (exam, exam_year, topic_id) where published;

alter table public.premium_questions enable row level security;

create table if not exists public.premium_invites (
  email text primary key check (email = lower(email) and char_length(email) <= 320),
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now()
);

alter table public.premium_invites enable row level security;
