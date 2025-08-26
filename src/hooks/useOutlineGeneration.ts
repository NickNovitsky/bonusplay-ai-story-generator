import { Book } from "@/types/book";
import { useEffect, useState } from "react";

export function useOutlineGeneration(book: Book) {

    const [storyItems, setStoryItems] = useState<string[]>([]);

    useEffect(() => {

        const abortController = new AbortController();

        async function fetchData() {

            if (book.workflow.outline) {
                const storyItems = book.workflow.outline.split(/\r\n|\r|\n/).filter(item => item !== ''); // Outline is expected to be line break separated
                setStoryItems(storyItems);
                return;
            }

            let text = "";

            const response = await fetch(`/api/generate-outline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: book.id }),
                signal: abortController.signal
            });

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                text += chunk;
                const storyItems = text.split(/\r\n|\r|\n/).filter(item => item !== ''); // ChatGPT is instructed to separate streamed story items with line breaks
                setStoryItems(storyItems);
            } 
        }

        fetchData();

        return () => {
            abortController.abort();
        }
        
    }, [book]);

    return { storyItems }
}