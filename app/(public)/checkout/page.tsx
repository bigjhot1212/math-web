import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { COURSES, BUNDLES } from '@/content/course-videos'
import CheckoutClient from './checkout-client'

type SearchParams = Promise<{ type?: string; id?: string; ids?: string }>

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const { type, id, ids } = await searchParams
  if (type !== 'topic' && type !== 'bundle' && type !== 'cart') notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUrl = `/checkout?type=${type}&${type === 'cart' ? `ids=${ids}` : `id=${id}`}`
  if (!user) redirect(`/login?next=${encodeURIComponent(currentUrl)}`)

  let name: string
  let price: number
  let checkoutId: string

  if (type === 'topic') {
    if (!id) notFound()
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
    checkoutId = id
  } else if (type === 'bundle') {
    if (!id) notFound()
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
    checkoutId = id
  } else {
    const requestedIds = (ids ?? '').split(',').filter(Boolean)
    if (requestedIds.length === 0) redirect('/cart')

    const { data: ownedRows } = await supabase
      .from('topic_purchases')
      .select('topic_id')
      .eq('user_id', user.id)
      .in('topic_id', requestedIds)
    const ownedIds = new Set(ownedRows?.map((r) => r.topic_id) ?? [])

    const payableIds = requestedIds.filter((tid) => {
      const course = COURSES[tid]
      return course && course.status === 'available' && !ownedIds.has(tid)
    })
    if (payableIds.length === 0) redirect('/cart')

    name = payableIds.map((tid) => COURSES[tid].name).join(', ')
    price = payableIds.reduce((sum, tid) => sum + (COURSES[tid].price ?? 390), 0)
    checkoutId = payableIds.join(',')
  }

  return (
    <CheckoutClient
      type={type}
      id={checkoutId}
      name={name}
      price={price}
      email={user.email ?? ''}
    />
  )
}
