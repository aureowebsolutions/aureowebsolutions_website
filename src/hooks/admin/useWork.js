import { useState, useEffect } from 'react'
import { getWorkById } from '../../lib/works'

export function useWork(id) {
  const [work, setWork]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    getWorkById(id)
      .then(data => { if (!cancelled) { setWork(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err);  setLoading(false) } })
    return () => { cancelled = true }
  }, [id])

  return { work, loading, error }
}
