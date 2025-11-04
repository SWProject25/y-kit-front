import React from "react"
import { Menu, X, User } from "lucide-react"

export function Header() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5">
          {/* 로고 */}
          <a href="/" className="text-xl font-bold text-gray-800">
            Y-Kit
          </a>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/policies" className="text-gray-700 hover:text-gray-900 transition-colors">
              청년정책
            </a>
            <a href="/map" className="text-gray-700 hover:text-gray-900 transition-colors">
              알뜰지도
            </a>
            <a href="/group-purchase" className="text-gray-700 hover:text-gray-900 transition-colors">
              공동구매
            </a>
            <a href="/hot-deals" className="text-gray-700 hover:text-gray-900 transition-colors">
              동네핫딜
            </a>
            <a href="/community" className="text-gray-700 hover:text-gray-900 transition-colors">
              커뮤니티
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              로그인
            </a>
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
          {/* 로그인 버튼 */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            onClick={() => setOpen(false)}
          >
            <User className="h-5 w-5" />
            로그인
          </button>

          {/* 메뉴 리스트 */}
          <nav className="flex flex-col border-t border-gray-200 pt-6 space-y-5">
            <a
              href="/policies"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              청년정책
            </a>
            <a
              href="/map"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              알뜰지도
            </a>
            <a
              href="/group-purchase"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              공동구매
            </a>
            <a
              href="/hot-deals"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              동네핫딜
            </a>
            <a
              href="/community"
              className="block text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              커뮤니티
            </a>
          </nav>
        </div>
      </div>
    </>
  )
}