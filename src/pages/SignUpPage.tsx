import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '@/api/client'
import type { LocalSignUpRequest } from '@/types/api'

type Gender = 'MAN' | 'WOMAN'

function SignUpPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 폼 데이터
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [region, setRegion] = useState('')

  // 유효성 검사
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 이메일 검증
    if (!email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    // 비밀번호 검증
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    // 이름 검증
    if (!name) {
      newErrors.name = '이름을 입력해주세요.'
    }

    // 나이 검증
    if (!age) {
      newErrors.age = '나이를 입력해주세요.'
    } else if (Number(age) < 1 || Number(age) > 120) {
      newErrors.age = '올바른 나이를 입력해주세요.'
    }

    // 성별 검증
    if (!gender) {
      newErrors.gender = '성별을 선택해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const signUpData: LocalSignUpRequest = {
      email,
      password,
      name,
      age: Number(age),
      gender: gender as Gender,
      region: region || undefined
    }

    const { error } = await userAPI.signUp(signUpData)

    if (error) {
      alert('회원가입 실패: ' + error)
      setLoading(false)
      return
    }

    alert('회원가입이 완료되었습니다! 로그인해주세요.')
    navigate('/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
            <CardDescription className="text-center">
              Y-Kit에 가입하고 다양한 서비스를 이용하세요
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8자 이상 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">비밀번호 확인 <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className={`h-11 pr-10 ${errors.passwordConfirm ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-sm text-red-500">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`h-11 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* 나이 */}
              <div className="space-y-2">
                <Label htmlFor="age">나이 <span className="text-red-500">*</span></Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                  className={`h-11 ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age}</p>
                )}
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label htmlFor="gender">성별 <span className="text-red-500">*</span></Label>
                <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
                  <SelectTrigger className={`h-11 ${errors.gender ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAN">남성</SelectItem>
                    <SelectItem value="WOMAN">여성</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              {/* 지역 (선택) */}
              <div className="space-y-2">
                <Label htmlFor="region">지역 (선택)</Label>
                <Input
                  id="region"
                  type="text"
                  placeholder="서울특별시 강남구"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="h-11"
                />
                <p className="text-xs text-gray-500">예: 서울특별시 강남구, 부산광역시 해운대구</p>
              </div>

              {/* 제출 버튼 */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-sky-600 hover:bg-sky-700 mt-6"
                disabled={loading}
              >
                {loading ? '가입중...' : '회원가입'}
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="text-center text-sm text-gray-600 pt-4 border-t mt-6">
              이미 계정이 있으신가요?{' '}
              <a 
                href="/login" 
                className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
              >
                로그인
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

export default SignUpPage