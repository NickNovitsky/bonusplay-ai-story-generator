import BookComplete from "@/components/BookComplete";
import BookOutline from "@/components/BookOutline";
import { BookSummary } from "@/components/BookSummary";
import { supabase } from "@/lib/supabase";
import { Book } from "@/types/book";
import { Typography } from "@mui/material";
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

    if (book.is_paid) return <BookComplete book={ book } />

    if (book.workflow.type === 'summary') return <BookSummary book={ book } />

    if (book.workflow.type === 'outline') return <BookOutline book={ book } />
}

export default Page;