import { useEffect, useState } from 'react'

const MAX_USES = 3

export function useQuota() {
  const [usesLeft, setUsesLeft] = useState(MAX_USES)

  useEffect(() => {
    const used = parseInt(localStorage.getItem('bonusplay_uses') || '0', 10)
    setUsesLeft(Math.max(MAX_USES - used, 0))
  }, [])

  const registerUse = () => {
    const current = parseInt(localStorage.getItem('bonusplay_uses') || '0', 10)
    const next = current + 1
    localStorage.setItem('bonusplay_uses', String(next))
    setUsesLeft(Math.max(MAX_USES - next, 0))
  }

  const resetUses = () => {
    localStorage.removeItem('bonusplay_uses')
    setUsesLeft(MAX_USES)
  }

  return { usesLeft, registerUse, resetUses }
}
