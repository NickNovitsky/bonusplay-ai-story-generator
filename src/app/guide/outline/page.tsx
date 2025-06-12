'use client'
import { useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, List, ListItem } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function GuideOutlinePage() {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [outline, setOutline] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [tone, setTone] = useState('Whimsical')
  const router = useRouter()

  useEffect(() => {
    const idea = localStorage.getItem('user_idea')
    if (!idea) return

    async function fetchOutline() {
      setLoading(true)
      const res = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, tone }),
      })
      const result = await res.json();
      setId(result.id);
      setOutline(result.outline)
      setTitle(result.title)
      setLoading(false)
    }

    fetchOutline()
  }, [tone])

  const handleContinue = () => {
    localStorage.setItem('book_id', id);
    localStorage.setItem('user_outline', JSON.stringify(outline))
    localStorage.setItem('user_title', title)
    localStorage.setItem('user_tone', tone)
    router.push('/guide/edit')
  }

  return (
    <Box sx={{ mt: 6, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Let&apos;s Plan Your Story
      </Typography>

      <FormControl fullWidth sx={{ mt: 4 }}>
        <InputLabel>Tone</InputLabel>
        <Select value={tone} label="Tone" onChange={(e) => setTone(e.target.value)}>
          <MenuItem value="Whimsical">Whimsical</MenuItem>
          <MenuItem value="Funny">Funny</MenuItem>
          <MenuItem value="Heartwarming">Heartwarming</MenuItem>
          <MenuItem value="Dramatic">Dramatic</MenuItem>
          <MenuItem value="Educational">Educational</MenuItem>
        </Select>
      </FormControl>

      {loading && <CircularProgress sx={{ mt: 4 }} />}

      {!loading && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>{title}</Typography>
          <List>
            {outline.map((item, idx) => (
              <ListItem key={idx}>{item}</ListItem>
            ))}
          </List>
          <Button variant="contained" sx={{ mt: 3 }} onClick={handleContinue}>
            Continue to Edit
          </Button>
        </>
      )}
    </Box>
  )
}
