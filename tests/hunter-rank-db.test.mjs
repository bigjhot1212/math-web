// Set HUNTER_TEST_PGLITE to an isolated installation of @electric-sql/pglite.
// This uses an in-memory database and never connects to the live project.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'

const moduleRoot = process.env.HUNTER_TEST_PGLITE
if (!moduleRoot) throw new Error('Set HUNTER_TEST_PGLITE to the pglite package directory')
const { PGlite } = await import(pathToFileURL(join(moduleRoot, 'dist', 'index.js')).href)
const { pgcrypto } = await import(pathToFileURL(join(moduleRoot, 'dist', 'contrib', 'pgcrypto.js')).href)

test('phase 0 migration installs immutable results and one-attempt constraint', async () => {
  const db = new PGlite({ extensions: { pgcrypto } })
  try {
    await db.exec(`
      create schema auth;
      create role authenticated;
      create role service_role;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
      create table public.exam_sessions (
        id uuid primary key, user_id uuid, exam_type text, score integer,
        total_questions integer, submitted_at timestamptz, question_ids jsonb
      );
      insert into auth.users values ('00000000-0000-0000-0000-000000000001');
    `)
    await db.exec(await readFile(new URL('../supabase/hunter-rank-phase0.sql', import.meta.url), 'utf8'))
    await db.exec("insert into exam_sessions values ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'hunter-rank-2026-11', null, 30, null, '[]')")
    await assert.rejects(db.exec("insert into exam_sessions values ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'hunter-rank-2026-11', null, 30, null, '[]')"), /duplicate key/i)
    await db.exec(`insert into hunter_rank_results
      (user_id, month_key, exam_session_id, exam_type, question_set_hash, earned_points, penalty_points,
       net_points, maximum_points, rating, rank_code, scoring_version, finalization_reason, submitted_at)
      values ('00000000-0000-0000-0000-000000000001', '2026-11', 'test-session', 'hunter-rank-2026-11',
        repeat('a', 64), 80, 0, 80, 100, 80, 'A', 'test', 'submitted', now())`)
    const audit = await db.query("select action from hunter_rank_audit_log where action = 'insert'")
    assert.equal(audit.rows.length, 1)
    await assert.rejects(db.exec("update hunter_rank_results set rating = 100 where exam_session_id = 'test-session'"), /immutable/i)
    await db.exec(`
      insert into auth.users values ('00000000-0000-0000-0000-000000000004');
      insert into hunter_rank_results
        (user_id, month_key, exam_session_id, exam_type, question_set_hash, earned_points, penalty_points,
         net_points, maximum_points, rating, rank_code, scoring_version, finalization_reason, submitted_at)
        values ('00000000-0000-0000-0000-000000000004', '2026-11', 'another-session', 'hunter-rank-2026-11',
          repeat('b', 64), 70, 0, 70, 100, 70, 'B', 'test', 'submitted', now());
      grant usage on schema public, auth to authenticated;
      grant select on hunter_rank_results to authenticated;
      set test.uid = '00000000-0000-0000-0000-000000000001';
      set role authenticated;
    `)
    const ownResults = await db.query('select user_id from hunter_rank_results')
    assert.equal(ownResults.rows.length, 1)
    assert.equal(ownResults.rows[0].user_id, '00000000-0000-0000-0000-000000000001')
  } finally { await db.close() }
})

test('published sets are immutable and only the server can write rank sessions', async () => {
  const db = new PGlite()
  try {
    await db.exec(`
      create schema auth;
      create role service_role;
      create table auth.users (id uuid primary key);
      create function auth.role() returns text language sql as $$ select current_setting('test.role', true) $$;
      create table public.exam_sessions (id uuid primary key, user_id uuid, exam_type text);
      insert into auth.users values ('00000000-0000-0000-0000-000000000001');
      set test.role = 'service_role';
    `)
    await db.exec(await readFile(new URL('../supabase/hunter-rank-exam-sets.sql', import.meta.url), 'utf8'))
    const questions = JSON.stringify(Array.from({ length: 30 }, (_, i) => ({ id: `q${i}` })))
    await db.query(`insert into hunter_rank_exam_sets (month_key, questions, updated_by) values ($1, $2::jsonb, $3)`, ['2026-12', questions, '00000000-0000-0000-0000-000000000001'])
    await db.exec("update hunter_rank_exam_sets set status = 'published' where month_key = '2026-12'")
    await assert.rejects(db.exec("update hunter_rank_exam_sets set questions = '[]'::jsonb where month_key = '2026-12'"), /immutable/i)
    await assert.rejects(db.exec("delete from hunter_rank_exam_sets where month_key = '2026-12'"), /immutable/i)
    await db.exec("set test.role = 'authenticated'")
    await assert.rejects(db.exec("insert into exam_sessions values ('00000000-0000-0000-0000-000000000002', null, 'hunter-rank-2026-12')"), /only be changed by the server/i)
    await db.exec("insert into exam_sessions values ('00000000-0000-0000-0000-000000000003', null, 'practice')")
    await assert.rejects(db.exec("update exam_sessions set exam_type = 'hunter-rank-2026-12' where id = '00000000-0000-0000-0000-000000000003'"), /only be changed by the server/i)
    await db.exec("set test.role = 'service_role'")
    await db.exec("insert into exam_sessions values ('00000000-0000-0000-0000-000000000002', null, 'hunter-rank-2026-12')")
  } finally { await db.close() }
})
