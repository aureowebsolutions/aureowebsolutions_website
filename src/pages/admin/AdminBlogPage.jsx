import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBlogs } from '../../hooks/admin/useBlogs'
import { deleteBlog } from '../../lib/blogs'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import StatusBadge from '../../components/admin/StatusBadge'
import TableSkeleton from '../../components/admin/TableSkeleton'

const AdminBlogPage = () => {
  const { blogs, setBlogs, loading, error } = useBlogs()
  const [deleteTarget, setDeleteTarget]     = useState(null)
  const [isDeleting, setIsDeleting]         = useState(false)
  const [deleteError, setDeleteError]       = useState(null)

  const openDelete = (blog) => {
    setDeleteError(null)
    setDeleteTarget(blog)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteBlog(deleteTarget.id)
      setBlogs(prev => prev.filter(b => b.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(err.message)
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Blog</h1>
        <Link to="/admin/blog/new" className="admin-btn">+ New Post</Link>
      </div>

      {deleteError && (
        <div className="form-feedback form-feedback--error" style={{ marginBottom: 16 }}>{deleteError}</div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={5} cols={5} />}
          {!loading && !error && blogs.length === 0 && (
            <tr>
              <td colSpan={5} className="admin-empty">No posts yet. Click &quot;+ New Post&quot; to add one.</td>
            </tr>
          )}
          {!loading && blogs.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td style={{ whiteSpace: 'nowrap', color: 'var(--muted)', fontSize: 13 }}>{b.date_published}</td>
              <td><StatusBadge isPublished={b.is_published} /></td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/admin/blog/${b.id}`} className="admin-btn admin-btn--ghost" style={{ height: 30, padding: '0 14px', fontSize: 13 }}>Edit</Link>
                  <button className="admin-btn admin-btn--danger" style={{ height: 30, padding: '0 14px', fontSize: 13 }} onClick={() => openDelete(b)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.title ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminBlogPage
