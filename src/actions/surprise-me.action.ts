'use server'

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

import openai from "@/lib/openai";

// This action performs generating of complete book from single idea

export async function surpriseMe(idea: string) {  

  //const title = formData.get('title');
  //const content = formData.get('content');

    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system',
                content: `You are an assistant who creates fun children's books from ideas.
                    Create story title, brief description, and full text of it using idea provided by user.
                    Put title as a JSON property "title", description as a JSON property "description", text as JSON property "text"`},
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
        return {
            error: "Error"
        }
    }

    redirect(`/book/${data.id}`);
}