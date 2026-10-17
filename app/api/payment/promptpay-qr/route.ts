import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนดู QR ชำระเงิน' }, { status: 401 })
  }

  const qrPath = path.join(process.cwd(), 'private-assets', 'payment', 'promptpay-qr.png')
  const qrImage = await readFile(qrPath)
  const shouldDownload = request.nextUrl.searchParams.get('download') === '1'

  return new NextResponse(qrImage, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `${shouldDownload ? 'attachment' : 'inline'}; filename="math-hunters-promptpay.png"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
