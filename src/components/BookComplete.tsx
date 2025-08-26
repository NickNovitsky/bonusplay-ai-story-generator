'use client';

import { Box, Button, CardMedia, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Book } from "@/types/book";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";

export default function BookComplete({book} : {book: Book}) {

    const { paragraphs } = useStoryGeneration(book);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

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