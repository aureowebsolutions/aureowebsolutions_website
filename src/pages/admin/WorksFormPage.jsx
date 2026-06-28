import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useWork } from '../../hooks/admin/useWork'
import { saveWork, checkWorkSlugExists } from '../../lib/works'
import { uploadImage } from '../../lib/storage'
import { slugify } from '../../lib/slugify'
import FormFeedback from '../../components/admin/FormFeedback'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const empty = {
  client_name: '',
  slug: '',
  description: '',
  tags: [],
  image_url: '',
  image_alt: '',
  metric_value: '',
  metric_label: '',
  sort_order: 0,
  is_published: false,
}

const WorksFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { work, loading: workLoading } = useWork(isEdit ? id : null)

  const [form, setForm]             = useState(empty)
  const [errors, setErrors]         = useState({})
  const [tagInput, setTagInput]     = useState('')
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageError, setImageError] = useState('')
  const [saving, setSaving]         = useState(false)
  const [feedback, setFeedback]     = useState(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const redirectTimer = useRef(null)

  useEffect(() => {
    if (work) {
      setForm({
        client_name:  work.client_name  ?? '',
        slug:         work.slug         ?? '',
        description:  work.description  ?? '',
        tags:         work.tags         ?? [],
        image_url:    work.image_url    ?? '',
        image_alt:    work.image_alt    ?? '',
        metric_value: work.metric_value ?? '',
        metric_label: work.metric_label ?? '',
        sort_order:   work.sort_order   ?? 0,
        is_published: work.is_published ?? false,
      })
      setImagePreview(work.image_url ?? '')
      setOriginalSlug(work.slug ?? '')
    }
  }, [work])

  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current) }, [])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const handleClientName = (e) => {
    const val = e.target.value
    set('client_name', val)
    if (!isEdit) set('slug', slugify(val))
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

  const validate = async () => {
    const newErrors = {}
    if (!form.client_name || form.client_name.length < 2) {
      newErrors.client_name = 'Client name must be at least 2 characters.'
    }
    if (!form.slug) {
      newErrors.slug = 'Slug is required.'
    } else if (!SLUG_RE.test(form.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens.'
    } else {
      const slugChanged = form.slug !== originalSlug
      if (!isEdit || slugChanged) {
        const taken = await checkWorkSlugExists(form.slug, isEdit ? id : null)
        if (taken) newErrors.slug = 'This slug is already in use. Choose a different one.'
      }
    }
    if (form.sort_order === '' || isNaN(Number(form.sort_order))) {
      newErrors.sort_order = 'Sort order must be a number.'
    }
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
        const path = `works/${form.slug}-${Date.now()}.${ext}`
        imageUrl = await uploadImage('media', path, imageFile)
      }

      const payload = {
        ...form,
        image_url: imageUrl,
        sort_order: Number(form.sort_order),
        ...(isEdit ? { id } : {}),
      }
      await saveWork(payload)
      setFeedback({ type: 'success', message: 'Work saved successfully.' })
      redirectTimer.current = setTimeout(() => navigate('/admin/works'), 1500)
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (isEdit && workLoading) {
    return (
      <div>
        <div className="admin-page__header">
          <h1 className="admin-page__title">Edit Work</h1>
          <Link to="/admin/works" className="admin-btn admin-btn--ghost">← Back</Link>
        </div>
        <p className="admin-empty">Loading…</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">{isEdit ? 'Edit Work' : 'New Work'}</h1>
        <Link to="/admin/works" className="admin-btn admin-btn--ghost">← Back</Link>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="client_name">Client Name</label>
          <input
            id="client_name"
            className="admin-input"
            value={form.client_name}
            onChange={handleClientName}
            placeholder="Luz Candle Co."
          />
          {errors.client_name && <p className="admin-field__error">{errors.client_name}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="slug">Slug</label>
          <input
            id="slug"
            className="admin-input"
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="luz-candle-co"
          />
          {errors.slug && <p className="admin-field__error">{errors.slug}</p>}
          <p className="admin-field__hint">{window.location.origin}/work/{form.slug || '…'}</p>
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="admin-input"
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Short summary of the project…"
          />
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="metric_value">Metric Value</label>
          <input
            id="metric_value"
            className="admin-input"
            value={form.metric_value}
            onChange={(e) => set('metric_value', e.target.value)}
            placeholder="e.g. +340%"
          />
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="metric_label">Metric Label</label>
          <input
            id="metric_label"
            className="admin-input"
            value={form.metric_label}
            onChange={(e) => set('metric_label', e.target.value)}
            placeholder="e.g. Revenue Growth"
          />
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="sort_order">Sort Order</label>
          <input
            id="sort_order"
            className="admin-input"
            type="number"
            value={form.sort_order}
            onChange={(e) => set('sort_order', e.target.value)}
          />
          {errors.sort_order && <p className="admin-field__error">{errors.sort_order}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="image_alt">Image Alt Text</label>
          <input
            id="image_alt"
            className="admin-input"
            value={form.image_alt}
            onChange={(e) => set('image_alt', e.target.value)}
            placeholder="Luz Candle Co. homepage screenshot"
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
          <label className="admin-field__label" htmlFor="is_published_works">Published</label>
          <label className="admin-toggle">
            <input
              id="is_published_works"
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set('is_published', e.target.checked)}
            />
            <span className="admin-toggle__track" />
          </label>
        </div>

        {feedback && <FormFeedback type={feedback.type} message={feedback.message} />}

        <div style={{ marginTop: 24 }}>
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save Work'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default WorksFormPage
