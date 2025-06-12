import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { uploadPdf } from '@/lib/uploadPdf'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(req: NextRequest) {
  const { bookId } = await req.json()
  const { data: book } = await supabase.from('books').select('*').eq('id', bookId).single()

  if (!book) return new Response('Book not found', { status: 404 })

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  // eslint-disable-next-line
  const { width, height } = page.getSize()

  page.drawText(book.title, { x: 50, y: height - 100, size: 24, font, color: rgb(0, 0, 0) })
  page.drawText(book.description, { x: 50, y: height - 140, size: 14, font, color: rgb(0, 0, 0) })

  const pdfBytes = await pdfDoc.save()
  const url = await uploadPdf(bookId, pdfBytes)

  return NextResponse.json({ url })
}
