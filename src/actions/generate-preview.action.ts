'use server'

import { supabase } from "@/lib/supabase";

import openai from "@/lib/openai";

export async function generatePreview(bookId: string) {

    const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (!book.workflow.outline) return {
        "error": true
    }

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are given an outline for children's fun book as a list of short theses.
                    Understand main idea of the book and generate its title and short description.
                    Return title as a JSON property "title" and description as a JSON property "description"`},
            { role: 'user', content: book.workflow.idea }
        ],
        response_format: {
            type: "json_object"
        }
    });

    console.info('GPT response', gptResponse.choices[0]);

    const content = JSON.parse(gptResponse.choices[0].message.content || "");

    console.info(content);

    const title = content.title;
    const description = content.description;

    // Save to Supabase

    const { error } = await supabase.from('books').update({title: title, description: description}).eq('id', bookId);

    if (error) return {
        error: {
            message: "Internal error"
        }
    }

    return {
        result: {
            title: title,
            description: description
        }
    }
}