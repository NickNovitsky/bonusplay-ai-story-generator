'use client';

import { Box, Button, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Book } from "@/types/book";

export default function BookComplete({book} : {book: Book}) {

    const [text, setText] = useState(book.text || '');
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    useEffect(() => {

        const abortController = new AbortController();
    
        async function fetchText() {

            const response = await fetch(`/api/generate-story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: book.id}),
                signal: abortController.signal
            });

            if (response.headers.get('Content-Type') === 'application/json') {
                setText("Failed to obtain response");
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
        }

        if (!book.text) fetchText();
        
        return () => {
            abortController.abort();
        }
    }, [book]);

    useEffect(() => {
        const paragraphs = text && text.split(/\r\n|\r|\n/).filter(p => p.trim() !== '') || [];
        setParagraphs(paragraphs);
    }, [text]);

    function onPrevButtonClick() {
        const prevPageIndex = currentPageIndex - 1;
        if (prevPageIndex >= 0) setCurrentPageIndex(prevPageIndex);
    }

    function onNextButtonClick() {
        const nextPageIndex = currentPageIndex + 1;
        if (nextPageIndex < paragraphs.length) setCurrentPageIndex(nextPageIndex);
    }

    return (
            <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 1280, mx: 'auto' }} bgcolor="#111927" p={1} borderRadius={3} className="relative">
                <Grid container bgcolor="white">
                    <Grid size={6} padding={2} className="border-r-1 border-r-gray-200">
                        <CardMedia component="img" image={book.coverImageUrl} sx={{height: 512, width: 512}} alt="Book cover" />
                    </Grid>
                    <Grid size={6} padding={2} className="relative border-l-1 border-l-gray-200">
                        <Typography fontSize={16} sx={{textAlign: "left", mb: 1}}>{ paragraphs[currentPageIndex] }</Typography>
                        <Typography variant="caption" className="absolute right-5 bottom-5">Page {currentPageIndex + 1}</Typography>
                    </Grid>
                </Grid>
                <Button className="absolute left-0" onClick={onPrevButtonClick}>Prev</Button>
                <Button className="absolute right-0" onClick={onNextButtonClick}>Next</Button>
            </Box>
        ) 
}