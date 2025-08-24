"use client"

import { submitBook } from '@/actions/submit-book.action';
import { BookCreationOptions } from '@/types/book';
import { Box, Typography, Button } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

function BookOutline({bookCreationOptions} : {bookCreationOptions: BookCreationOptions}) {

    const [text, setText] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: text || '<p>Loading...</p>',
        editorProps: {
          attributes: {
            class: 'editor-content',
          },
        },
    });

    useEffect(() => {
        if (editor && text) {
            editor.commands.setContent(text);
        }
    }, [editor, text]);

    useEffect(() => {

        async function fetchData() {

            const response = await fetch(`/api/generate-outline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idea: bookCreationOptions.idea})
            });

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                setText(prev => prev + chunk);
            } 
        }

        fetchData();
        
    }, [bookCreationOptions.idea]);

    return (
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Edit Your Story</Typography>
            <Box sx={{ border: '1px solid #ccc', p: 2, minHeight: 400, mt: 2 }}>
                <EditorContent editor={editor} />
            </Box>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => submitBook(bookCreationOptions.idea, editor!.getText(), null)}>
                Preview Final Version
            </Button>
        </Box>
    )
}

export default BookOutline;