'use client'

import { useState } from 'react';

import SubmitIdea from '@/components/SubmitIdea';
import { BookCreationOptions } from '@/types/book';
import { initBook } from '@/actions/book';

export default function HomePage() {

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    async function handleSubmit(bookCreationOptions: BookCreationOptions) {
        if (isSubmitting) return;
        setIsSubmitting(true);
        await initBook(bookCreationOptions);
        setIsSubmitting(false);
    }

    return <SubmitIdea isSubmitting={ isSubmitting } onSubmit={ handleSubmit } />
}