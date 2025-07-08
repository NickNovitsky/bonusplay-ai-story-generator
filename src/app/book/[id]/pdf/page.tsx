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

        const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
        const bufferStream = new stream.PassThrough()
        doc.pipe(bufferStream)

        // Title page
        doc.fontSize(28).fillColor('#1a1a1a').text(book.title, {
        align: 'center',
        underline: true
        })
        doc.moveDown()
        doc.fontSize(18).fillColor('#444').text(`By Anonymous`, {
            align: 'center'
            })
        doc.addPage()

        // Story text page
        doc.fontSize(12).fillColor('#000').text(book.text, {
            align: 'left',
            lineGap: 6
        });        

        // Footer on every page except title
        const pageCount = doc.bufferedPageRange().count;
        for (let i = 1; i < pageCount; i++) {
            doc.switchToPage(i);
            doc.page.margins = {
                top : 0,
                bottom: 0,
                left: 0,
                right: 0,
            };
            doc.fontSize(8).fillColor('#888').text('Created with BonusPlay.com', 0, 800, {
                align: 'center',
                width: 595
            });
        }

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

        const { data: publicUrlData } = supabase.storage.from('books').getPublicUrl(filename);

        await supabase.from('books').update({pdf_url: publicUrlData.publicUrl}).eq('id', id);

        pdfUrl = publicUrlData.publicUrl;

    }

    return <Box sx={{ textAlign: 'center', mt: 6 }}><Link href={pdfUrl} target="_blank">Download PDF</Link></Box>
}

export default Page;