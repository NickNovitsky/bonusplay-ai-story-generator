'use server'

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function initBook(idea: string, guided: boolean) {

    // Save to Supabase

    const workflow = {
        idea: idea,
        guided: guided
    }

    const { data, error } = await supabase
        .from('books')
        .insert({workflow})
        .select()
        .single();

    if (error) {
        console.error('Supabase insert error:', error);
        return {
            error: "Error"
        }
    }

    redirect(`/book/${data.id}`);
}