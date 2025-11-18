import React, { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, UserCircle } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export function Header() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // isTop: 페이지 맨 위에 있는지 여부
  const [isTop, setIsTop] = useState(true)

  useEffect(() => {
    // SSR 안전성: window가 없다면 아무것도 안 함
    if (typeof window === "undefined") return

    const onScroll = () => {
      setIsTop(window.scrollY < 50)
    }

    // 초기값 보정 (페이지 로드 시 이미 스크롤된 상태일 수 있음)
    onScroll()

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    alert('로그아웃 되었습니다.')
    navigate('/')
  }

  // 메인페이지에서만 투명하게 보이고 싶다면 아래를 true로 바꿔 사용.

  const isOnMain = location.pathname === "/"

  // 실제 투명 처리 조건: 메인페이지일 때 + 맨 위라면 투명
  const useTransparent = isOnMain && isTop

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-30
          backdrop-blur-sm transition-all duration-300
          h-18 flex items-center
          ${useTransparent ? "bg-white/0 border-transparent" : "bg-white/80 border-b border-gray-200"}
        `}
      >
        <div className="max-w-8xl mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* 좌측 로고 */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="Y-Kit 로고"
              className="h-26 w-auto"
            />
          </Link>

          {/* 중앙 네비 */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-10 text-base font-semibold">
            <Link to="/policies" className="text-gray-700 hover:text-gray-900 transition-colors">청년정책</Link>
            <Link to="/map" className="text-gray-700 hover:text-gray-900 transition-colors">알뜰지도</Link>
            <Link to="/group-purchase" className="text-gray-700 hover:text-gray-900 transition-colors">공동구매</Link>
            <Link to="/hot-deals" className="text-gray-700 hover:text-gray-900 transition-colors">동네핫딜</Link>
            <Link to="/community" className="text-gray-700 hover:text-gray-900 transition-colors">커뮤니티</Link>
          </nav>

          {/* 우측 유저아이콘 (데스크탑 전용) */}
          <div className="hidden md:block">
            <Link to={isAuthenticated ? "/mypage" : "/login"} className="text-gray-700 hover:text-gray-900">
              <UserCircle size={26} strokeWidth={1.8} />
            </Link>
          </div>

          {/* 모바일 햄버거 (우측) */}
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 모바일 드로어 (기존 코드 재활용) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col px-6 pt-2 pb-10 space-y-8">
          {isAuthenticated ? (
            <button
              className="w-full flex items-center justify-center gap-2 bg-[#0C2B4E] text-white py-3 px-4 rounded-lg hover:opacity-95 transition-colors font-medium"
              onClick={() => {
                handleLogout()
                setOpen(false)
              }}
            >
              로그아웃
            </button>
          ) : (
            <Link to="/login">
              <button
                className="w-full flex items-center justify-center gap-2 bg-[#0C2B4E] text-white py-3 px-4 rounded-lg hover:opacity-95 transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                로그인
              </button>
            </Link>
          )}

          <nav className="flex flex-col border-t border-gray-200 pt-6 space-y-5 font-semibold text-lg">
            <Link to="/policies" onClick={() => setOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">청년정책</Link>
            <Link to="/map" onClick={() => setOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">알뜰지도</Link>
            <Link to="/group-purchase" onClick={() => setOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">공동구매</Link>
            <Link to="/hot-deals" onClick={() => setOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">동네핫딜</Link>
            <Link to="/community" onClick={() => setOpen(false)} className="text-gray-700 hover:text-gray-900 transition-colors">커뮤니티</Link>
          </nav>
        </div>
      </div>
    </>
  )
}