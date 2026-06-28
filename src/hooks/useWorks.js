import { useState, useEffect } from 'react'
import { getPublishedWorks } from '../lib/works'

/**
 * Fetches all published works.
 * @returns {{ works: import('../lib/types').Work[], loading: boolean, error: Error|null }}
 */
export function useWorks() {
  const [works, setWorks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getPublishedWorks()
      .then(data => { if (!cancelled) { setWorks(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  return { works, loading, error }
}
