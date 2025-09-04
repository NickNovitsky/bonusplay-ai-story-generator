import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { ReactNode } from 'react';

export type TitleOverlayOpts = {
    width: number;
    height: number;
    title: string;
};

const fontCache: {
    baloo?: Buffer;
    nunito?: Buffer;
} = {};

async function loadFont(file: string) {
    const abs = path.join(process.cwd(), 'src', 'assets', 'fonts', file);
    const buffer: Buffer = await fs.readFile(abs);
    return buffer;
}

async function ensureFonts() {
    if (!fontCache.baloo) {
        fontCache.baloo = await loadFont('Baloo2-ExtraBold.ttf');
    }
    if (!fontCache.nunito) {
        fontCache.nunito = await loadFont('Nunito-Bold.ttf');
    }
}

function pickFontSize(title: string) {
    const len = title.trim().length;
    if (len <= 18) return 120;
    if (len <= 26) return 100;
    if (len <= 36) return 88;
    if (len <= 48) return 76;
    return 68; // long
}

export async function renderTitleOverlayPNG(opts: TitleOverlayOpts): Promise<Buffer> {

    await ensureFonts();

    const { width: w, height: h, title } = opts;

    const fsTitle = pickFontSize(title);

    const panelRadius = Math.round(w * 0.01);
    const textColor = '#1f2937'; // slate-800 for good legibility

    const jsx: ReactNode = {
        type: 'div',
        key: 'root',
        props: {
            style: { display: 'flex', width: `${w}px`, padding: '5%' },
            children: [
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', width: '100%', padding: '5%', background: '#fff9', borderRadius: `${panelRadius}px`, boxShadow: '0 2px 12px rgba(0,0,0,.2)' },
                        children: [
                            {
                                type: 'span',
                                props: {
                                    style: { display: 'block', fontFamily: 'Baloo2', color: textColor, fontWeight: 800, fontSize: `${fsTitle}px`, lineHeight: 1.05 },
                                    children: title
                                }
                            }
                        ]
                    }
                }
            ]
        }
    } as const;

    // Render to SVG with embedded fonts
    const svg = await satori(jsx, {
        width: w,
        height: h,
        fonts: [
            { name: 'Baloo2', data: fontCache.baloo!, weight: 800, style: 'normal' },
            { name: 'Nunito', data: fontCache.nunito!, weight: 700, style: 'normal' },
        ],
    });

    // Rasterize SVG -> PNG with resvg
    const resvg = new Resvg(svg, {
        // Keep default, we render at exact dimensions
        fitTo: { mode: 'width', value: w },
        background: 'rgba(0,0,0,0)',
    });
    const png = resvg.render().asPng(); // Uint8Array

    return Buffer.from(png);
}