import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';

export async function POST(req: NextRequest) {

  // TODO: Validate input parameters

  const json = await req.json();

  const { idea, artStyle, mood, lighting, colorPalette } = json;

  const formattedPrompt = ` 
    Create the FINAL FLAT 2D FRONT COVER ARTWORK for a children's picture book.
    Subject: ${clean(idea)} 
    
    Visual art direction: 
    • Art style: ${artStyle.replaceAll('-', ' ')} 
    • Mood: ${mood} 
    • Lighting: ${lighting} 
    • Color scheme: ${colorPalette} 
    
    Composition requirements:
    • Full-bleed illustration that fills the entire canvas edge-to-edge.
    • Straight-on view (0°). NOT a 3D book, NOT a mockup, NOT a scene, NOT a photograph.
    • Do NOT include any surrounding objects or props: no tables, palettes, paints, pencils, brushes, frames, hands, books, or devices.
    • No borders, spines, pages, drop shadows, or perspective tilt.
    • No text or typography; the title will be added later by the app.
    • Child-friendly, cohesive design with a clear focal character.
    `;

  const dalleRes = await openai.images.generate({
    model: 'dall-e-3',
    prompt: formattedPrompt,
    style: 'natural',
    size: '1024x1024',
    quality: 'standard',
    n: 1
  })

  const url = dalleRes.data![0].url
  return NextResponse.json({ url });
}

const clean = (s: string) =>
    String(s || '').replace(/[^\w\s,&\-\./]/g, '').trim();