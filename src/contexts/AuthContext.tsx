import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email?: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (token: string, userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 초기 로드 시 로컬스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('jwt_token')
    const userId = localStorage.getItem('user_id')
    
    if (token && userId) {
      setUser({ id: userId })
      setIsAuthenticated(true)
    }
  }, [])

  const login = (token: string, userId: string) => {
    localStorage.setItem('jwt_token', token)
    localStorage.setItem('user_id', userId)
    setUser({ id: userId })
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_id')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}