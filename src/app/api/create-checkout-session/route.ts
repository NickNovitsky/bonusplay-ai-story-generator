import stripe from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
  const { bookId } = await req.json()

    if (!process.env.STRIPE_BOOK_PRICE_ID) {
        console.error('Missing STRIPE_BOOK_PRICE_ID');
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }        

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: process.env.STRIPE_BOOK_PRICE_ID,
        quantity: 1
      },
    ],
    metadata: {
      book_id: bookId,
    },
    success_url: `${process.env.BASE_URL}/thankyou?bookId=${bookId}`,
    cancel_url: `${process.env.BASE_URL}/`,
  })

  return NextResponse.json({ url: session.url })
}