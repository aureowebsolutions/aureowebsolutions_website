import { supabase } from './supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Uploads an image file to Supabase Storage and returns its public URL.
 *
 * Path convention (caller's responsibility):
 *   blog images  → `blog/{slug}-{timestamp}.ext`
 *   works images → `works/{slug}-{timestamp}.ext`
 *
 * The URL is stable and suitable for use directly in <img src>.
 * Images are served without CDN edge caching on the free tier — latency may
 * be higher for users outside the Supabase project region. No automatic
 * resize or format conversion is applied; images are served as uploaded.
 *
 * @param {string} bucket - Supabase Storage bucket name (use 'media')
 * @param {string} path   - Object path within the bucket
 * @param {File}   file   - File selected by the user
 * @returns {Promise<string>} Public URL of the uploaded image
 * @throws {Error} If validation fails or the upload errors
 */
export async function uploadImage(bucket, path, file) {
  if (!supabase) throw new Error('Supabase not configured')
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type "${file.type}". Allowed: jpg, png, webp.`)
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File exceeds 5 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`)
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
