import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI } from '@/api/client'

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 0C4.029 0 0 3.354 0 7.5c0 2.745 1.863 5.145 4.638 6.48-.195.72-.72 2.625-.825 3.015-.12.465.165.45.345.33.135-.09 2.13-1.44 2.94-1.995C7.695 15.45 8.34 15.525 9 15.525c4.971 0 9-3.354 9-7.5S13.971 0 9 0z" fill="currentColor"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // 로컬 로그인
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      // 실제 로그인 API 호출
      const { data, error } = await userAPI.login({ email, password })
      
      if (error) {
        alert('로그인 실패: ' + error)
        setLoading(false)
        return
      }

      if (data && data.token) {
        // JWT에서 userId 추출
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]))
          const userId = String(payload.userId || payload.sub || payload.id || '1')
          
          // AuthContext에 저장
          login(data.token, userId)
          alert('로그인 성공!')
          navigate('/')
        } catch (jwtError) {
          console.error('JWT 파싱 에러:', jwtError)
          // JWT 파싱 실패해도 토큰은 저장
          login(data.token, '1')
          alert('로그인 성공!')
          navigate('/')
        }
      }
    } catch (err: any) {
      console.error('로그인 에러:', err)
      alert('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`
  }

  // 구글 로그인  
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
            <CardDescription className="text-center">
              Y-Kit에 로그인하여 다양한 서비스를 이용하세요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* 이메일/비밀번호 로그인 */}
            <form onSubmit={handleLocalLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 로그인 유지 & 비밀번호 찾기 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">로그인 유지</span>
                </label>
                <a href="#" className="text-sky-600 hover:text-sky-700 hover:underline">
                  비밀번호 찾기
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-sky-600 hover:bg-sky-700"
                disabled={loading}
              >
                {loading ? '로그인중...' : '로그인'}
              </Button>
            </form>

            {/* 구분선 */}
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                또는
              </span>
            </div>

            {/* 소셜 로그인 버튼들 */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] border-0 font-medium"
                onClick={handleKakaoLogin}
              >
                <KakaoIcon />
                <span className="ml-2">카카오로 시작하기</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 hover:bg-gray-50 font-medium"
                onClick={handleGoogleLogin}
              >
                <GoogleIcon />
                <span className="ml-2">Google로 시작하기</span>
              </Button>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center text-sm text-gray-600 pt-4 border-t">
              아직 계정이 없으신가요?{' '}
              <a 
                href="/signup" 
                className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
              >
                회원가입
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

export default LoginPage