import { BookPreview } from "@/components/BookPreview";
import { supabase } from "@/lib/supabase";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageParams = {
    params: Promise<{ id: string }>
}

async function Book({params} : PageParams) {

    const { id } = await params;

    const { data: book, error } = await supabase.from('books').select('*').eq('id', id).single();

    if (error) {
        console.info("Book page error:", error);
        return <Typography>Failed to obtain book data</Typography>
    }

    // If workflow.guided and no outline redirect to edit outline

    if (book.workflow.guided && !book.workflow.outline) redirect(`/book/${id}/guide`);

    return (        
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Link href="/">BonusPlay Main Page</Link>
            <BookPreview book={book}/>            
        </Box>
    )
}

export default Book;