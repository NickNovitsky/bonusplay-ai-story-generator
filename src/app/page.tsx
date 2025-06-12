'use client'
import { useRouter } from 'next/navigation'
// eslint-disable-next-line
import { useActionState, useState } from 'react'
import { Box, Button, TextField, Typography, Stack } from '@mui/material'

import { surpriseMe } from '@/actions/surprise-me.action';

export default function HomePage() {

  //const [state, surpriseMeAction, pending] = useActionState(surpriseMe, "");

  const [idea, setIdea] = useState('');
  const router = useRouter()

  const handleRoute = (type: 'surprise' | 'guide') => {
    if (!idea.trim()) return
    localStorage.setItem('user_idea', idea)
    router.push(`/${type}/start`)
  }

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
        <Button variant="outlined" onClick={() => surpriseMe(idea)}>
          🔮 Surprise Me
        </Button>
        <Button variant="contained" onClick={() => handleRoute('guide')}>
          🎛️ Let Me Guide It
        </Button>
      </Stack>
    </Box>
  )
}