'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import stripe from "@/lib/stripe";

export async function submitBook(idea: string, outline: string, coverImageUrl: string | null) {

    const workflow = {
        idea: idea,
        outline: outline
    }

    const { data, error } = await supabase.from('books').insert({workflow, coverImageUrl}).select().single();
    
    if (error) {
        console.error('Supabase insert error:', error);
        //controller.enqueue(encoder.encode("{BOOK ID ERROR}"));
    }

    if (data) {
        //controller.enqueue(encoder.encode(`{BOOK ID ${data.id}}`));
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
            book_id: data.id,
        },
        success_url: `${process.env.BASE_URL}/book/${data.id}`,
        cancel_url: `${process.env.BASE_URL}/`,
    });

    if (session.url) redirect(session.url);
}