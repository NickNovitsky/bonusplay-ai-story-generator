'use client'
import { Box, Typography, Button } from '@mui/material'

export default function UnlockPage() {
  const handleUpgrade = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: 'placeholder-book-id' }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4">Unlock Your Full Book ✨</Typography>
      <Typography sx={{ mt: 2 }}>
        Upgrade to unlock the full story, downloadable PDF, and narration options.
      </Typography>
      <Button variant="contained" sx={{ mt: 4 }} onClick={handleUpgrade}>
        Unlock Full Book – $9.99
      </Button>
    </Box>
  )
}
