import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!,
  )
}

export function getAuthUrl() {
  const oauth2 = getOAuthClient()
  return oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/classroom.rosters'],
  })
}

async function getAccessToken(): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('google_tokens')
    .select('refresh_token')
    .eq('id', 1)
    .single()
  if (!data?.refresh_token) throw new Error('Google refresh token not set')

  const oauth2 = getOAuthClient()
  oauth2.setCredentials({ refresh_token: data.refresh_token })
  const { credentials } = await oauth2.refreshAccessToken()
  return credentials.access_token!
}

export async function saveRefreshToken(code: string) {
  const oauth2 = getOAuthClient()
  const { tokens } = await oauth2.getToken(code)
  const supabase = await createClient()
  await supabase.from('google_tokens').upsert({ id: 1, refresh_token: tokens.refresh_token })
}

export async function inviteStudentToClassroom(courseId: string, studentEmail: string) {
  const accessToken = await getAccessToken()
  const oauth2 = getOAuthClient()
  oauth2.setCredentials({ access_token: accessToken })

  const classroom = google.classroom({ version: 'v1', auth: oauth2 })
  await classroom.invitations.create({
    requestBody: { courseId, userId: studentEmail, role: 'STUDENT' },
  })
}
