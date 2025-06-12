'use client'
import { Box, Typography, Button, Paper } from '@mui/material'
import { useEffect, useState } from 'react'

export default function GuidePreviewPage() {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const content = localStorage.getItem('user_edited_html') || ''
    setHtml(content)
  }, [])

  const handlePurchase = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Final Preview
      </Typography>
      <Typography sx={{ mb: 2 }}>Please review your story below before purchasing:</Typography>

      <Paper sx={{ border: '1px solid #ccc', p: 3, minHeight: 400 }} elevation={3}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Paper>

      <Button variant="contained" size="large" sx={{ mt: 4 }} onClick={handlePurchase}>
        Unlock & Download My Book – $9.99
      </Button>
    </Box>
  )
}
