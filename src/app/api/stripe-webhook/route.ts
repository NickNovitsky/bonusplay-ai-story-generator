import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' })
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(req: NextRequest) {
  console.info('stripe-webhook');
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookId = session.metadata?.book_id

      if (bookId) {
        await supabase
          .from('books')
          .update({ is_paid: true })
          .eq('id', bookId)
      }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return new Response('Webhook error', { status: 400 })
  }
}
