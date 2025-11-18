import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트하면서 원래 가려던 경로를 state에 저장
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}