import { NextResponse } from 'next/server';

import openai from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {

  //console.info('body', request.json());

  
  // Variable `tone` is not used yet, but is planned to be used
  // eslint-disable-next-line
  const { idea, tone } = await request.json();

  const gptResponse = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
              { role: 'system',
                  content: `You are an assistant who creates fun children's books from ideas.
                      Create story title, description and a 7 items which briefly outline book structure.
                      Also generate full content of the book.
                      Each item must not exceed 10 words.
                      Put title as a JSON property "title", description as a JSON property "description", and array of items as a JSON property "outline".
                      Put text content as JSON property "text"`},
              { role: 'user', content: idea }
          ],
          response_format: {
              type: "json_object"
          }
      });
  
    console.info('GPT response', gptResponse.choices[0]);

    const content = JSON.parse(gptResponse.choices[0].message.content || "");

    console.info(content);

    // Save to Supabase
    const { data, error } = await supabase
        .from('books')
        //.insert([{ title: titleLine.trim(), description: descLine && descLine.trim(), idea, cover_image_url: coverImage, is_paid: false }])
        .insert({title: content.title, description: content.description, text: content.text})
        .select()
        .single();

    if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({ error: { message: "Internal app error"} }, { status: 500 });
    }

    const title = content.title;
    const outline = content.outline;

  return NextResponse.json({ id: data.id, title, outline }, { status: 200 });
}
