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
                Using it create a complete story which must not consist of more than ten sentences.
                Do not include title. Do not use fancy formatting, use regular text.`},
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

        //await supabase.from('books').update({description: fullResponse}).eq('id', id);
        
        controller.close();
      }
    });

    return new NextResponse(stream);
}