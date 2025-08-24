"use client"

import { submitBook } from '@/actions/submit-book.action';
import { BookCreationOptions } from '@/types/book';
import { Box, Typography, Button, Grid, Container, CircularProgress, Link, TextField, CardMedia } from '@mui/material';
import { useEffect, useState } from 'react';

function BookOutline({bookCreationOptions} : {bookCreationOptions: BookCreationOptions}) {

    const [storyItems, setStoryItems] = useState<string[]>([]);
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [coverImageError, setCoverImageError] = useState(false);

    useEffect(() => {

        const abortController = new AbortController();

        async function fetchData() {

            let text = "";

            const response = await fetch(`/api/generate-outline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idea: bookCreationOptions.idea}),
                signal: abortController.signal
            });

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                text += chunk;
                const storyItems = text.split(/\r\n|\r|\n/); // ChatGPT is instructed to separate streamed story items with line breaks
                setStoryItems(storyItems);
            } 
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

    function composeStoryItems() {
        return storyItems.map((item, index) => <TextField fullWidth type="text" key={ index } value={ item.trim() } label={ `Page ${index+1}` } sx={{ mb: 2 }} />);
    }

    function onSubmit() {
        const outline = storyItems.join('\n'); // TODO: Refactor so that outline is grabbed from inputs (use form submit?)
        submitBook(bookCreationOptions.idea, outline, coverImageUrl);
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
                    <Typography fontWeight={600} fontSize={24} color='#111927'>Your Story Outline</Typography>
                    <Typography  fontSize={14} color='#6C737F'>Edit any page summary below. Each one becomes a page in your book.</Typography>
                    { composeStoryItems() }
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={ onSubmit }>Unlock Full Book – $9.99</Button>
                    <Typography>We’ll write the full story from your outline. You can tidy the words before you download.</Typography>
                    <Link href="/">Back to the story creation page</Link>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BookOutline;