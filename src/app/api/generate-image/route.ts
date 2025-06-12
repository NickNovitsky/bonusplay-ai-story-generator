// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  const { imagePrompt } = await req.json()

  const dalleRes = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt,
    size: '1024x1024',
    quality: 'standard',
    n: 1
  })

  const imageUrl = dalleRes.data![0].url
  return NextResponse.json({ imageUrl })
}