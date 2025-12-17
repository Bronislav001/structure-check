import React, { useState } from 'react'
import { api } from '../api'

const demoText = `Введение
Теоретическая часть
Практическая часть
Методология
Результаты
Выводы
Список литературы
Приложения`

export default function Validate() {
  const [text, setText] = useState(demoText)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onValidate(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = await api.validate({ text, lang: 'ru' })
      setResult(data)
    } catch (e) {
      setError(e.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid">
      <form className="card" onSubmit={onValidate}>
        <h2>Проверка структуры</h2>
        <textarea id="text" value={text} onChange={e => setText(e.target.value)} />
        <div style={{display:'flex', gap:'8px', marginTop:'8px'}}>
          <button type="submit" disabled={loading}>{loading ? 'Проверяю…' : 'Проверить'}</button>
        </div>
      </form>

      {error && <div className="card" style={{borderColor:'#fca5a5'}}>Ошибка: {error}</div>}

      {result && (
        <div className="card">
          <h2>Результаты проверки</h2>
          <p className="muted">ok: <b>{String(result.ok)}</b></p>
          {'missing' in result && <p>Отсутствуют: {Array.isArray(result.missing) ? result.missing.join(', ') : '-'}</p>}
          {'ai' in result && (
            <p><small className="dim">AI: {JSON.stringify(result.ai)}</small></p>
          )}
          <hr/>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
