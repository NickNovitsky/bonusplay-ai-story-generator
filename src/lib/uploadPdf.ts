import { supabase } from './supabase';

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
