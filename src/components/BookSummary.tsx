'use client'

import { Typography, CardMedia, Box, Button, Grid, CircularProgress, Container, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { submitBook } from '@/actions/submit-book.action';
import { Book } from '@/types/book';
import { useImageGeneration } from '@/hooks/useImageGeneration';

export function BookSummary({ book } : { book: Book }) {

    const [creatingTextComplete, setCreatingTextComplete] = useState(false);
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { coverImageUrl, coverImageError } = useImageGeneration(book);

    useEffect(() => {

        const abortController = new AbortController();

        async function fetchData() {

            if (book.workflow.summary) {
                setText(book.workflow.summary);
                setCreatingTextComplete(true);
                return;
            }

            const response = await fetch(`/api/generate-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: book.id }),
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

        fetchData();

        return () => {
            abortController.abort();
        }
        
    }, [book]);

    function composeCoverComponent() {
        if (coverImageUrl) return <CardMedia component="img" image={ coverImageUrl } className="object-cover" alt="Book cover" />
        if (coverImageError) return <Typography>Failed to generate cover</Typography>
        return (
            <>
                <CircularProgress />
                <Typography className="text-xs">Generating cover...</Typography>
            </>
        )
    }

    async function handleSubmitBookClick() {
        if (isSubmitting) return;
        setIsSubmitting(true);
        await submitBook(book.workflow.idea, text, coverImageUrl);
    }

    return (
        <Box sx={{ mt: 10, maxWidth: 1280, mx: 'auto' }} className="rounded-lg shadow-lg">
            <Grid container spacing={2} padding={2}>
                <Grid size={4}>
                    <Container className="aspect-square rounded-lg overflow-hidden">
                        { composeCoverComponent() }
                    </Container>                    
                </Grid>
                <Grid size={8}>
                    <Typography fontWeight={600} fontSize={24} color='#111927'>Story Summary</Typography>
                    <Typography mb={10} fontWeight={500} fontSize={16} lineHeight={2} color='#111927'>{text || "Creating your wonderful book..."}</Typography>
                    <Typography>Best for ages 0 to 8</Typography>
                    <Typography>Ready in under 60 seconds</Typography>
                    <Typography>Just $9.99 with 7-day ‘love it’ guarantee</Typography>
                    { creatingTextComplete && coverImageUrl &&
                    <>                    
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmitBookClick}>{ isSubmitting && "Wait..." || "Get My Book Now – $9.99" }</Button>
                    <Typography>(Safe, secure checkout in seconds)</Typography>
                    <Link href="/">Back to the story creation page</Link>
                    </>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}