import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Book, BookWorkflow } from '@/types/book';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { renderTitleOverlayPNG } from '@/lib/titleOverlay';
import { TextModel } from '@/types/models';

export async function POST(req: NextRequest) {

    // TODO: Validate input parameters

    const { book_id } = await req.json();

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', book_id).single();
  
    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    try {

        const buffer = await generateImage(book.workflow);

        const title = await generateTitle(book.workflow.idea, book.workflow.textModel) || book.workflow.idea;

        // REVIEW: What if `title` is null?

        const overlayPng: Buffer = await renderTitleOverlayPNG({ width: 1024, height: 1024, title });

        const out = await sharp(buffer).composite([{ input: overlayPng, top: 0, left: 0 }]).jpeg().toBuffer();

        const filename = `${randomUUID()}.jpg`;
   
        const uploadResponse = await supabase.storage.from('images').upload(filename, out, { contentType: 'image/jpg', upsert: false });
            
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

async function generateImage(workflow: BookWorkflow): Promise<Buffer> {

    const { idea, artStyle, mood, lighting, colorPalette: colorScheme } = workflow;

    const formattedPrompt = ` 
        TASK: Create flat 2D FRONT COVER ART (background illustration only) for a children's picture book.
        Subject / scene: ${idea}.
        Art style: ${artStyle}.
        Mood: ${mood}.
        Lighting: ${lighting}.
        Color scheme: ${colorScheme}.
        Composition rules:
        • Full-bleed illustration, straight-on (0°).
        • Leave a calm, uncluttered region in the TOP-LEFT quadrant suitable for overlaid title text (clean gradients or light sky/water are fine).
        • DO NOT render any text of any kind.
        • DO NOT show a 3D book, mockup, desk, borders, spines, or props (palettes, brushes, pencils, paper, etc.).
        • Child-friendly, clear focal character/scene.
        STRICT OVERRIDE: Flat, head-on 2D cover only. Absolutely no surrounding objects or surfaces or photography-style staging.
        `;

    const imageResponse = await openai.images.generate({
        model: workflow.imageModel,
        prompt: formattedPrompt,
        style: workflow.imageModel === 'dall-e-3' && 'natural' || undefined,
        size: '1024x1024',
        quality: workflow.imageModel === 'dall-e-3' && 'standard' || 'low',
        n: 1,
        response_format: workflow.imageModel === 'dall-e-3' && 'b64_json' || undefined
    });

    const b64Json = imageResponse.data && imageResponse.data[0].b64_json;
    
    if (!b64Json) throw new Error('Unexpected response');

    return Buffer.from(b64Json, 'base64');
}

async function generateTitle(idea: string, model: TextModel): Promise<string|null> {
    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: 'system',
                content: `You are given an idea for a children's fun book.
                Create title for this book which must not exceed five words.
                Do not use fancy formatting, special characters, and quotation marks. Output only text.`},
            { role: 'user', content: idea }
        ]
    });
    return response.choices[0].message.content;
}