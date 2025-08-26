'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function submitBook(bookId: string, outline?: string) {

    const { data: book, error } = await supabase.from('books').select('*').eq('id', bookId).single();
      
    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    const { workflow } = book;

    if (outline && workflow.type === 'outline') {
        workflow.outline = outline;
        const { error } = await supabase.from('books').update({ workflow }).eq('id', bookId);
        if (error) {
            console.error('Supabase update error:', error);
        }
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
        success_url: `${process.env.BASE_URL}/book/${bookId}`,
        cancel_url: `${process.env.BASE_URL}/`,
    });

    if (session.url) redirect(session.url);
}