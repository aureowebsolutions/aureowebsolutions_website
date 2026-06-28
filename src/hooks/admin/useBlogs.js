import { useState, useEffect, useCallback } from 'react'
import { getAllBlogs } from '../../lib/blogs'

export function useBlogs() {
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(() => {
    let cancelled = false
    setLoading(true)
    getAllBlogs()
      .then(data => { if (!cancelled) { setBlogs(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err);  setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  useEffect(fetch, [fetch])

  return { blogs, setBlogs, loading, error, refetch: fetch }
}
