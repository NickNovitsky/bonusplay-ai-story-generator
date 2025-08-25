import BookComplete from "@/components/BookComplete";
import UpgradeButton from "@/components/UpgradeButton";
import { supabase } from "@/lib/supabase";
import { Book } from "@/types/book";
import { CardMedia, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

type PageParams = {
    params: Promise<{ id: string }>
}

async function Page({params} : PageParams) {

    const { id } = await params;

    const { data: book, error } : PostgrestSingleResponse<Book> = await supabase.from('books').select('*').eq('id', id).single();

    if (error) {
        console.info("Book page error:", error);
        switch (error.code) {
            case 'PGRST116':
                return notFound();
        }
        return <Typography>Failed to obtain book data</Typography>
    }

    if (!book.is_paid) return (        
            <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
                <CardMedia component="img" image={book.coverImageUrl} sx={{height: 512, width: 512}} alt="Book cover" />
                <Typography>{book.workflow.outline}</Typography>
                <UpgradeButton id={id} />
            </Box>
        )

    return <BookComplete book={book} />
}

export default Page;