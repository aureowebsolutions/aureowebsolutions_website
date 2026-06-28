import { useState, useEffect } from 'react'
import { getPublishedBlogs } from '../lib/blogs'

/**
 * Fetches all published blogs.
 * @returns {{ blogs: import('../lib/types').Blog[], loading: boolean, error: Error|null }}
 */
export function useBlogs() {
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getPublishedBlogs()
      .then(data => { if (!cancelled) { setBlogs(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err);  setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  return { blogs, loading, error }
}
