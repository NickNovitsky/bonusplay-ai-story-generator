'use client'

import { useState } from 'react';

import { BookPreview } from '@/components/BookPreview';
import BookOutline from '@/components/BookOutline';
import SubmitIdea from '@/components/SubmitIdea';
import { BookCreationOptions } from '@/types/book';

export default function HomePage() {

    const [ allowEditing, setAllowEditing ] = useState(false);

    const [bookCreationOptions, setBookCreationOptions] = useState<BookCreationOptions|null>(null);

    if (bookCreationOptions) {
        if (!allowEditing) return <BookPreview bookCreationOptions={ bookCreationOptions } />
        if (allowEditing) return <BookOutline bookCreationOptions={ bookCreationOptions } />
    }    

    function handleSubmit(bookCreationOptions: BookCreationOptions, allowEditing: boolean) {
        setAllowEditing(allowEditing);
        setBookCreationOptions(bookCreationOptions);
    }

    return <SubmitIdea onSubmit={ handleSubmit } />
}