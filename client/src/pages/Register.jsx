import React, { useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../state/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { save } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await api.register({ email, name, password })
      save(data.token, data.user)
      nav('/validate')
    } catch (e2) {
      setError(`${e2.code || 'ERROR'}: ${e2.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
      <h2>Регистрация</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>Email</div>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>Имя</div>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div style={{ marginTop: 10 }}>
          <div className="muted" style={{ marginBottom: 6 }}>Пароль (мин 6 символов)</div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn primary" disabled={loading} type="submit">
            {loading ? 'Создаём…' : 'Создать аккаунт'}
          </button>
        </div>

        {error && <div style={{ marginTop: 10 }} className="badge">{error}</div>}
      </form>
    </div>
  )
}
