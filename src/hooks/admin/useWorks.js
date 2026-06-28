import { useState, useEffect, useCallback } from 'react'
import { getAllWorks } from '../../lib/works'

export function useWorks() {
  const [works, setWorks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(() => {
    let cancelled = false
    setLoading(true)
    getAllWorks()
      .then(data => { if (!cancelled) { setWorks(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err);  setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  useEffect(fetch, [fetch])

  return { works, setWorks, loading, error, refetch: fetch }
}
