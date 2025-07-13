'use client'

import { generateCover } from '@/actions/generate-cover';
import { generateOutline } from '@/actions/generate-outline';
import { generatePreview } from '@/actions/generate-preview.action';
import { generateText } from '@/actions/generate-text.action';
import { Typography, Card, CardContent, CardMedia, Box, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import UpgradeButton from './UpgradeButton';
import BookPreviewDescription from './BookPreviewDescription';

type Book = {
    id: string,
    coverImageUrl: string,
    description: string,
    title: string,
    workflow: {
        outline: string
    },
    text: string,
    is_paid: boolean
}

export function BookPreview({ book } : { book: Book }) {

    const [generatingOutline, setGeneratingOutline] = useState(true);
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [title, setTitle] = useState(book.title || "");
    const [text, setText] = useState("");

    useEffect(() => {
        async function run() {
            if (!book.workflow.outline) {
                await generateOutline(book.id);
            }
            setGeneratingOutline(false);
            runGenerateCover();            
            runGeneratePreview();
            if (book.is_paid) runGenerateText();
        }
        async function runGenerateCover() {
            if (!book.coverImageUrl) {
                const response = await generateCover(book.id);
                if (response.result) {
                    book.coverImageUrl = response.result.imageUrl || "";        
                } else {
                    book.coverImageUrl = "";
                }
            }
            setCoverImageUrl(book.coverImageUrl);
        }
        async function runGeneratePreview() {
            if (!book.title) {
                const response = await generatePreview(book.id);
                if (response.result) {
                    book.title = response.result.title;
                    book.description = response.result.description;
                }
            }
            setTitle(book.title);
        }
        async function runGenerateText() {
            if (!book.text) {
                const response = await generateText(book.id);
                if (response.result && response.result.text) {
                    book.text = response.result.text;
                }
            }
            setText(book.text);
        }
        run();

    }, [book]);

    if (generatingOutline) return <Typography>Creating your wonderful book...</Typography>

    return (
        <>
            <Card sx={{ mt: 4 }}>
                {
                    coverImageUrl === "" && <Typography>Generating cover...</Typography> ||
                    <CardMedia
                        component="img"
                        height="300"
                        image={book.coverImageUrl || coverImageUrl}
                        alt="Book cover"
                    />
                }
                <CardContent>
                    <Typography variant="h5">{title}</Typography>
                    <BookPreviewDescription bookId={book.id} />
                </CardContent>
            </Card>

            

            {!book.is_paid && <Box sx={{ mt: 4 }}>
                <UpgradeButton id={book.id} />
            </Box>}

            {book.is_paid &&
                <Box>
                    {text.split(/(?<!\\)\\n|\n/).filter(item => item !== "").map(p => {
                        return <Typography key={p} align="left" padding={1}>{p}</Typography>
                    })}
                </Box>
            }

            {book.is_paid && !text &&
                <Typography>Generating book...</Typography>
            }

            {book.is_paid && text !== "" &&
                <Link href={`/book/${book.id}/pdf`}>Get printed version</Link>
            }
            
        </>
    )
}