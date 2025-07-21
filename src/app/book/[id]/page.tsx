import UpgradeButton from "@/components/UpgradeButton";
import { supabase } from "@/lib/supabase";
import { CardMedia, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";

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

    if (book.is_paid) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
                <Typography>Book paid. Finalize text generation.</Typography>
                <CardMedia component="img" image={book.coverImageUrl} sx={{height: 512, width: 512}} alt="Book cover" />
                <Typography>{book.workflow.outline}</Typography>
                
            </Box>
        )
    }

    return (        
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Link href="/">BonusPlay Main Page</Link>
            <CardMedia component="img" image={book.coverImageUrl} sx={{height: 512, width: 512}} alt="Book cover" />
            <Typography>{book.workflow.outline}</Typography>
            <UpgradeButton id={id} />
        </Box>
    )
}

export default Book;