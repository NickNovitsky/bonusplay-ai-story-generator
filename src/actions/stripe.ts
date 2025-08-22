'use server'

import stripe from "@/lib/stripe";

export async function createCheckoutSession(bookId: string) {

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
    });

    return session.url;
}