import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export function Header() {
  const [open, setOpen] = React.useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    alert('로그아웃 되었습니다.')
    navigate('/')
  }

  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            Y-Kit
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/policies" className="text-gray-700 hover:text-gray-900 transition-colors">
              청년정책
            </Link>
            <Link to="/map" className="text-gray-700 hover:text-gray-900 transition-colors">
              알뜰지도
            </Link>
            <Link to="/group-purchase" className="text-gray-700 hover:text-gray-900 transition-colors">
              공동구매
            </Link>
            <Link to="/hot-deals" className="text-gray-700 hover:text-gray-900 transition-colors">
              동네핫딜
            </Link>
            <Link to="/community" className="text-gray-700 hover:text-gray-900 transition-colors">
              커뮤니티
            </Link>
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                로그아웃
              </Button>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                로그인
              </Link>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
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

      {/* 사이드 드로어 */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        {/* 메뉴 내용 */}
        <div className="flex flex-col px-6 pt-2 pb-10 space-y-8">
          {/* 로그인/로그아웃 버튼 */}
          {isAuthenticated ? (
            <button
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              onClick={() => {
                handleLogout()
                setOpen(false)
              }}
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          ) : (
            <Link to="/login">
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                <User className="h-5 w-5" />
                로그인
              </button>
            </Link>
          )}

          {/* 메뉴 리스트 */}
          <nav className="flex flex-col border-t border-gray-200 pt-6 space-y-5">
            <Link
              to="/policies"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              청년정책
            </Link>
            <Link
              to="/map"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              알뜰지도
            </Link>
            <Link
              to="/group-purchase"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              공동구매
            </Link>
            <Link
              to="/hot-deals"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              동네핫딜
            </Link>
            <Link
              to="/community"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              커뮤니티
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}