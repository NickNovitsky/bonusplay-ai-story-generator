'use client'

import { useState } from 'react'
import { Box, Button, TextField, Typography, Stack } from '@mui/material'

import { initBook } from '@/actions/init-book.action';

export default function HomePage() {

  const [idea, setIdea] = useState("");

  return (
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
        <Button variant="outlined" onClick={() => initBook(idea, false)}>
          🔮 Surprise Me
        </Button>
        <Button variant="contained" onClick={() => initBook(idea, true)}>
          🎛️ Let Me Guide It
        </Button>
      </Stack>
    </Box>
  )
}