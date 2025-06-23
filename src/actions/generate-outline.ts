'use server'

import { supabase } from "@/lib/supabase";

import openai from "@/lib/openai";

export async function generateOutline(bookId: string) {

    const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (book.workflow.outline) return {
        result: {
            outline: book.workflow.outline
        }
    }

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are given an idea for children's fun book.
                    Create an outline of the book which must be 10 short theses which help to understand the structure of book being created.
                    Each thesis must be no longer than 7 words. Later each thesis is going to be converted into a full paragraph.
                    Return theses as a JSON property "outline" which must be an array of strings`},
            { role: 'user', content: book.workflow.idea }
        ],
        response_format: {
            type: "json_object"
        }
    });

    console.info('GPT response', gptResponse.choices[0]);

    const content = JSON.parse(gptResponse.choices[0].message.content || "");

    console.info(content);

    book.workflow.outline = content.outline;

    // Save to Supabase

    const { error } = await supabase.from('books').update({workflow: book.workflow}).eq('id', bookId);

    if (error) return {
        error: {
            message: "Internal error"
        }
    }

    return {
        result: {
            outline: book.workflow.outline
        }
    }
}