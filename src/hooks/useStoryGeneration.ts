import { Book } from "@/types/book";
import { useEffect, useState } from "react";

export function useStoryGeneration(book: Book) {

    const [text, setText] = useState(book.text || '');
    const [paragraphs, setParagraphs] = useState<string[]>([]);

    useEffect(() => {

        const abortController = new AbortController();
    
        async function fetchText() {

            const response = await fetch(`/api/generate-story`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: book.id}),
                signal: abortController.signal
            });

            if (response.headers.get('Content-Type') === 'application/json') {
                setText("Failed to obtain response");
                return;
            }

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                setText(prev => prev + chunk);
            }
        }

        if (!book.text) fetchText();
        
        return () => {
            abortController.abort('Component unmounted');
        }
    }, [book]);

    useEffect(() => {
        const paragraphs = text && text.split(/\r\n|\r|\n/).filter(p => p.trim() !== '') || [];
        setParagraphs(paragraphs);
    }, [text]);

    return { paragraphs }
}