'use client'

import { Typography, Card, CardMedia, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { submitBook } from '@/actions/submit-book.action';
import { BookCreationOptions } from '@/types/book';

export function BookSummary({bookCreationOptions} : {bookCreationOptions: BookCreationOptions}) {

    const [creatingTextComplete, setCreatingTextComplete] = useState(false);
    const [text, setText] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [coverImageError, setCoverImageError] = useState(false);

    useEffect(() => {

        const abortController = new AbortController();

        async function fetchData() {

            const response = await fetch(`/api/generate-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idea: bookCreationOptions.idea}),
                signal: abortController.signal
            });

            if (response.headers.get('Content-Type') === 'application/json') {
                setText("Failed to obtain response");
                setCreatingTextComplete(true);
                return;
            }

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                setText(prev => prev + chunk);
            } 
            setCreatingTextComplete(true);
        }

        async function generateImage() {
            const response = await fetch(`/api/generate-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookCreationOptions),
                signal: abortController.signal
            });
            if (!response.ok) {
                return setCoverImageError(true);
            }
            const { url } = await response.json();
            setCoverImageUrl(url);
        }

        fetchData();
        generateImage();

        return () => {
            abortController.abort();
        }
        
    }, [bookCreationOptions]);

    return (
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography>{text || "Creating your wonderful book..."}</Typography>
            {creatingTextComplete && <Card sx={{ mt: 4, mb: 4, height: 512, width: 512, mx: 'auto' }}>
                {coverImageError && <Typography>Failed to obtain image</Typography>}
                {coverImageUrl && <CardMedia component="img" image={coverImageUrl} sx={{height: 512, width: 512}} alt="Book cover" />}
                {!coverImageUrl && !coverImageError && <Typography>Let me create a cover now...</Typography>}
            </Card>     
            }
            {creatingTextComplete && coverImageUrl && <Button variant="contained" sx={{ mt: 3 }} onClick={() => submitBook(bookCreationOptions.idea, text, coverImageUrl)}>Preview Final Version</Button>}
        </Box>
    )
}