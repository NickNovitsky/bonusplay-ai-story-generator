import { Book } from "@/types/book";
import { useEffect, useState } from "react";

export function useImageGeneration(book: Book) {

    const [coverImageUrl, setCoverImageUrl] = useState<string|null>(null);
    const [coverImageError, setCoverImageError] = useState(false);

    useEffect(() => {
    
        const abortController = new AbortController();    

        async function generateImage() {
            if (book.coverImageUrl) {
                return setCoverImageUrl(book.coverImageUrl);
            }
            const response = await fetch(`/api/generate-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: book.id }),
                signal: abortController.signal
            });
            if (!response.ok) {
                return setCoverImageError(true);
            }
            const { url } = await response.json();
            setCoverImageUrl(url);
        }

        generateImage();

        return () => {
            abortController.abort('Component unmounted');
        }
        
    }, [book]);

    return { coverImageUrl, coverImageError }
}