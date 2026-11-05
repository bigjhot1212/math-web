# Hunter Rank System — Phase 0–2

## Product rules

- Hunter Rank comes only from the monthly standard exam.
- Practice, chapter exercises, and other exams never increase or decrease rank.
- Every month starts a new season and uses a new standard exam.
- Each learner receives one continuous attempt per month. Leaving the exam finalizes the answers already saved.
- Multiple-choice: correct `+3`, wrong `-3`, blank `0`.
- Short answer: correct `+5`, wrong `-5`, blank `0`.
- Net points cannot fall below zero. Rating is the net-point percentage, rounded to an integer from 0–100.
- Ranks: F `0–39`, E `40–49`, D `50–59`, C `60–69`, B `70–79`, A `80–89`, S `90–100`.
- Tied ratings share the same leaderboard position. Submission speed is not a tie-breaker.
- The leaderboard uses aliases that rotate each month. Rank recognition is cosmetic and never unlocks learning content or privileges.

## Phase 0 — Fair scoring foundation

- Server-side answer validation and scoring.
- Database-level one-attempt constraint for monthly exams.
- Immutable official result snapshot with question-set hash, scoring version, and finalization reason.
- Audit record for every inserted official result.
- Recovery paths for leaving, timing out, or reopening an unfinished exam.
- Automated tests for thresholds, scoring, ties, aliases, and exam-only rating.

## Phase 1 — Official leaderboard

- Leaderboard reads official monthly snapshots rather than practice activity.
- Current learner sees rating, rank, official-result status, and shared position.
- Other learners appear only through rotating monthly aliases.
- Clear rules explain negative marking, one attempt, monthly reset, and privacy.
- During migration rollout only, the page can fall back to completed exam sessions if the snapshot table is not available yet.

## Phase 2 — Hunter development path

- A dedicated `/hunter-guide` page gives the next recommended training focus for unranked learners and ranks F–S.
- The monthly cycle is explicit: measure → review → train → measure again next month.
- The page displays the learner's monthly alias and cosmetic rank emblem.
- Every step states that practice prepares the learner but does not change the current rank.
- All ranks retain equal access to learning content and course privileges.

## Safe rollout order

1. Review and apply `supabase/hunter-rank-phase0.sql` in the Supabase SQL editor.
2. Confirm the migration reports no duplicate monthly attempts. Do not delete duplicates automatically; review them manually if the unique index blocks migration.
3. Deploy the application code.
4. Complete one controlled monthly-exam run with a test learner and verify the official result, leaderboard alias, exit finalization, and result page.
5. Keep the feature private or marked coming soon until the approved release time.

No production migration, push, or deployment is performed by this branch automatically.
