import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const AI_ENDPOINTS = ['/api/generate-summary', '/api/generate-outline', '/api/generate-image', '/api/generate-story'];

const aiEndpointsRateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(6, "1m"),
    ephemeralCache: new Map(),
    prefix: "@upstash/ratelimit/ai",
    analytics: true,
});

export async function middleware(request: NextRequest) {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
    if (AI_ENDPOINTS.includes(request.nextUrl.pathname)) {
        const { success } = await aiEndpointsRateLimit.limit(ip);
        if (!success) return NextResponse.json({ error: { message: 'Unable to process'}}, { status: 429 });
    }
}

export const config = {
    matcher: ['/api/generate-summary', '/api/generate-outline', '/api/generate-image', '/api/generate-story']
}