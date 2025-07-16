// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {

  const { idea } = await req.json();

  const dalleRes = await openai.images.generate({
    model: 'dall-e-3',
   prompt: `Cover for a children's book using this idea: ${idea}.
        Consider the following restrictions:
        - cover must not contain any text.
        - cover must consist of a single illustration (no pages or arrays of pictures)`,
    size: '1024x1024',
    quality: 'standard',
    n: 1
  })

  const url = dalleRes.data![0].url
  return NextResponse.json({ url });
}