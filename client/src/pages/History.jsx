import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../state/auth'

function fmt(ts) {
  try { return new Date(ts).toLocaleString() } catch { return String(ts) }
}

export default function History() {
  const { token, isAuthed, logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    if (!isAuthed) return
    setLoading(true)
    setError('')
    try {
      const data = await api.listChecks(token)
      setItems(data.items || [])
    } catch (e) {
      if (e.status === 401) logout()
      setError(`${e.code || 'ERROR'}: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  if (!isAuthed) {
    return (
      <div className="card">
        <h2>История проверок</h2>
        <div className="muted">Войди, чтобы увидеть историю.</div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="row">
        <h2>История проверок</h2>
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? 'Обновляем…' : 'Обновить'}
        </button>
      </div>

      {error && <div style={{ marginTop: 10 }} className="badge">{error}</div>}

      <div className="hr" />
      {items.length === 0 ? (
        <div className="muted">Пока нет проверок. Перейди в «Проверка» и создай первую.</div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {items.map(it => (
            <div key={it.id} className="card" style={{ padding: 12 }}>
              <div className="row">
                <div style={{ fontWeight: 700 }}>{it.label}</div>
                <span className="badge">{it.ok ? 'OK' : 'Есть пропуски'}</span>
              </div>
              <div className="muted" style={{ marginTop: 6 }}>
                {fmt(it.createdAt)}
              </div>
              <div className="muted" style={{ marginTop: 6 }}>
                missing: {(it.missing || []).length}, found: {(it.found || []).length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
