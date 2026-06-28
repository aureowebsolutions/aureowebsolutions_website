import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorks } from '../../hooks/admin/useWorks'
import { deleteWork } from '../../lib/works'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import StatusBadge from '../../components/admin/StatusBadge'
import TableSkeleton from '../../components/admin/TableSkeleton'

const AdminWorksPage = () => {
  const { works, setWorks, loading, error } = useWorks()
  const [deleteTarget, setDeleteTarget]     = useState(null)
  const [isDeleting, setIsDeleting]         = useState(false)
  const [deleteError, setDeleteError]       = useState(null)

  const openDelete = (work) => {
    setDeleteError(null)
    setDeleteTarget(work)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteWork(deleteTarget.id)
      setWorks(prev => prev.filter(w => w.id !== deleteTarget.id))
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
        <h1 className="admin-page__title">Works</h1>
        <Link to="/admin/works/new" className="admin-btn">+ New Work</Link>
      </div>

      {deleteError && (
        <div className="form-feedback form-feedback--error" style={{ marginBottom: 16 }}>{deleteError}</div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Slug</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <TableSkeleton rows={5} cols={5} />}
          {!loading && !error && works.length === 0 && (
            <tr>
              <td colSpan={5} className="admin-empty">No works yet. Click &quot;+ New Work&quot; to add one.</td>
            </tr>
          )}
          {!loading && works.map(w => (
            <tr key={w.id}>
              <td>{w.client_name}</td>
              <td><code style={{ fontSize: 12, color: 'var(--muted)' }}>{w.slug}</code></td>
              <td>{w.sort_order}</td>
              <td><StatusBadge isPublished={w.is_published} /></td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/admin/works/${w.id}`} className="admin-btn admin-btn--ghost" style={{ height: 30, padding: '0 14px', fontSize: 13 }}>Edit</Link>
                  <button className="admin-btn admin-btn--danger" style={{ height: 30, padding: '0 14px', fontSize: 13 }} onClick={() => openDelete(w)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.client_name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default AdminWorksPage
