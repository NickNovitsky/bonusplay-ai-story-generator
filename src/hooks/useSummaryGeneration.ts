import { Book } from "@/types/book";
import { useEffect, useState } from "react";

export function useSummaryGeneration(book: Book) {

    const [text, setText] = useState("");
    const [creatingTextComplete, setCreatingTextComplete] = useState(false);

    useEffect(() => {
    
        const abortController = new AbortController();

        async function fetchData() {

            if (book.workflow.summary) {
                setText(book.workflow.summary);
                setCreatingTextComplete(true);
                return;
            }

            const response = await fetch(`/api/generate-summary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: book.id }),
                signal: abortController.signal
            });

            if (response.headers.get('Content-Type') === 'application/json') {
                setText("Failed to obtain response");
                setCreatingTextComplete(true);
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
            setCreatingTextComplete(true);
        }

        fetchData();

        return () => {
            abortController.abort('Component unmounted');
        }
        
    }, [book]);

    return { text, creatingTextComplete }
}