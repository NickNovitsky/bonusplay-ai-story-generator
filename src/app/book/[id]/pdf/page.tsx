import { supabase } from "@/lib/supabase";
import { Box, Link, Typography } from "@mui/material";
import PDFDocument from 'pdfkit';
import stream from 'stream';
import { promisify } from 'util';

type PageParams = {
    params: Promise<{ id: string }>
}

async function Page({params} : PageParams) {

    const { id } = await params;

    const { data: book } = await supabase.from('books').select('*').eq('id', id).single();

    let pdfUrl = book.pdf_url;

    if (!pdfUrl) {
        
        // Generate PDF
        const doc = new PDFDocument()
        const bufferStream = new stream.PassThrough()
        doc.pipe(bufferStream)
        doc.fontSize(20).text(book.title, { align: 'center' })
        doc.moveDown()
        doc.fontSize(12).text(`By Author`, { align: 'center' })
        doc.moveDown();
        book.text.split("\\n").map((p: string) => {
                doc.fontSize(14).text(p, { align: 'left' });
                doc.moveDown();
            }
        );
        
        doc.end();

        const getBuffer = async () => {
            const bufferChunks: Buffer[] = []
            bufferStream.on('data', (chunk) => bufferChunks.push(chunk))
            await promisify(stream.finished)(bufferStream)
            return Buffer.concat(bufferChunks)
        }

        const pdfBuffer = await getBuffer();

        // Upload to Supabase Storage
        const filename = `${id}.pdf`;
        const { data, error } = await supabase.storage.from('books').upload(filename, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: false,
        });

        if (data) console.info('Data:', data);

        if (error) console.error('Failed to generate PDF:', error);

        if (error) {
            return <Typography>Error generating PDF</Typography>
        }

        const { data: publicUrlData } = supabase.storage.from('books').getPublicUrl(`${id}.pdf`);

        await supabase.from('books').update({pdf_url: publicUrlData.publicUrl}).eq('id', id);

        pdfUrl = publicUrlData.publicUrl;

    }

    return <Box sx={{ textAlign: 'center', mt: 6 }}><Link href={pdfUrl} target="_blank">Download PDF</Link></Box>
}

export default Page;