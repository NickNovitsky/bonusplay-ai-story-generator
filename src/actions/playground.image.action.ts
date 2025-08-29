'use server';

import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { base64ToBlob } from '@/lib/utils';
import { randomUUID } from 'crypto';

export interface DataState {
    url: string | undefined,
    model: string,
    prompt: string
}

export async function generateImage(initialState: DataState, formData: FormData) {

    const prompt = formData.get('prompt')?.toString() || '';
    const model = formData.get('model')?.toString() || '';

    const response = await openai.images.generate({
            model: model,
            prompt,
            style: model === 'dall-e-3' && 'natural' || undefined,
            size: '1024x1024',
            quality: model === 'dall-e-3' && 'standard' || 'low',
            n: 1,
            response_format: model === 'dall-e-3' && 'b64_json' || undefined
        });

    const b64Json = response.data && response.data[0].b64_json;

    if (!b64Json) throw new Error('Unexpected response');

    const uploadResponse = await uploadToSupabase(b64Json, `${randomUUID()}.jpg`);
      
    if (uploadResponse.error) {
        throw new Error(uploadResponse.error.message);
    }
    
    const { data } = supabase.storage.from('images').getPublicUrl(uploadResponse.data.path);

    return {
        url: data.publicUrl, model, prompt
    }
}

const uploadToSupabase = async (b64Data: string, fileName: string) => {
    // Convert base64 to blob
    const blob = base64ToBlob(b64Data, 'image/jpg');
    
    // Upload to Supabase Storage
    return await supabase.storage.from('images').upload(fileName, blob, { contentType: 'image/png', upsert: false });
  };