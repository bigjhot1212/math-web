// Local-only Supabase stand-in. All writes are in memory and discarded on exit.
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const id = '11111111-1111-4111-8111-111111111111'
const now = () => new Date().toISOString()
const questions = JSON.parse(readFileSync(new URL('../content/questions/calculus.json', import.meta.url)))
assert.ok(questions.length > 0)
let role = 'student'
let failWrites = false
let user = makeUser()
let tables = makeTables()
function makeUser() {
  return { id, aud: 'authenticated', role: 'authenticated', email: role === 'admin' ? 'review-admin@example.test' : 'review-student@example.test', created_at: now(), app_metadata: { provider: 'google', providers: ['google'] }, user_metadata: { full_name: 'นักเรียน ทดสอบ' } }
}
function makeTables() {
  return {
    student_profiles: role === 'onboarding' ? [] : [{ user_id: id, full_name: 'นักเรียน ทดสอบ', grade: 'ม.6', school: 'โรงเรียนตัวอย่าง', target_faculty: 'วิศวกรรมศาสตร์', updated_at: now() }],
    user_progress: role === 'completed' ? Array.from({ length: 50 }, (_, i) => ({ id: `complete-${i}`, user_id: id, question_id: `fixture-complete-${i}`, topic_id: 'calculus', is_correct: i < 40, time_spent_seconds: 60, answered_at: now(), created_at: now() })) : role === 'empty' ? [] : questions.slice(0, 8).map((q, i) => ({ id: `progress-${i}`, user_id: id, question_id: q.id, topic_id: q.topicId, is_correct: i < 3, time_spent_seconds: 60 + i * 12, answered_at: now(), created_at: now() })),
    exam_sessions: [],
    topic_purchases: role === 'empty' ? [] : [{ id: 'purchase-review', user_id: id, topic_id: 'calculus', price_thb: 390, payment_method: 'bank_transfer', created_at: now() }],
    subscriptions: role === 'premium' ? [{ user_id: id, status: 'active' }] : [],
    bank_transfer_requests: [{ id: 'transfer-review', user_id: id, topic_id: 'calculus', price_thb: 390, amount: 390, amount_thb: 390, user_email: 'review-student@example.test', status: 'pending', created_at: now(), slip_url: '', email: 'review-student@example.test' }],
    course_invites: [], premium_questions: [], premium_invites: [],
  }
}
function session() {
  const exp = Math.floor(Date.now() / 1000) + 86400
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
  return { access_token: `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: id, exp, role: 'authenticated', aud: 'authenticated' })}.local-review`, refresh_token: 'local-review', token_type: 'bearer', expires_at: exp, expires_in: 86400, user }
}
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:54329')
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return }
  const json = (value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)) }
  if (url.pathname.startsWith('/review/')) {
    role = url.pathname.split('/')[2]
    assert.ok(['student', 'empty', 'premium', 'admin', 'onboarding', 'anonymous', 'completed'].includes(role))
    failWrites = url.searchParams.get('fail') === '1'
    user = makeUser(); tables = makeTables()
    const cookie = role === 'anonymous' ? 'sb-127-auth-token=; Max-Age=0' : `sb-127-auth-token=base64-${Buffer.from(JSON.stringify(session())).toString('base64url')}`
    res.writeHead(302, { 'Set-Cookie': `${cookie}; Path=/; HttpOnly; SameSite=Lax`, Location: `http://localhost:3001${url.searchParams.get('next') ?? '/dashboard'}` }).end(); return
  }
  if (url.pathname === '/auth/v1/user') return json(user)
  if (url.pathname === '/auth/v1/admin/users') return json({ users: [user], aud: 'authenticated', total: 1 })
  if (url.pathname === '/auth/v1/logout') return json({})
  if (url.pathname === '/auth/v1/token') return json(session())
  if (url.pathname.startsWith('/auth/v1/admin/users/')) return json({ user })
  if (url.pathname.startsWith('/storage/v1/')) {
    if (failWrites) return json({ message: 'Local review: upload unavailable' }, 500)
    return json({ Key: 'review/slip.png', signedURL: '/review-slip.png' })
  }
  if (!url.pathname.startsWith('/rest/v1/')) return json({ error: 'Unknown local fixture endpoint' }, 404)
  const table = url.pathname.split('/')[3]
  if (!(table in tables)) return json({ message: `Missing fixture table: ${table}` }, 404)
  let rows = tables[table]
  for (const [key, value] of url.searchParams) {
    if (value.startsWith('eq.')) rows = rows.filter(row => String(row[key]) === value.slice(3))
    if (value.startsWith('not.is.null')) rows = rows.filter(row => row[key] != null)
  }
  const single = req.headers.accept?.includes('vnd.pgrst.object')
  if (req.method === 'POST' || req.method === 'PATCH') {
    if (failWrites) return json({ message: 'Local review: write unavailable' }, 500)
    let body = ''; for await (const chunk of req) body += chunk
    const input = JSON.parse(body || '{}')
    if (req.method === 'POST') {
      const additions = (Array.isArray(input) ? input : [input]).map(row => ({ id: `review-${Date.now()}`, created_at: now(), answered_at: now(), ...row }))
      tables[table].push(...additions); rows = additions
    } else rows.forEach(row => Object.assign(row, input))
  }
  if (single) return rows.length ? json(rows[0]) : json({ code: 'PGRST116', message: 'No rows' }, 406)
  return json(rows)
})
server.listen(54329, '127.0.0.1', () => console.log('Local review fixtures ready on 127.0.0.1:54329; no external services'))
