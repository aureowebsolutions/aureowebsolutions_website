import { useState, useEffect } from 'react'
import { getBlog } from '../../lib/blogs'

export function useBlog(slug) {
  const [blog, setBlog]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!slug) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    getBlog(slug)
      .then(data => { if (!cancelled) { setBlog(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err);  setLoading(false) } })
    return () => { cancelled = true }
  }, [slug])

  return { blog, loading, error }
}
