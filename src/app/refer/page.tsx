'use client'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useEffect, useState } from 'react'

export default function ReferPage() {
  const [refCode, setRefCode] = useState('')

  useEffect(() => {
    const code = localStorage.getItem('refCode') || crypto.randomUUID().slice(0, 8)
    localStorage.setItem('refCode', code)
    setRefCode(code)
  }, [])

  const referralLink = `https://bonusplay.com/?ref=${refCode}`

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4">Share and Earn 📣</Typography>
      <Typography sx={{ mt: 2 }}>
        Share your referral link. Get rewards when friends buy books.
      </Typography>
      <TextField fullWidth value={referralLink} inputProps={{ readOnly: true }} sx={{ mt: 3 }} />
      <Button sx={{ mt: 2 }} onClick={() => navigator.clipboard.writeText(referralLink)}>
        Copy Link
      </Button>
    </Box>
  )
}
