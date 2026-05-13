import { NextRequest, NextResponse } from 'next/server'
import { saveRefreshToken } from '@/lib/google-classroom'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 })

  try {
    await saveRefreshToken(code)
    return NextResponse.json({ success: true, message: 'Google Classroom connected!' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 })
  }
}
