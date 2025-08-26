import openai from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import { Book } from "@/types/book";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    // TODO: Validate request parameters
    
    const { book_id } = await request.json();

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', book_id).single();

    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    // TODO: If book already contains summary, return it

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are given an idea for children's fun book.
                Using it create 10 items (theses) which briefly outline book structure. Each item must not exceed 10 words.
                Separate items with line breaks;
                Do not number items. Do not use fancy formatting, use regular text.`},
            { role: 'user', content: book.workflow.idea }
        ],
        stream: true
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let fullResponse = '';
            for await (const chunk of gptResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
            controller.enqueue(encoder.encode(content));
            }

            book.workflow.outline = fullResponse;

            const { error } = await supabase.from('books').update({ workflow: book.workflow }).eq('id', book_id);
            
            if (error) {
                console.error('Supabase update error:', error);
                //controller.enqueue(encoder.encode("{BOOK ID ERROR}"));
            }
        
            controller.close();
        }
    });

    return new NextResponse(stream);
}