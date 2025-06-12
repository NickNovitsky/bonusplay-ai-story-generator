import { useState } from "react";

export function useGptStream() {
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState(null)

  const generate = async (idea: string, options?: { tone?: string; ageGroup?: string }) => {
    setLoading(true)

    const res = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, ...options }),
    })

    const data = await res.json()
    setStory(data.story)
    setLoading(false)
  }

  return { loading, story, generate }
}