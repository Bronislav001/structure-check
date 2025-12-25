import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthCtx = createContext(null)

const LS_KEY = 'struct_check_auth'

function readStored() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return { token: parsed.token || null, user: parsed.user || null }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const s = readStored()
    setToken(s.token)
    setUser(s.user)
  }, [])

  function save(nextToken, nextUser) {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(LS_KEY, JSON.stringify({ token: nextToken, user: nextUser }))
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem(LS_KEY)
  }

  const value = useMemo(() => ({ token, user, isAuthed: !!token, save, logout }), [token, user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
