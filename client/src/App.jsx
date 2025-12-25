import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { useAuth } from './state/auth'
import Home from './pages/Home.jsx'
import Template from './pages/Template.jsx'
import Validate from './pages/Validate.jsx'
import History from './pages/History.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Hero from './components/Hero.jsx'

function LinkChip({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
    >
      {children}
    </NavLink>
  )
}

export default function App() {
  const { user, isAuthed, logout } = useAuth()

  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <div className="links">
            <div className="brand">Struct Check</div>
            <LinkChip to="/">Главная</LinkChip>
            <LinkChip to="/template">Эталон</LinkChip>
            <LinkChip to="/validate">Проверка</LinkChip>
            <LinkChip to="/history">История</LinkChip>
          </div>

          <div className="right">
            {isAuthed ? (
              <>
                <span className="badge">{user?.name || 'Пользователь'}</span>
                <button className="btn" onClick={logout}>Выйти</button>
              </>
            ) : (
              <>
                <LinkChip to="/register">Регистрация</LinkChip>
                <LinkChip to="/login">Вход</LinkChip>
              </>
            )}
          </div>
        </div>
      </div>

      {/* СИНЯЯ ШАПКА НА ВСЕХ СТРАНИЦАХ */}
      <Hero />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/template" element={<Template />} />
          <Route path="/validate" element={<Validate />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}
