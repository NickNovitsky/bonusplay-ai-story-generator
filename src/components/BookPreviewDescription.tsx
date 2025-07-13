import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function BookPreviewDescription({bookId}: {bookId: string}) {

    const [text, setText] = useState("");

    useEffect(() => {

        async function fetchData() {

            const response = await fetch(`/api/book/${bookId}/generate-description`);

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                setText(prev => prev + chunk);
            }
        }

        fetchData();
        
    }, [bookId]);

    return <Typography>{text}</Typography>
}