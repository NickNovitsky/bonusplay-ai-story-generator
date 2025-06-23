'use server'

import { supabase } from "@/lib/supabase";

import openai from "@/lib/openai";

export async function generateCover(bookId: string) {

    const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (!book.workflow.outline) return {
        error: true
    };

    const dalleRes = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `You are given a set of theses which formulate children's book content which is going to be created later.
        Using those theses understand main idea of the book.
        Using this idea generate children's book cover.
        Consider the following restrictions:
        - cover must not contain any text.
        - cover must consist of a single illustration (no pages or arrays of pictures)`,
        size: '1024x1024',
        quality: 'standard',
        n: 1
    });

    const imageUrl = dalleRes.data![0].url

    // Save to Supabase

    const { error } = await supabase.from('books').update({coverImageUrl: imageUrl}).eq('id', bookId);

    if (error) return {
        error: {
            message: "Internal error"
        }
    }

    return {
        result: {
            imageUrl: imageUrl
        }
    }
}