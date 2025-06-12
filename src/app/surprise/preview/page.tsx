'use client'
import Image from 'next/image';
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

export default function SurprisePreviewPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ title: string, intro: string, coverImage: string } | null>(null)

  useEffect(() => {
    const idea = localStorage.getItem('user_idea')
    if (!idea) return

    async function fetchPreview() {
      setLoading(true)
      const res = await fetch('/api/generate-surprise-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      })
      const result = await res.json()
      setData(result)
      setLoading(false)
    }

    fetchPreview()
  }, [])

  return (
    <Box sx={{ textAlign: 'center', mt: 6 }}>
      {loading && <CircularProgress />}

      {!loading && data && (
        <>
          <Typography variant="h4" gutterBottom>{data.title}</Typography>
          <Image src={data.coverImage} alt="Book cover" style={{ maxHeight: 300, marginTop: 16 }} />
          <Typography variant="body1" sx={{ mt: 3 }}>{data.intro}</Typography>

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" size="large" href="/unlock">Unlock Full Book – $9.99</Button>
          </Box>
        </>
      )}
    </Box>
  )
}
