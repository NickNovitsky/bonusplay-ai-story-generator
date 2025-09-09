import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Book, BookWorkflow } from '@/types/book';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { renderTitleOverlayPNG } from '@/lib/titleOverlay';
import { TextModel } from '@/types/models';

type ClarifiedBrief = {
  subject: string;           // short, unambiguous subject line
  setting: string;           // concise scene + background
  composition_hint: string;  // e.g., "main subject slightly right-of-center; keep top-left calm"
  style_hint: string;        // merges user artStyle/mood/lighting/palette into one crisp line
  forbid: string[];          // negative elements (props, frames, borders, UI, mockups, etc.)
};

export async function POST(req: NextRequest) {

    // TODO: Validate input parameters

    const { book_id } = await req.json();

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', book_id).single();
  
    if (error) return NextResponse.json({ error: { message: 'Book not found'}}, { status: 400 });

    try {

        const brief = await clarifyIdeaWithLLM(book.workflow, 'gpt-4o-mini');

        const buffer = await generateImage(brief, book.workflow);

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

async function generateImage(brief: ClarifiedBrief, workflow: BookWorkflow): Promise<Buffer> {    

    const styleNormalized = normalizeStyle(brief.style_hint);

    const formattedPrompt = `
        Create a SINGLE flat, borderless 2D SCENE ILLUSTRATION for a children’s picture book.
        Render ONLY the scene itself (characters and environment) as a tight, full-bleed square canvas.

        Subject: ${brief.subject}
        Setting: ${brief.setting}
        Composition: ${brief.composition_hint}
        Style: ${styleNormalized}

        ABSOLUTE RESTRICTIONS:
        • Do NOT depict any books, pages, spines, barcodes, layout guides, crop marks, frames, mats, borders, white bands, stickers, or UI.
        • Do NOT show studio props/tools: palettes, brushes, pencils, pens, paper, sketchbooks, easels, desks, swatches, color chips, or photographed sets.
        • Do NOT render any text, numbers, logos, watermarks, or captions.
        • The result must be a single, flat, full-bleed illustration only — nothing outside the scene.

        NEGATIVE CUES: ${brief.forbid.join(', ')}
        `.trim();

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

async function clarifyIdeaWithLLM(workflow: BookWorkflow, textModel: string): Promise<ClarifiedBrief> {
    const idea = (workflow.idea || '').trim();
    const artStyle = (workflow.artStyle || '').trim();
    const mood = (workflow.mood || 'friendly').trim();
    const lighting = (workflow.lighting || 'soft diffuse light').trim();
    const palette = (workflow.colorPalette || 'harmonious palette').trim();

    const sys = `You write *very short* JSON scene briefs for an image model.
        - Output must be valid JSON only (no prose).
        - Be specific but concise (single sentences).
        - Never include brand names or copyrighted characters.
        - Assume a square, flat 2D children's book *scene illustration* (not a mockup).`;

        const usr = `USER_IDEA: ${idea}

        CONTEXT:
        - Art style (optional): ${artStyle || 'none'}
        - Mood: ${mood}
        - Lighting: ${lighting}
        - Palette: ${palette}

        REQUIREMENTS:
        - subject: 1 short sentence describing the key characters and action, removing ambiguity.
        - setting: 1 short sentence describing the background/environment (single, continuous backdrop).
        - composition_hint: 1 short sentence encouraging a calm TOP-LEFT area for a future title; main subject slightly right-of-center.
        - style_hint: merge style/mood/lighting/palette into one crisp instruction suitable for an image model (no tool props).
        - forbid: array of concise negatives that prevent mockups, borders, frames, white margins, paper/canvas textures, studio tools (palettes/brushes/pencils), crop marks, barcodes, pages, spines, thumbnails, stickers, UI.

        Return JSON with keys: subject, setting, composition_hint, style_hint, forbid`;

    const r = await openai.chat.completions.create({
        model: textModel,
        temperature: 0.2,
        max_tokens: 220,
        messages: [
        { role: 'system', content: sys },
        { role: 'user', content: usr }
        ]
    });

    const raw = r.choices?.[0]?.message?.content || '{}';
    let brief: ClarifiedBrief;
    try {
        brief = JSON.parse(raw);
    } catch {
        // Fallback: very defensive defaults
        brief = {
        subject: idea || 'a friendly animal in a simple scene',
        setting: 'a single, continuous background suitable for a children’s illustration',
        composition_hint: 'main subject slightly right-of-center; keep the TOP-LEFT calm for a title overlay',
        style_hint: `${artStyle || 'whimsical digital illustration'}, ${mood}, ${lighting}, ${palette}`,
        forbid: [
            'any book or mockup elements', 'frames', 'borders', 'white margins',
            'crop marks', 'pages', 'spines', 'barcodes', 'stickers', 'thumbnails',
            'UI or captions', 'studio props (palettes, brushes, pencils, paper)'
        ]
        };
    }
    return brief;
}