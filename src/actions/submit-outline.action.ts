'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function submitOutline(bookId: string, outline: string) {

    const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single();

    const outlineArray = outline.split('\n');

    book.workflow.outline = outlineArray;

    // Save to Supabase

    const { error } = await supabase.from('books').update({workflow: book.workflow}).eq('id', bookId);

    if (error) return {
        error: {
            message: "Internal error"
        }
    }

    redirect(`/book/${bookId}`);
}