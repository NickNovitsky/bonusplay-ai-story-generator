import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Book } from '@/types/book';
import { base64ToBlob } from '@/lib/utils';
import { randomUUID } from 'node:crypto';

export async function POST(req: NextRequest) {

    // TODO: Validate input parameters

    const { book_id } = await req.json();

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', book_id).single();
  
    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    const { idea, artStyle, mood, lighting, colorPalette: colorScheme } = book.workflow;

    const formattedPrompt = ` 
    TASK: Create the FINAL FLAT 2D FRONT COVER for a children's picture book.
    Subject / scene: ${idea}.
    Art style: ${artStyle}.
    Mood: ${mood}.
    Lighting: ${lighting}.
    Color scheme: ${colorScheme}.

    Typography & title rules:
    • No text, labels, logos, watermarks, UI elements, or captions.

    Composition rules:
    • Full-bleed illustration that fills the canvas edge-to-edge; straight-on (0°).
    • DO NOT depict a 3D book, mockup, desk, tabletop, frames, borders, spines, page edges, or perspective tilt.
    • DO NOT include any props or art tools: no palettes, paints, pencils, pens, brushes, erasers, paper, or stationery.
    • Keep a clear focal character/scene; avoid clutter behind the title area.
    • Child-friendly, cohesive, inviting look suited to a picture book.
    STRICT OVERRIDE: Flat, head-on 2D cover only. Absolutely no surrounding objects or surfaces or photography-style staging.
    `;

    try {
        const imageResponse = await openai.images.generate({
            model: book.workflow.imageModel,
            prompt: formattedPrompt,
            style: book.workflow.imageModel === 'dall-e-3' && 'natural' || undefined,
            size: '1024x1024',
            quality: book.workflow.imageModel === 'dall-e-3' && 'standard' || 'low',
            n: 1,
            response_format: book.workflow.imageModel === 'dall-e-3' && 'b64_json' || undefined
        });

        const b64Json = imageResponse.data && imageResponse.data[0].b64_json;
        
        if (!b64Json) throw new Error('Unexpected response');
    
        const uploadResponse = await uploadToSupabase(b64Json, `${randomUUID()}.jpg`);
            
        if (uploadResponse.error) {
            throw new Error(uploadResponse.error.message);
        }
        
        const { data } = supabase.storage.from('images').getPublicUrl(uploadResponse.data.path);

        if (error) {
            console.error('Supabase update error:', error);
            //controller.enqueue(encoder.encode("{BOOK ID ERROR}"));
        }

        return NextResponse.json({ url: data.publicUrl });
    } catch (e) {
        console.error('ERROR: Error generating image', e);
    }
}

const uploadToSupabase = async (b64Data: string, fileName: string) => {
    // Convert base64 to blob
    const blob = base64ToBlob(b64Data, 'image/jpg');
    
    // Upload to Supabase Storage
    return await supabase.storage.from('images').upload(fileName, blob, { contentType: 'image/png', upsert: false });
  };