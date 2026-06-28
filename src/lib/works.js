import { supabase } from './supabase'

/** @returns {Promise<import('./types').Work[]>} */
export async function getPublishedWorks() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** @param {string} slug */
export async function getWork(slug) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

/** @param {import('./types').Work} work */
export async function saveWork(work) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('works')
    .upsert(work, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

/** @param {string} id */
export async function deleteWork(id) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase
    .from('works')
    .delete()
    .eq('id', id)
  if (error) throw error
}

/**
 * Fetch ALL works (published and drafts) for admin use.
 * @returns {Promise<import('./types').Work[]>}
 */
export async function getAllWorks() {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('works')
    .select('id, client_name, slug, is_published, sort_order, tags, metric_value, metric_label')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

/**
 * Fetch a single work by UUID for admin edit mode.
 * @param {string} id - UUID primary key
 * @returns {Promise<import('./types').Work>}
 */
export async function getWorkById(id) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/**
 * Check if a slug is already used by another work (for uniqueness pre-check, ADR-017).
 * @param {string} slug
 * @param {string|null} excludeId - UUID of the current record in edit mode
 * @returns {Promise<boolean>}
 */
export async function checkWorkSlugExists(slug, excludeId = null) {
  if (!supabase) throw new Error('Supabase not configured')
  let query = supabase.from('works').select('id').eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return data !== null
}
