'use client'
import { Typography, Card, CardContent, CardMedia } from '@mui/material';

type Book = {
  coverImage: string,
  description: string,
  title: string
}

export function BookPreview({ book } : { book: Book }) {
  return (
    <Card sx={{ mt: 4 }}>
      <CardMedia
        component="img"
        height="300"
        image={book.coverImage || '/placeholder.jpg'}
        alt="Book cover"
      />
      <CardContent>
        <Typography variant="h5">{book.title}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{book.description}</Typography>
      </CardContent>
    </Card>
  )
}