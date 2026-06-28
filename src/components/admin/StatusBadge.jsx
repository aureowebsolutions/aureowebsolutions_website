import React from 'react'

const StatusBadge = ({ isPublished }) => (
  <span className={`admin-badge ${isPublished ? 'admin-badge--published' : 'admin-badge--draft'}`}>
    {isPublished ? 'Published' : 'Draft'}
  </span>
)

export default StatusBadge
