/**
 * ADR-006: Slug como Primary Key en tabla blogs.
 *
 * Generates the value that becomes blogs.id (the PK). Call this when
 * creating a new post; do NOT call it again after the post is published —
 * renaming a published slug requires updating the PK, which breaks all
 * existing external links and any future FK references.
 *
 * @param {string} str - Typically the blog post title
 * @returns {string} URL-safe kebab-case slug
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
