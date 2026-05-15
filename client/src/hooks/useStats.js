import { useState, useEffect } from 'react'

export default function useStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats({ total: 12847, counts: {} }))
  }, [])

  return stats
}
