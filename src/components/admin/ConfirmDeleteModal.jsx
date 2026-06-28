import React, { useEffect, useRef } from 'react'

const ConfirmDeleteModal = ({ isOpen, itemName, onConfirm, onCancel, isDeleting }) => {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handleKey)
    cancelRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Delete permanently?</h2>
        <p className="modal-body">
          You are about to permanently delete <strong>«{itemName}»</strong>. This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button
            ref={cancelRef}
            className="admin-btn admin-btn--ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="admin-btn admin-btn--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
