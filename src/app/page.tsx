'use client'

import { useState } from 'react'
import { Box, Button, TextField, Typography, Stack, CardMedia, Card } from '@mui/material'

import { initBook } from '@/actions/init-book.action';

export default function HomePage() {

    const [idea, setIdea] = useState("");
    const [creatingText, setCreatingText] = useState(false);
    const [creatingTextComplete, setCreatingTextComplete] = useState(false);
    const [text, setText] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");

    async function generateImage(idea: string) {
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

    async function generateText(idea: string) {
        setCreatingText(true);
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

    function startBook(idea: string) {
        generateText(idea);
        generateImage(idea);
    }

  return (
    <>
    {!creatingText &&
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
                <Button variant="outlined" onClick={() => startBook(idea)}>🔮 Surprise Me</Button>
                <Button variant="contained" onClick={() => initBook(idea, true)}>🎛️ Let Me Guide It</Button>
            </Stack>
        </Box>
    }

    {(creatingText || creatingTextComplete) &&
        
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography>{text || "Just a moment..."}</Typography>
            {creatingTextComplete && <Card sx={{ mt: 4, mb: 4, height: 512, width: 512, mx: 'auto' }}>
                {coverImageUrl &&
                    <CardMedia component="img"
                        image={coverImageUrl}
                        sx={{height: 512, width: 512}}
                        alt="Book cover"
                    /> || <Typography>Let me create a cover now...</Typography>
                }
            </Card>      
            }      
        </Box>
    }
    </>
  )
}