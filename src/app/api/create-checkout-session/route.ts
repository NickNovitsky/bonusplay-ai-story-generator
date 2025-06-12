import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: NextRequest) {
  const { bookId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'BonusPlay AI Storybook' },
          unit_amount: 999,
        },
        quantity: 1,
      },
    ],
    metadata: {
      book_id: bookId,
    },
    success_url: `${process.env.BASE_URL}/book/${bookId}`,
    cancel_url: `${process.env.BASE_URL}/`,
  })

  return NextResponse.json({ url: session.url })
}
