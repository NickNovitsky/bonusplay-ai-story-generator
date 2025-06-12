import { Box, Typography, Button } from '@mui/material'

export default async function PrintPage({ params } : { params: Promise<{ id: string }>}) {
  const { id : bookId } = await params;
  const pdfUrl = `/books/${bookId}.pdf`

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4">Download for Print 📘</Typography>
      <Typography sx={{ mt: 2 }}>
        Download your book and upload to a print service like Lulu.
      </Typography>
      <Button variant="contained" sx={{ mt: 4 }} href={pdfUrl} download>
        Download PDF
      </Button>
    </Box>
  )
}
