import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { COURSES, BUNDLES } from '@/content/course-videos'
import CheckoutClient from './checkout-client'

type SearchParams = Promise<{ type?: string; id?: string }>

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const { type, id } = await searchParams
  if ((type !== 'topic' && type !== 'bundle') || !id) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout?type=${type}&id=${id}`)}`)

  let name: string
  let price: number

  if (type === 'topic') {
    const course = COURSES[id]
    if (!course || course.status !== 'available') notFound()

    const { data: owned } = await supabase
      .from('topic_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', id)
      .single()
    if (owned) redirect(`/course/${id}`)

    name = course.name
    price = course.price ?? 390
  } else {
    const bundle = BUNDLES[id]
    if (!bundle) notFound()

    const { data: owned } = await supabase
      .from('topic_purchases')
      .select('topic_id')
      .eq('user_id', user.id)
      .in('topic_id', bundle.topicIds)
    if (owned && owned.length > 0) redirect('/pricing')

    name = bundle.name
    price = bundle.price
  }

  return (
    <CheckoutClient
      type={type}
      id={id}
      name={name}
      price={price}
      email={user.email ?? ''}
    />
  )
}
