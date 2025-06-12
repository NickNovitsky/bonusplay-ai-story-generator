import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function uploadPdf(bookId: string, fileBytes: Uint8Array) {
  const filePath = `books/${bookId}.pdf`;
  // eslint-disable-next-line
  const { data, error } = await supabase.storage.from('books').upload(filePath, fileBytes, {
    contentType: 'application/pdf',
    upsert: true
  })

  if (error) throw error

  const { data: publicUrl } = supabase.storage.from('books').getPublicUrl(filePath)
  return publicUrl?.publicUrl
}
