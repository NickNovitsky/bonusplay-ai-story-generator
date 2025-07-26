import openai from "@/lib/openai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {

    const json = await request.json();

    const { data: book } = await supabase.from('books').select('*').eq('id', json.id).single();

    if (!book) return NextResponse.json({error: {message: "No book with specified ID"}}, {status: 500});

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are given an outline for children's fun book.
                Using it as a reference create a complete story consisting of 10-15 paragraphs.
                Do not use fancy formatting, use regular text. Separate paragraphs with single asterisks.`},
            { role: 'user', content: `${book.workflow.outline}` }
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