-- Read-only checks to run against the intended production project before migration.
-- No names, answers, or individual student records are returned.
select
  (select count(*) from (
    select user_id, exam_type from public.exam_sessions
    where exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$'
    group by user_id, exam_type having count(*) > 1
  ) duplicate_attempts) as duplicate_monthly_attempt_groups,
  (select count(*) from public.exam_sessions
    where exam_type ~ '^hunter-rank-[0-9]{4}-(0[1-9]|1[0-2])$'
      and submitted_at is not null) as completed_monthly_attempts,
  to_regclass('public.hunter_rank_results') is not null as rank_results_exist,
  to_regclass('public.hunter_rank_exam_sets') is not null as exam_sets_exist,
  exists (select 1 from pg_indexes where schemaname = 'public'
    and indexname = 'exam_sessions_one_hunter_rank_attempt_idx') as attempt_index_exists;

-- Stop if duplicate_monthly_attempt_groups is nonzero: creating the unique
-- index would fail. Review duplicates; never delete or rewrite them blindly.
-- Review completed_monthly_attempts before running the legacy backfill because
-- historical earned/penalty breakdowns cannot be reconstructed by SQL alone.
