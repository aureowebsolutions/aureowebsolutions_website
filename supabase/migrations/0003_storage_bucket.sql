-- ADR-004: Supabase Storage para imágenes de blog y works
--
-- Creates a public bucket named "media" with two path prefixes:
--   media/blog/{slug}-{timestamp}.ext
--   media/works/{slug}-{timestamp}.ext
--
-- NOTE: The free tier provides 1GB of storage. Orphaned images (uploaded but
-- never saved to a record) count against this limit. There is no automatic
-- cleanup — remove them manually from the Supabase Storage dashboard.

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow unauthenticated users to read any object in the bucket (URLs are public).
CREATE POLICY "Public can read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users (admin) to upload, update, and delete objects.
CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');
