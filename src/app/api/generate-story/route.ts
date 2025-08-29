import openai from "@/lib/openai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Book } from "@/types/book";

export async function POST(request: Request) {

    const json = await request.json();

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', json.id).single();

    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    if (!book.workflow.summary && !book.workflow.outline) return NextResponse.json({ error: { message: 'No summary or outline found'}}, { status: 500 });

    const gptResponse = await openai.chat.completions.create({
        model: book.workflow.textModel,
        messages: [
            { role: 'system',
                content: `You are given a summary of children's fun book.
                Using it as a reference create a complete story consisting of 10 paragraphs.
                Do not create title. Do not use fancy formatting, use regular text.
                Separate paragraphs with line breaks.`},
            { role: 'user', content: `${book.workflow.summary || book.workflow.outline}` }
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

            const { error } = await supabase.from('books').update({text: fullResponse}).eq('id', book.id);
            
            if (error) {
                console.error('Supabase insert error:', error);
                //controller.enqueue(encoder.encode("{BOOK ID ERROR}"));
            }
       
            controller.close();
        }
    });

    return new NextResponse(stream);
}