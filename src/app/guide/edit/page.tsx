'use client'
import { useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function GuideEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [initialContent, setInitialContent] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || '<p>Loading...</p>',
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
  })

  useEffect(() => {
    const outline = JSON.parse(localStorage.getItem('user_outline') || '[]')
    const title = localStorage.getItem('user_title') || 'Your Story'
    const tone = localStorage.getItem('user_tone') || 'Whimsical'

    const formattedContent = `
      <h1>${title}</h1>
      <p><em>Tone: ${tone}</em></p>
      ${outline.map((o: string, i: number) => `<h3>Page ${i + 1}: ${o}</h3><p>Write your story here...</p>`).join('')}
    `
    setInitialContent(formattedContent)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  const handleContinue = () => {
    const rawHTML = editor?.getHTML() || ''
    localStorage.setItem('user_edited_html', rawHTML)
    router.push(`/book/${localStorage.getItem('book_id')}`);
  }

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Edit Your Story</Typography>
      {loading && <CircularProgress />}
      {!loading && editor && (
        <>
          <Box sx={{ border: '1px solid #ccc', p: 2, minHeight: 400, mt: 2 }}>
            <EditorContent editor={editor} />
          </Box>
          <Button variant="contained" sx={{ mt: 3 }} onClick={handleContinue}>
            Preview Final Version
          </Button>
        </>
      )}
    </Box>
  )
}
