import UpgradeButton from "@/components/UpgradeButton";
import { supabase } from "@/lib/supabase";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

type PageParams = {
    params: Promise<{ id: string }>
}

async function Book({params} : PageParams) {

    const { id } = await params;

    const { data: book } = await supabase.from('books').select('*').eq('id', id).single();

    return (
        <Box sx={{ textAlign: 'center', mt: 10, maxWidth: 600, mx: 'auto' }}>
            <Card sx={{ mt: 4 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={book.coverImage || '/book-cover-placeholder.png'}
                    alt="Book cover"
                />
                <CardContent>
                    <Typography variant="h5">{book.title}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>{book.description}</Typography>
                </CardContent>
            </Card>
            {book.is_paid && <Typography>{book.text}</Typography>}
            {!book.is_paid && <Box sx={{ mt: 4 }}>
                <UpgradeButton id={id} />
            </Box>}
        </Box>
    )
}

export default Book;