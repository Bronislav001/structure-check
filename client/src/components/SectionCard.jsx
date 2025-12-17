import React from 'react'

export default function SectionCard({ title, subtitle }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
    </div>
  )
}
