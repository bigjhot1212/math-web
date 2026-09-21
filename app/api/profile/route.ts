import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const fields = ['fullName', 'grade', 'province', 'desiredFaculty', 'desiredUniversity'] as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })

  const body = await request.json()
  const values = Object.fromEntries(fields.map((field) => [field, typeof body[field] === 'string' ? body[field].trim() : ''])) as Record<typeof fields[number], string>
  if (fields.some((field) => !values[field]) || Object.values(values).some((value) => value.length > 160)) {
    return NextResponse.json({ error: 'กรอกข้อมูลให้ครบและไม่เกิน 160 ตัวอักษร' }, { status: 400 })
  }

  const { error } = await supabase.from('student_profiles').upsert({
    user_id: user.id,
    full_name: values.fullName,
    grade: values.grade,
    province: values.province,
    desired_faculty: values.desiredFaculty,
    desired_university: values.desiredUniversity,
    updated_at: new Date().toISOString(),
  })
  if (error) return NextResponse.json({ error: 'บันทึกข้อมูลไม่สำเร็จ' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
