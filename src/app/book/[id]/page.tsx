import { BookPreview } from "@/components/BookPreview";
import { supabase } from "@/lib/supabase";
import Box from "@mui/material/Box";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageParams = {
    params: Promise<{ id: string }>
}

async function Book({params} : PageParams) {

    const { id } = await params;

    const { data: book } = await supabase.from('books').select('*').eq('id', id).single();

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