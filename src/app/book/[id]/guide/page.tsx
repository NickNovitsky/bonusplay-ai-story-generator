import BookOutline from "@/components/BookOutline";
import { supabase } from "@/lib/supabase";

import { redirect } from "next/navigation";

type PageParams = {
    params: Promise<{ id: string }>
}

async function Page({params} : PageParams) {

    const { id } = await params;

    const { data: book } = await supabase.from('books').select('*').eq('id', id).single();

    if (book.workflow.outline) redirect(`/book/${id}`);    

    return (  
        <BookOutline book={book} />        
    )
}

export default Page;