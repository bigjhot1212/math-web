import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentProfileForm from '../onboarding/student-profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fprofile')
  const { data: profile } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).maybeSingle()
  if (!profile) redirect('/onboarding?next=%2Fprofile')

  return <StudentProfileForm next="/dashboard" defaultName={profile.full_name} defaults={{
    grade: profile.grade, province: profile.province, desiredFaculty: profile.desired_faculty, desiredUniversity: profile.desired_university,
  }} mode="edit" />
}
