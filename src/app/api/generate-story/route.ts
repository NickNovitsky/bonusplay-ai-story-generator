import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {

  console.info('POST /api/generate-story');

  const { idea } = await req.json()
  //const ip = req.headers.get('x-forwarded-for') || 'unknown'

  // Call GPT-4-turbo to generate title and description
  const gptRes = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: `You are an assistant who creates fun children's books from ideas.` },
      { role: 'user', content: `Create a title and one-sentence description for a story based on this idea: "${idea}"` }
    ]
  })

  const [titleLine, descLine] = gptRes.choices[0].message.content?.split('\n') || ['Untitled', 'No description'];

  console.info('Title', titleLine);
  console.info('Description', descLine);

  // Generate book cover via DALL·E
  const imageRes = await openai.images.generate({
    prompt: `Children's book cover: ${idea}`,
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'standard',
    n: 1
  })

  const coverImage = imageRes.data![0].url;

  console.info('Cover image URL', coverImage);

  // Save to Supabase
  const { data, error } = await supabase
    .from('books')
    .insert([{ title: titleLine.trim(), description: descLine && descLine.trim(), idea, cover_image_url: coverImage, is_paid: false }])
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return new Response('Failed to save', { status: 500 })
  }

  console.info('Supabase data', data);  

  return NextResponse.json({
    id: data.id,
    title: data.title,
    description: data.description,
    coverImage: data.cover_image_url
  })
}