import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';

export async function POST(req: NextRequest) {

  // TODO: Validate input parameters

  const json = await req.json();

  const { idea, layout, artStyle, mood, lighting, colorPalette } = json;

  const formattedPrompt = ` 
    Create an illustration for children inspired by: "${idea}". 
    
    Visual art direction: 
    - Art style: ${artStyle.replaceAll('-', ' ')} 
    - Mood: ${mood} 
    - Lighting: ${lighting} 
    - Color palette: ${colorPalette} 
    
    Instructions: 
    - Format should resemble a professionally illustrated children's storybook. 
    - Ensure layout is ${layout} with space for large, clear, 
    artistic title text. 
    - Use artistic font styles suitable for children's books. 
    - Title and image must appear harmoniously together as a cohesive book cover. 
    - Remember to keep character consistency for each subsequent page in the story. 
    `;

  const dalleRes = await openai.images.generate({
    model: 'dall-e-3',
    prompt: formattedPrompt,
    size: '1024x1024',
    quality: 'standard',
    n: 1
  })

  const url = dalleRes.data![0].url
  return NextResponse.json({ url });
}