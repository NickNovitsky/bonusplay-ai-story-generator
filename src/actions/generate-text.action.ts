'use server'

import { supabase } from "@/lib/supabase";

import openai from "@/lib/openai";

export async function generateText(bookId: string) {

    const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (book.text) return {
        result: {
            text: book.text
        }
    }

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are given an outline for children's fun book as a list of short theses.
                    Understand main idea of the book and generate full text of the book.
                    Each of the provided theses must for a paragraph.
                    Separate every paragraph with line break.
                    Return text as a JSON property "text"`},
            { role: 'user', content: book.workflow.outline.join('\n') }
        ],
        response_format: {
            type: "json_object"
        }
    });

    console.info('GPT response', gptResponse.choices[0]);

    const content = JSON.parse(gptResponse.choices[0].message.content || "");

    console.info('Generated content:', content);

    // Save to Supabase

    const { error } = await supabase.from('books').update({text: content.text}).eq('id', bookId);

    if (error) return {
        error: {
            message: "Internal error"
        }
    }

    return {
        result: {
            text: content.text
        }
    }
}