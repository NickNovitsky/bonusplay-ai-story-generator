"use client"

import { submitBook } from '@/actions/submit-book.action';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useOutlineGeneration } from '@/hooks/useOutlineGeneration';
import { Book } from '@/types/book';
import { Box, Typography, Button, Grid, Container, CircularProgress, Link, TextField, CardMedia } from '@mui/material';
import { useState } from 'react';

function BookOutline({ book } : { book: Book }) {

    const { storyItems } = useOutlineGeneration(book);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { coverImageUrl, coverImageError } = useImageGeneration(book);

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

    async function handleSubmitBookClick() {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const outline = storyItems.join('\n'); // TODO: Refactor so that outline is grabbed from inputs (use form submit?)
        await submitBook(book.workflow.idea, outline, coverImageUrl);
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
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmitBookClick}>{ isSubmitting && "Wait..." || "Unlock Full Book – $9.99" }</Button>
                    <Typography>We’ll write the full story from your outline. You can tidy the words before you download.</Typography>
                    <Link href="/">Back to the story creation page</Link>
                </Grid>
            </Grid>
        </Box>
    )
}

export default BookOutline;