import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { inviteStudentToClassroom } from '@/lib/google-classroom'
import { COURSES } from '@/content/course-videos'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId) break

      if (session.metadata?.type === 'topic_purchase') {
        const topicId = session.metadata.topic_id
        if (topicId) {
          await supabase.from('topic_purchases').upsert({
            user_id: userId,
            topic_id: topicId,
            stripe_payment_intent_id: session.payment_intent as string,
          }, { onConflict: 'user_id,topic_id' })

          // Invite student to Google Classroom if available
          const course = COURSES[topicId]
          if (course?.classroomId) {
            const { data: userData } = await supabase.auth.admin.getUserById(userId)
            const email = userData?.user?.email
            if (email) {
              try {
                await inviteStudentToClassroom(course.classroomId, email)
              } catch (e) {
                console.error('Classroom invite failed:', e)
              }
            }
          }
        }
        break
      }

      if (!session.subscription) break
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }, { onConflict: 'user_id' })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase.from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
