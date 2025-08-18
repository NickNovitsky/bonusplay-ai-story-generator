// Endpoint used to prevent Supabase instance pausing due to inactivity
// Supposed to be run by Vercel cron job
// Makes some dummy request to Supabase without doing any work

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
    await supabase.storage.listBuckets();
    return NextResponse.json({ success: true }, { status: 200 });
}