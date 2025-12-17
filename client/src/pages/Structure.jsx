import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Structure() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.templates()
      .then(data => setTemplates(data.templates || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="grid">


      {loading && <div className="card">Загрузка…</div>}
      {error && <div className="card" style={{borderColor:'#fca5a5'}}>Ошибка: {error}</div>}

      {!loading && !error && templates.map(t => (
        <div key={t.id} className="card">
          <h2>{t.title}</h2>
          <ul className="list">
            {t.sections.map(s => <li key={s}>• {s}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}
