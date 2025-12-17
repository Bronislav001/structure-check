import React, { useState } from 'react'
import { api } from '../api'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(''); setMsg('')
    try {
      await api.register(form)
      setMsg('Регистрация успешна')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Регистрация</h2>
      <label>Имя</label>
      <input name="name" value={form.name} onChange={onChange} required />
      <label>Email</label>
      <input type="email" name="email" value={form.email} onChange={onChange} required />
      <label>Пароль</label>
      <input type="password" name="password" value={form.password} onChange={onChange} required />
      <div style={{marginTop:8}}>
        <button disabled={loading}>{loading ? 'Отправка…' : 'Зарегистрироваться'}</button>
      </div>
      {msg && <p style={{color:'#16a34a'}}>{msg}</p>}
      {error && <p style={{color:'#dc2626'}}>Ошибка: {error}</p>}
    </form>
  )
}
