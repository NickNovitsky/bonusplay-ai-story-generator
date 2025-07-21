'use client'

import { useState } from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';

import { BookPreview } from '@/components/BookPreview';
import BookOutline from '@/components/BookOutline';

export default function HomePage() {

    const [idea, setIdea] = useState("");
    const [bookPreviewVisible, showBookPreview] = useState(false);
    const [bookOutlineVisible, showBookOutline] = useState(false);

  return (
    <>
    {bookPreviewVisible && <BookPreview idea={idea} />}
    {bookOutlineVisible && <BookOutline idea={idea} />}
    {!bookPreviewVisible && !bookOutlineVisible &&
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h3" gutterBottom>
                Imagine your own book from just one idea...
            </Typography>

            <TextField
                label="What's your story idea?"
                fullWidth
                value={idea}
                onChange={e => setIdea(e.target.value)}
                sx={{ mt: 4 }}
            />

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                <Button variant="outlined" onClick={() => showBookPreview(true)}>🔮 Surprise Me</Button>
                <Button variant="contained" onClick={() => showBookOutline(true)}>🎛️ Let Me Guide It</Button>
            </Stack>
        </Box>
    }
    </>
  )
}