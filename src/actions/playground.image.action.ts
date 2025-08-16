'use server';

import openai from '@/lib/openai';

export interface DataState {
    url: string | undefined,
    prompt: string
}

export async function generateImage(initialState: DataState, formData: FormData) {

    const prompt = formData.get('prompt')?.toString() || '';

    const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            size: '1024x1024',
            quality: 'standard',
            n: 1
        });

        const url = response.data![0].url;

        return {
            url, prompt
        }
}