import React, { useState } from 'react'
import { api } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const r = await api.login(form)
      setResult(r)
      localStorage.setItem('user', JSON.stringify(r.user || {}))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid">
      <form className="card" onSubmit={onSubmit}>
        <h2>Вход</h2>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
        <label>Пароль</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
        <div style={{marginTop:8}}>
          <button disabled={loading}>{loading ? 'Входим…' : 'Войти'}</button>
        </div>
        {error && <p style={{color:'#dc2626'}}>Ошибка: {error}</p>}
      </form>

      {result && (
        <div className="card">
          <h2>Ответ сервера</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
