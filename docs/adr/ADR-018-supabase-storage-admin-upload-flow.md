---
# ADR-018: Supabase Storage image upload — client-side validation before request and public URL persistence

## Status
Accepted

## Date
2026-06-27

## Context
ADR-004 established that Supabase Storage is the image backend and that the `uploadImage()` helper in `src/lib/storage.js` handles the upload and returns a public URL. The admin CRUD forms (WorksFormPage, BlogFormPage) need a file upload UI that integrates with this helper.

The specific decisions in this context are:
1. Where validation (file type, file size) happens — in the UI before the upload request, inside the helper, or at the server.
2. What is stored in the database — the full public URL, a relative path, or the file's binary content.
3. How the upload path is constructed to avoid naming collisions.

## Decision
We perform **client-side validation before the upload request** using the existing guards in `uploadImage()`:

```js
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

if (!ALLOWED_TYPES.includes(file.type)) throw new Error(...)
if (file.size > MAX_BYTES) throw new Error(...)
```

The form's `onChange` handler for the file input validates the file immediately upon selection (before the user clicks Submit) and shows an inline error below the input if validation fails. The upload to Supabase Storage is not attempted for invalid files.

Upload path convention:
- Blog images: `media/blog/{slug}-{Date.now()}.{ext}`
- Works images: `media/works/{slug}-{Date.now()}.{ext}`

The returned `data.publicUrl` is stored in the `image_url` column of the respective table. The database stores the full absolute URL, not a relative path.

In edit mode, if an existing `image_url` exists, it is displayed as a preview. Selecting a new file replaces the preview locally; the old Storage object is not deleted automatically (orphan cleanup is a manual task via the Supabase Studio dashboard).

## Alternatives Considered

**Store the image as base64 in the database** — embedding binary image data in a `TEXT` or `JSONB` column avoids the need for a separate storage service. Rejected because a single cover image at 1MB would inflate every blog list query response by 1MB per row. Supabase PostgREST row-size limits would be reached quickly, and rendering a list of posts would download all image data even for non-displayed thumbnails.

**Store a relative path and reconstruct the full URL in the client** — store only `blog/my-post-1234.jpg` and prepend the Supabase Storage base URL in the React renderer. Rejected because the base URL is environment-specific (local dev Supabase vs. cloud Supabase). Storing the absolute URL removes the need for environment-aware reconstruction at read time; the URL is valid wherever it resolves.

**Cloudinary or a third-party image CDN** — rejected per ADR-004: introduces a second vendor, second set of credentials, and second billing relationship for an upload volume that does not justify the added complexity.

## Consequences
### Positive
- Invalid files are rejected immediately in the UI, before any network request is made. The user sees a clear inline error ("Only JPG, PNG, WebP files are allowed") at the file input, not a generic API error.
- The `{slug}-{timestamp}` path convention means re-uploading a different image for the same record creates a new Storage object rather than overwriting the previous one, preserving the old URL as a fallback if needed.
- Storing the absolute public URL means the `<img src={work.image_url}>` pattern works with zero transformation in any environment where the Supabase project is accessible.

### Negative
- Replacing an image during an edit creates an orphaned Storage object (the old image is not deleted). Without a cleanup routine, orphaned images accumulate against the free-tier 1GB Storage limit.
- Client-side MIME type validation uses `file.type`, which is provided by the browser and can be spoofed by renaming a file. A server-side MIME sniff would be more reliable, but Supabase Storage does not provide per-upload MIME validation beyond what the client declares in `contentType`.
- No upload progress bar is provided by default — `supabase.storage.from(bucket).upload()` does not expose a progress callback. A progress bar would require the Fetch API with `ReadableStream` interception, adding implementation complexity.

### Neutral
- This ADR complements ADR-004 (storage backend selection). ADR-018 documents the admin upload flow: validation timing, path construction, and URL persistence strategy.
---
