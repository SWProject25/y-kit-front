import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* 메인 문구 */}
          <p className="text-center text-sm md:text-base">
            청년의 오늘을 더 가볍게, 내일을 더 쉽게 — 나만의 청년 생활 플랫폼
          </p>

          {/* 구분선 */}
          <div className="w-full max-w-md border-t border-gray-700"></div>

          {/* 하단 정보 */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Y-kit</span>
            </div>
            
            <a 
              href="mailto:contact@y-kit.com" 
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail size={18} />
              <span>문의하기</span>
            </a>
          </div>

          {/* 저작권 */}
          <p className="text-xs text-gray-500">
            © 2025 Y-kit. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  )
}