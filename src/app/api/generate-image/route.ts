import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { BookWorkflow } from '@/types/book';

export async function POST(req: NextRequest) {

    // TODO: Validate input parameters

    const { book_id } = await req.json();

    const { data: book, error } = await supabase.from('books').select('*').eq('id', book_id).single();
  
    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    const { artStyle, mood, lighting, colorPalette } = book.workflow;

    const bookCoverDescription = await generateImageGenerationPrompt(book.workflow);

    /* const formattedPrompt = ` 
    ${bookCoverDescription} 
    
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
    `; */

    const formattedPrompt = `${bookCoverDescription},
        ${artStyle.replaceAll('-', ' ')}, ${mood.replaceAll('-', ' ')} mood,
        ${lighting.replaceAll('-', ' ')} lighting, ${colorPalette.replaceAll('-', ' ')} colors`;

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

async function generateImageGenerationPrompt(workflow: BookWorkflow) {

    const prompt = `You are given an idea for a children's book content.
        Create a description for this idea illustration, consisting of just a few words.
        Description must contain subject, action, and environment.`;
   
    const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            { role: 'system', content: prompt},
            { role: 'user', content: workflow.idea }
        ]
    });

    return gptResponse.choices[0].message.content;
}