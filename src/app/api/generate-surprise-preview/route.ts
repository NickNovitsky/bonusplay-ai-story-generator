import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {

  const { idea } = await req.json();

  console.info('Idea', idea);

  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system',
        content: `You are an assistant who creates fun children's books from ideas.
        Create story title and a brief description of it using idea provided by user. Put title on one line and description on second line. Do not create empty lines.`},
      { role: 'user', content: idea }
    ]
  });

  console.info('GPT response', gptResponse.choices[0]);

  const [titleLine, descLine] = gptResponse.choices[0].message.content?.split('\n') || ['Untitled', 'No description'];

  // Placeholder GPT + DALL·E mock result
  const title = titleLine;
  const intro = descLine || `Once upon a time, in the heart of ${idea}, a remarkable journey began...`
  const coverImage = 'https://via.placeholder.com/400x300?text=Book+Cover';

  return NextResponse.json({ title, intro, coverImage }, { status: 200 });
}
