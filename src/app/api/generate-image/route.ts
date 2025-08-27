import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Book } from '@/types/book';

export async function POST(req: NextRequest) {

    // TODO: Validate input parameters

    const { book_id } = await req.json();

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', book_id).single();
  
    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    const { idea, artStyle, mood, lighting, colorPalette: colorScheme } = book.workflow;

    const title = await generateTitleFromIdea(idea);

    const formattedPrompt = ` 
    TASK: Create the FINAL FLAT 2D FRONT COVER for a children's picture book.
    Subject / scene: ${idea}.
    Art style: ${artStyle}.
    Mood: ${mood}.
    Lighting: ${lighting}.
    Color scheme: ${colorScheme}.

    Typography & title rules:
    • Render the EXACT title text on the cover: "${title}" (use the exact spelling & capitalization).
    • Stylize the title text to match the art style (e.g., hand-lettered or decorative typography consistent with ${artStyle} and ${mood}).
    • Keep the title highly legible at thumbnail size; ensure strong contrast with the background.
    • No other text, labels, logos, watermarks, UI elements, or captions.

    Composition rules:
    • Full-bleed illustration that fills the canvas edge-to-edge; straight-on (0°).
    • DO NOT depict a 3D book, mockup, desk, tabletop, frames, borders, spines, page edges, or perspective tilt.
    • DO NOT include any props or art tools: no palettes, paints, pencils, pens, brushes, erasers, paper, or stationery.
    • Keep a clear focal character/scene; avoid clutter behind the title area.
    • Child-friendly, cohesive, inviting look suited to a picture book.
    STRICT OVERRIDE: Flat, head-on 2D cover only. Absolutely no surrounding objects or surfaces or photography-style staging.
    `;

    try {
        const dalleRes = await openai.images.generate({
            model: 'dall-e-3',
            prompt: formattedPrompt,
            style: 'natural',
            size: '1024x1024',
            quality: 'standard',
            n: 1
        });
        const url = dalleRes.data![0].url

        const { error } = await supabase.from('books').update({ coverImageUrl: url }).eq('id', book_id);

        if (error) {
            console.error('Supabase update error:', error);
            //controller.enqueue(encoder.encode("{BOOK ID ERROR}"));
        }

        return NextResponse.json({ url });
    } catch (e) {
        console.error('ERROR: Error generating image', e);
    }
}

async function generateTitleFromIdea(idea: string) {

    const prompt = `You are given an idea for a children's book content.
        Create a title for this book`;
   
    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system', content: prompt},
            { role: 'user', content: idea }
        ]
    });

    return gptResponse.choices[0].message.content;
}