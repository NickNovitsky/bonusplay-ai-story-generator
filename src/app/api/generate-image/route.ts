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

    const styleNorm = normalizeStyle(artStyle || '');

    const formattedPrompt = ` 
        Create a SINGLE flat, borderless 2D SCENE ILLUSTRATION for a children's picture-book.
        Render ONLY the scene itself (characters and environment) as if it is a square canvas cropped tightly to the edges.

        Subject / scene: ${idea}.
        Style: ${styleNorm || 'whimsical children’s illustration'}, ${mood || 'friendly'}, ${lighting || 'soft diffuse light'}, ${colorScheme || 'harmonious palette'}.

        Composition requirements:
        • Full-bleed illustration, straight-on (0°), no borders, no frames.
        • Leave a calm, uncluttered area in the TOP-LEFT for a future title overlay.
        • Crop tightly to the artwork — nothing outside the scene.

        ABSOLUTE RESTRICTIONS (must follow):
        • Do NOT depict any book, book cover, back cover, spine, pages, barcode, stickers, thumbnails, callouts, or packaging.
        • Do NOT show any props or studio materials: no palettes, brushes, pencils, pens, paper, tape, desks, or photography backgrounds.
        • Do NOT render any text, numbers, logos, watermarks, UI, or captions of any kind.
        • The output must be a single illustration only — no mockups, no product photos, no multi-panel layouts.
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

function normalizeStyle(style: string | undefined) {
  if (!style) return '';
  let s = style.trim();

  // Prevent studio props when users pick paint/pastel mediums.
  s = s.replace(/water\s*color|watercolor/gi, 'watercolor-look digital illustration, no paper texture, no paint splashes, no art tools');
  s = s.replace(/gouache/gi, 'gouache-look digital illustration, no paper texture, no art tools');
  s = s.replace(/pastel/gi, 'pastel-look digital illustration, no paper texture, no art tools');
  s = s.replace(/oil paint|oil painting/gi, 'oil-paint-look digital illustration, no canvas texture, no art tools');
  s = s.replace(/pencil|sketch/gi, 'clean line digital illustration, no pencils, no paper, no sketchbook');
  return s;
}