import React, { useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../state/auth'

const SAMPLE = [
  'Введение',
  'Теоретическая часть',
  'Практическая часть',
  'Методология',
  'Результаты',
  'Выводы',
  'Список литературы',
  'Приложения'
].join('\n');

export default function Validate() {
  const { token, isAuthed, logout } = useAuth()

  const [label, setLabel] = useState('Мой отчёт')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const missingText = useMemo(() => (result?.missing || []).join(', '), [result])
  const foundText = useMemo(() => (result?.found || []).join(', '), [result])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!isAuthed) {
      setError('Нужно войти, чтобы отправить проверку на сервер и сохранить в историю.')
      return
    }

    setLoading(true)
    try {
      const data = await api.createCheck(token, { label, text })
      setResult(data)
    } catch (e2) {
      if (e2.status === 401) logout()
      setError(`${e2.code || 'ERROR'}: ${e2.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="row">
          <h2>Проверка структуры</h2>
          <button className="btn" type="button" onClick={() => setText(SAMPLE)}>Вставить пример</button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ marginTop: 10 }}>
            <div className="muted" style={{ marginBottom: 6 }}>Название проверки</div>
            <input value={label} onChange={e => setLabel(e.target.value)} />
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="muted" style={{ marginBottom: 6 }}>Текст отчёта</div>
            <textarea value={text} onChange={e => setText(e.target.value)} />
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={loading} type="submit">
              {loading ? 'Проверяем…' : 'Проверить'}
            </button>
          </div>

          {error && <div style={{ marginTop: 10 }} className="badge">{error}</div>}
        </form>
      </div>

      <div className="card">
        <h2>Результат</h2>
        {!result ? (
          <div className="muted">Пока нет результата. Нажми «Проверить».</div>
        ) : (
          <>
            <div className="row">
              <span className="badge">{result.ok ? 'OK' : 'Есть пропуски'}</span>
              <span className="muted">символов: {result.inputLength}</span>
            </div>
            <div className="hr" />

            <div className="muted">Найдено</div>
            <div style={{ marginTop: 6 }}>{foundText || '—'}</div>

            <div className="hr" />
            <div className="muted">Не хватает</div>
            <div style={{ marginTop: 6 }}>{missingText || '—'}</div>

            {Array.isArray(result.orderIssues) && result.orderIssues.length > 0 && (
              <>
                <div className="hr" />
                <div className="muted">Проблемы порядка</div>
                <ul className="list">
                  {result.orderIssues.map((x, i) => <li key={i}>{x.message}</li>)}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
