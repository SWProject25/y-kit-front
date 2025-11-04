import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react'

function MainPage() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      console.log("검색어:", query)
      // navigate(`/search?query=${query}`) // 검색 결과 페이지로 연결할 때
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full">
        {/* 배너 이미지 */}
        <div className="w-full h-64 md:h-80 lg:h-96 bg-sky-100 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Y-Kit에 오신 것을 환영합니다
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              청년을 위한 모든 정보를 한곳에서
            </p>
          </div>
        </div>

        {/* 🔍 통합검색창 섹션 */}
        <div className="py-8 px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
            {/* 검색바 */}
            <div className="flex-1 relative">
                <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
                />
                <Input
                type="text"
                placeholder="청년정책, 알뜰지도, 공동구매 등 원하는 정보를 검색해보세요."
                className="pl-10 w-full bg-white h-12 text-base rounded-full border-gray-300 focus-visible:ring-2 focus-visible:ring-sky-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            </div>
        </div>
        </div>

        {/* 카드 섹션 */}
        <div className="px-4 sm:px-6 lg:px-10 xl:px-12 max-w-screen-2xl mx-auto py-12 space-y-8">
          {/* 첫 번째 행 */}
          <div className="grid grid-cols-1 md:grid-cols-20 gap-8">
            {/* 왼쪽 카드 - 40% (8칸) */}
            <Card className="md:col-span-8 hover:shadow-lg transition-shadow min-h-[300px]">
              <CardHeader>
                <CardTitle className="text-2xl">사용자 데이터</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 내용 */}
              </CardContent>
            </Card>

            {/* 오른쪽 카드 - 60% (12칸) */}
            <Card className="md:col-span-12 hover:shadow-lg transition-shadow min-h-[300px]">
              <CardHeader>
                <CardTitle className="text-2xl">실시간 순위 목록</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 내용 */}
              </CardContent>
            </Card>
          </div>

          {/* 두 번째 행 - 3개 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow min-h-[250px]">
              <CardHeader>
                <CardTitle className="text-xl">청년정책</CardTitle>
                <CardDescription>다양한 청년 지원 정책</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  청년을 위한 다양한 정책 정보를 확인하세요.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow min-h-[250px]">
              <CardHeader>
                <CardTitle className="text-xl">알뜰지도</CardTitle>
                <CardDescription>가성비 좋은 장소 추천</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  저렴하고 좋은 가게들을 찾아보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow min-h-[250px]">
              <CardHeader>
                <CardTitle className="text-xl">공동구매</CardTitle>
                <CardDescription>함께 사면 더 저렴하게</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  공동구매로 합리적인 소비를 시작하세요.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 세 번째 행 - 2개 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow min-h-[280px]">
              <CardHeader>
                <CardTitle className="text-xl">커뮤니티</CardTitle>
                <CardDescription>청년들과 소통하는 공간</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  다양한 주제로 이야기를 나누고 정보를 공유해보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow min-h-[280px]">
              <CardHeader>
                <CardTitle className="text-xl">이벤트</CardTitle>
                <CardDescription>진행 중인 특별 이벤트</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  다양한 이벤트와 혜택을 놓치지 마세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MainPage