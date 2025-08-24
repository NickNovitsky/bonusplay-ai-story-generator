import openai from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const json = await request.json();

    //const { data: book } = await supabase.from('books').select('*').eq('id', id).single();

    //const idea = book.workflow.idea;

    try {

      const gptResponse = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
              { role: 'system',
                  content: `You are given an idea for children's fun book.
                  Using it create a complete story which must not consist of more than ten sentences.
                  Include title in the beginning and separate it from further text with an asterisk.
                  Then include a description for book cover consisting of no more than five words,
                  suitable for providing it to image generation service, separated from further text with an asterisk.
                  Do not use fancy formatting, use regular text.`},
              { role: 'user', content: json.idea }
          ],
          stream: true
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          for await (const chunk of gptResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }
          
          controller.close();
        }
      });

      return new NextResponse(stream);

    } catch (e) {
      console.error('ChatGPT response error:', e);
      return NextResponse.json({error: {message: "Failed to obtain response"}}, {status: 500});
    }    
}