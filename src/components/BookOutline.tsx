"use client"

import { generateOutline } from '@/actions/generate-outline';
import { submitOutline } from '@/actions/submit-outline.action';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

type Book = {
    id: string,
    coverImageUrl: string,
    description: string,
    title: string,
    workflow: {
        outline: string
    }
}

function BookOutline({ book } : { book: Book }) {

    const [initialContent, setInitialContent] = useState(book.workflow.outline);
    const [generatingOutline, setGeneratingOutline] = useState(true);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent || '<p>Loading...</p>',
        editorProps: {
          attributes: {
            class: 'editor-content',
          },
        },
    });

    useEffect(() => {
        async function run() {
            if (!book.workflow.outline) {
                const response = await generateOutline(book.id);
                const content = response.result && response.result.outline.map((item: string) => `<p>${item}</p>`).join('');
                setInitialContent(content);
            }
            setGeneratingOutline(false);
        }
        run();
    }, [book.workflow.outline, book.id]);

    useEffect(() => {
        if (editor && initialContent) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    return <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Edit Your Story</Typography>
            {generatingOutline && <CircularProgress />}
            {!generatingOutline && editor && (
                <>
                <Box sx={{ border: '1px solid #ccc', p: 2, minHeight: 400, mt: 2 }}>
                    <EditorContent editor={editor} />
                </Box>
                <Button variant="contained" sx={{ mt: 3 }} onClick={() => submitOutline(book.id, editor.getText())}>
                    Preview Final Version
                </Button>
                </>
            )}
        </Box>
}

export default BookOutline;