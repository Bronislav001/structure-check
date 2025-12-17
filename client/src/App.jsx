import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import Structure from './pages/Structure.jsx'
import Validate from './pages/Validate.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <div className="container">
      <nav className="nav">
        <div className="nav-inner">
          <strong>Struct Check</strong>
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Эталон</NavLink>
          <NavLink to="/validate" className={({isActive}) => isActive ? 'active' : ''}>Проверка</NavLink>
          <NavLink to="/register" className={({isActive}) => isActive ? 'active' : ''}>Регистрация</NavLink>
          <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Вход</NavLink>
          <div style={{flex:1}} />
        </div>
      </nav>

      <div className="hero">
        <h1>Система проверки структуры учебных отчётов</h1>
      </div>

      <Routes>
        <Route path="/" element={<Structure />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
