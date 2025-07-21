'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

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

    redirect(`/book/${data.id}`);
}