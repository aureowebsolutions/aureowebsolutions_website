import { supabase } from './supabase'

/**
 * ADR-006: Slug as PK — all queries use .eq('id', slug) directly.
 * No JOIN, no secondary lookup. The slug IS the identifier.
 *
 * ADR-002: RLS enforces is_published = true for unauthenticated callers.
 * These functions rely on that policy — they do not add their own WHERE clause
 * for is_published on public-facing fetches.
 */

/**
 * Fetch all published blog posts ordered by date descending.
 * RLS policy "Public can read published blogs" filters unpublished rows.
 *
 * @returns {Promise<import('./types').Blog[]>}
 */
export async function getPublishedBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, author, date_published, category, tags, image_url, is_published')
    .order('date_published', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Fetch a single published blog post by slug (the PK).
 * ADR-006 positive consequence: direct .eq('id', slug) — no JOIN needed.
 *
 * @param {string} slug - The blog id / URL slug
 * @returns {Promise<import('./types').Blog>}
 * @throws If the post does not exist or is not published (RLS blocks it)
 */
export async function getBlog(slug) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * Upsert a blog post. Uses the slug as the PK (conflict target).
 *
 * WARNING (ADR-006 negative consequence): do not change the `id` field of a
 * published post. Renaming a published slug updates the PK and breaks all
 * external links. The admin UI must make the slug field read-only once
 * is_published is true.
 *
 * @param {import('./types').Blog} blog
 * @returns {Promise<import('./types').Blog>}
 */
export async function saveBlog(blog) {
  const { data, error } = await supabase
    .from('blogs')
    .upsert(blog, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a blog post by slug (PK).
 *
 * @param {string} slug
 * @returns {Promise<void>}
 */
export async function deleteBlog(slug) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', slug)

  if (error) throw error
}
