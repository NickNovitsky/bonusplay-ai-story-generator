'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { BookCreationOptions } from "@/types/book";

export async function initBook(bookCreationOptions: BookCreationOptions) {

    const workflow = bookCreationOptions;

    const { data, error } = await supabase.from('books').insert({ workflow }).select().single();
    
    if (error) {
        console.error('Init book. Supabase insert error:', error);
        return false;
    }

    redirect(`${process.env.BASE_URL}/book/${data.id}`);
}