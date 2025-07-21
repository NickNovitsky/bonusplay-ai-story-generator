'use client'

import { Typography, Card, CardMedia, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { submitBook } from '@/actions/submit-book.action';

export function BookPreview({idea} : {idea: string}) {

    const [creatingTextComplete, setCreatingTextComplete] = useState(false);
    const [text, setText] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");

    useEffect(() => {

        async function fetchData() {

            const response = await fetch(`/api/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idea})
            });

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
                body: JSON.stringify({idea})
            });
            const { url } = await response.json();
            setCoverImageUrl(url);
        }

        fetchData();
        generateImage();
        
    }, [idea]);

    return (
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography>{text || "Creating your wonderful book..."}</Typography>
            {creatingTextComplete && <Card sx={{ mt: 4, mb: 4, height: 512, width: 512, mx: 'auto' }}>
                {coverImageUrl &&
                    <CardMedia component="img"
                        image={coverImageUrl}
                        sx={{height: 512, width: 512}}
                        alt="Book cover"
                    />
                || <Typography>Let me create a cover now...</Typography>
                }
            </Card>     
            }
            {creatingTextComplete && coverImageUrl && <Button variant="contained" sx={{ mt: 3 }} onClick={() => submitBook(idea, text, coverImageUrl)}>Preview Final Version</Button>}
        </Box>
    )
}