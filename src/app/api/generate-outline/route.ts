import openai from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const json = await request.json();

    //const { data: book } = await supabase.from('books').select('*').eq('id', id).single();

    //const idea = book.workflow.idea;

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are given an idea for children's fun book.
                Using it create 10 items (theses) which briefly outline book structure. Each item must not exceed 10 words.
                Separate items with line breaks;
                Do not number items. Do not use fancy formatting, use regular text.`},
            { role: 'user', content: json.idea }
        ],
        stream: true
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        //let fullResponse = '';
        for await (const chunk of gptResponse) {
          const content = chunk.choices[0]?.delta?.content || '';
          //fullResponse += content;
          controller.enqueue(encoder.encode(content));
        }

        /* const workflow = {
            idea: json.idea,
            outline: fullResponse
        }

        const { data, error } = await supabase.from('books').insert({workflow}).select().single();
        
        if (error) {
            console.error('Supabase insert error:', error);
            controller.enqueue(encoder.encode("{BOOK ID ERROR}"));
        }

        if (data) {
            controller.enqueue(encoder.encode(`{BOOK ID ${data.id}}`));
        } */
       
        controller.close();
      }
    });

    return new NextResponse(stream);
}