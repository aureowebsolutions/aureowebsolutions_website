import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBlog } from '../../hooks/admin/useBlog'
import { saveBlog, checkBlogSlugExists } from '../../lib/blogs'
import { uploadImage } from '../../lib/storage'
import { slugify } from '../../lib/slugify'
import FormFeedback from '../../components/admin/FormFeedback'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const emptyBlock = (type = 'paragraph') => {
  if (type === 'heading')    return { type: 'heading', level: 2, text: '' }
  if (type === 'bullet_list') return { type: 'bullet_list', items: [''] }
  return { type: 'paragraph', text: '' }
}

const empty = {
  title: '',
  slug: '',
  author: '',
  date_published: new Date().toISOString().slice(0, 10),
  category: '',
  tags: [],
  image_url: '',
  is_published: false,
  content: [emptyBlock('paragraph')],
}

const BlogFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { blog, loading: blogLoading } = useBlog(isEdit ? id : null)

  const [form, setForm]               = useState(empty)
  const [errors, setErrors]           = useState({})
  const [tagInput, setTagInput]       = useState('')
  const [imageFile, setImageFile]     = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageError, setImageError]   = useState('')
  const [saving, setSaving]           = useState(false)
  const [feedback, setFeedback]       = useState(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const [slugWarning, setSlugWarning] = useState(false)
  const redirectTimer = useRef(null)

  useEffect(() => {
    if (blog) {
      setForm({
        title:          blog.title          ?? '',
        slug:           blog.id             ?? '',
        author:         blog.author         ?? '',
        date_published: blog.date_published ?? '',
        category:       blog.category       ?? '',
        tags:           blog.tags           ?? [],
        image_url:      blog.image_url      ?? '',
        is_published:   blog.is_published   ?? false,
        content:        blog.content?.length ? blog.content : [emptyBlock('paragraph')],
      })
      setImagePreview(blog.image_url ?? '')
      setOriginalSlug(blog.id ?? '')
    }
  }, [blog])

  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current) }, [])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const handleTitle = (e) => {
    const val = e.target.value
    set('title', val)
    if (!isEdit) {
      set('slug', slugify(val))
    }
  }

  const handleSlugChange = (e) => {
    const val = e.target.value
    set('slug', val)
    if (isEdit && form.is_published && val !== originalSlug) {
      setSlugWarning(true)
    } else {
      setSlugWarning(false)
    }
  }

  const handleTagKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().replace(/,$/, '')
      if (tag && !form.tags.includes(tag)) {
        set('tags', [...form.tags, tag])
      }
      setTagInput('')
    }
  }
  const removeTag = (t) => set('tags', form.tags.filter(x => x !== t))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageError('')
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
    if (!ALLOWED.includes(file.type)) {
      setImageError('Only JPG, PNG, WebP files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('File exceeds 5 MB limit.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // --- Block editor helpers ---
  const setBlock = (i, updated) => {
    const next = [...form.content]
    next[i] = updated
    set('content', next)
  }

  const addBlock = (type) => {
    set('content', [...form.content, emptyBlock(type)])
  }

  const removeBlock = (i) => {
    const next = form.content.filter((_, idx) => idx !== i)
    set('content', next.length ? next : [emptyBlock('paragraph')])
  }

  const moveBlock = (i, dir) => {
    const next = [...form.content]
    const swap = i + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[i], next[swap]] = [next[swap], next[i]]
    set('content', next)
  }

  const setBlockItem = (blockIdx, itemIdx, value) => {
    const block = { ...form.content[blockIdx], items: [...form.content[blockIdx].items] }
    block.items[itemIdx] = value
    setBlock(blockIdx, block)
  }
  const addBlockItem = (blockIdx) => {
    const block = { ...form.content[blockIdx], items: [...form.content[blockIdx].items, ''] }
    setBlock(blockIdx, block)
  }
  const removeBlockItem = (blockIdx, itemIdx) => {
    const block = { ...form.content[blockIdx], items: form.content[blockIdx].items.filter((_, i) => i !== itemIdx) }
    setBlock(blockIdx, block.items.length ? block : { ...block, items: [''] })
  }

  // --- Validation ---
  const validate = async () => {
    const newErrors = {}
    if (!form.title || form.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters.'
    }
    if (!form.slug) {
      newErrors.slug = 'Slug is required.'
    } else if (!SLUG_RE.test(form.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens.'
    } else {
      const slugChanged = form.slug !== originalSlug
      if (!isEdit || slugChanged) {
        const taken = await checkBlogSlugExists(form.slug, isEdit ? originalSlug : null)
        if (taken) newErrors.slug = 'This slug is already in use. Choose a different one.'
      }
    }
    if (!form.author || form.author.length < 2) {
      newErrors.author = 'Author must be at least 2 characters.'
    }
    if (!form.date_published) {
      newErrors.date_published = 'Publication date is required.'
    }
    // content: at least 1 block, no empty text
    const hasEmptyBlock = form.content.some(b => {
      if (b.type === 'bullet_list') return b.items.length === 0 || b.items.every(i => !i.trim())
      return !b.text || !b.text.trim()
    })
    if (hasEmptyBlock) newErrors.content = 'All blocks must have content. Remove empty blocks before saving.'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback(null)
    const newErrors = await validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSaving(true)
    try {
      let imageUrl = form.image_url
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `blog/${form.slug}-${Date.now()}.${ext}`
        imageUrl = await uploadImage('media', path, imageFile)
      }

      const payload = {
        id:             form.slug,
        title:          form.title,
        author:         form.author,
        date_published: form.date_published,
        category:       form.category,
        tags:           form.tags,
        image_url:      imageUrl,
        is_published:   form.is_published,
        content:        form.content,
      }
      await saveBlog(payload)
      setFeedback({ type: 'success', message: 'Post saved successfully.' })
      redirectTimer.current = setTimeout(() => navigate('/admin/blog'), 1500)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (isEdit && blogLoading) {
    return (
      <div>
        <div className="admin-page__header">
          <h1 className="admin-page__title">Edit Post</h1>
          <Link to="/admin/blog" className="admin-btn admin-btn--ghost">← Back</Link>
        </div>
        <p className="admin-empty">Loading…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">{isEdit ? 'Edit Post' : 'New Post'}</h1>
        <Link to="/admin/blog" className="admin-btn admin-btn--ghost">← Back</Link>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="title">Title</label>
          <input
            id="title"
            className="admin-input"
            value={form.title}
            onChange={handleTitle}
            placeholder="How We Grew a Shopify Store by 340%"
          />
          {errors.title && <p className="admin-field__error">{errors.title}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="slug">Slug</label>
          <input
            id="slug"
            className="admin-input"
            value={form.slug}
            onChange={handleSlugChange}
            placeholder="how-we-grew-shopify-store"
          />
          {errors.slug && <p className="admin-field__error">{errors.slug}</p>}
          {slugWarning && (
            <p className="admin-field__warning">Changing the slug will break existing links to this post.</p>
          )}
          <p className="admin-field__hint">{window.location.origin}/blog/{form.slug || '…'}</p>
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="author">Author</label>
          <input
            id="author"
            className="admin-input"
            value={form.author}
            onChange={(e) => set('author', e.target.value)}
            placeholder="Jane Doe"
          />
          {errors.author && <p className="admin-field__error">{errors.author}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="date_published">Publication Date</label>
          <input
            id="date_published"
            className="admin-input"
            type="date"
            value={form.date_published}
            onChange={(e) => set('date_published', e.target.value)}
          />
          {errors.date_published && <p className="admin-field__error">{errors.date_published}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="category">Category</label>
          <input
            id="category"
            className="admin-input"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            placeholder="Shopify / SEO / Content"
          />
        </div>

        <div className="admin-field">
          <label className="admin-field__label">Tags</label>
          <div className="admin-tags">
            {form.tags.map(t => (
              <span key={t} className="admin-tag">
                {t}
                <button type="button" className="admin-tag__remove" onClick={() => removeTag(t)}>×</button>
              </span>
            ))}
            <input
              className="admin-tag-input"
              placeholder="Add tag, press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
            />
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-field__label">Cover Image</label>
          {imagePreview && (
            <div className="admin-upload__preview">
              <img src={imagePreview} alt="Cover preview" />
            </div>
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="admin-input" />
          {imageError && <p className="admin-field__error">{imageError}</p>}
        </div>

        <div className="admin-field admin-field--row">
          <label className="admin-field__label" htmlFor="is_published_blog">Published</label>
          <label className="admin-toggle">
            <input
              id="is_published_blog"
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set('is_published', e.target.checked)}
            />
            <span className="admin-toggle__track" />
          </label>
        </div>

        {/* Block editor */}
        <div className="admin-field">
          <label className="admin-field__label">Content</label>
          {errors.content && <p className="admin-field__error">{errors.content}</p>}

          <div className="admin-block-editor">
            {form.content.map((block, i) => (
              <div key={i} className="admin-block">
                <div className="admin-block__header">
                  <select
                    className="admin-input admin-block__type"
                    value={block.type}
                    onChange={(e) => {
                      const t = e.target.value
                      setBlock(i, emptyBlock(t))
                    }}
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="heading">Heading</option>
                    <option value="bullet_list">Bullet List</option>
                  </select>
                  <div className="admin-block__controls">
                    <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} title="Move up">↑</button>
                    <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === form.content.length - 1} title="Move down">↓</button>
                    <button type="button" onClick={() => removeBlock(i)} title="Remove block" className="admin-block__remove">✕</button>
                  </div>
                </div>

                {block.type === 'paragraph' && (
                  <textarea
                    className="admin-input"
                    rows={4}
                    value={block.text}
                    onChange={(e) => setBlock(i, { ...block, text: e.target.value })}
                    placeholder="Enter paragraph text…"
                  />
                )}

                {block.type === 'heading' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      className="admin-input"
                      style={{ width: 80, flexShrink: 0 }}
                      value={block.level}
                      onChange={(e) => setBlock(i, { ...block, level: Number(e.target.value) })}
                    >
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                      <option value={4}>H4</option>
                    </select>
                    <input
                      className="admin-input"
                      value={block.text}
                      onChange={(e) => setBlock(i, { ...block, text: e.target.value })}
                      placeholder="Heading text…"
                    />
                  </div>
                )}

                {block.type === 'bullet_list' && (
                  <div className="admin-bullet-list">
                    {block.items.map((item, j) => (
                      <div key={j} className="admin-bullet-item">
                        <input
                          className="admin-input"
                          value={item}
                          onChange={(e) => setBlockItem(i, j, e.target.value)}
                          placeholder={`Item ${j + 1}…`}
                        />
                        <button
                          type="button"
                          className="admin-block__remove"
                          onClick={() => removeBlockItem(i, j)}
                          disabled={block.items.length === 1}
                          title="Remove item"
                        >✕</button>
                      </div>
                    ))}
                    <button type="button" className="admin-btn admin-btn--ghost admin-add-item" onClick={() => addBlockItem(i)}>
                      + Add Item
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="admin-add-block">
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Add block:</span>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addBlock('paragraph')}>Paragraph</button>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addBlock('heading')}>Heading</button>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addBlock('bullet_list')}>Bullet List</button>
            </div>
          </div>
        </div>

        {feedback && <FormFeedback type={feedback.type} message={feedback.message} />}

        <div style={{ marginTop: 24 }}>
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BlogFormPage
