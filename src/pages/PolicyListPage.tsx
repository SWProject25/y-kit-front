import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Sparkles, ArrowUpDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 임시 더미 데이터
const policies = [
  {
    id: 1,
    title: "청년내일채움공제",
    category: "취업지원",
    description: "중소·중견기업 청년 근로자의 자산형성 지원",
    period: "2025.01.01 ~ 2025.12.31",
    target: "만 15~34세 청년",
    recommended: true
  },
  {
    id: 2,
    title: "청년도약계좌",
    category: "금융지원",
    description: "청년의 중장기 자산형성을 지원하는 정책형 금융상품",
    period: "2025.01.01 ~ 2025.12.31",
    target: "만 19~34세 청년",
    recommended: true
  },
  {
    id: 3,
    title: "청년월세 한시 특별지원",
    category: "주거지원",
    description: "저소득 청년의 월세 부담 경감을 위한 지원",
    period: "2025.01.01 ~ 2025.06.30",
    target: "만 19~34세 무주택 청년",
    recommended: false
  },
  {
    id: 4,
    title: "국민취업지원제도",
    category: "취업지원",
    description: "취업지원서비스와 생계지원을 결합한 한국형 실업부조",
    period: "상시",
    target: "구직자",
    recommended: true
  },
  {
    id: 5,
    title: "청년창업지원",
    category: "창업지원",
    description: "예비 청년 창업자의 성공적인 창업 지원",
    period: "2025.01.01 ~ 2025.12.31",
    target: "만 39세 이하 예비창업자",
    recommended: false
  },
  {
    id: 6,
    title: "청년 디지털 일자리",
    category: "취업지원",
    description: "디지털 분야 청년 일자리 매칭 및 교육 지원",
    period: "2025.01.01 ~ 2025.12.31",
    target: "만 18~34세 청년",
    recommended: false
  }
]

const categories = ["전체", "취업지원", "금융지원", "주거지원", "창업지원"]

function PolicyListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [sortBy, setSortBy] = useState("latest")

  // 필터링된 정책 목록
  let filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || policy.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // 정렬
  if (sortBy === "name") {
    filteredPolicies = [...filteredPolicies].sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === "popular") {
    filteredPolicies = [...filteredPolicies].sort((a, b) => b.id - a.id)
  }

  // AI 추천 정책
  const recommendedPolicies = policies.filter(p => p.recommended)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 페이지 타이틀 */}
          <div className="mb-8 text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              청년정책
            </h1>
            <p className="text-gray-600">
              청년을 위한 다양한 지원 정책을 확인하고 나에게 맞는 혜택을 찾아보세요
            </p>
          </div>

          {/* AI 추천 정책 */}
          <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-600" size={24} />
                <CardTitle className="text-xl">AI가 추천하는 정책</CardTitle>
              </div>
              <CardDescription>
                회원님의 프로필을 기반으로 맞춤 정책을 추천해드려요
              </CardDescription>
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>

          {/* 검색 및 필터 섹션 */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 검색바 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="정책 검색..."
                  className="pl-10 w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* 필터 버튼 (모바일용) */}
              <Button variant="outline" className="md:hidden bg-white">
                <Filter size={20} className="mr-2" />
                필터
              </Button>
            </div>

            {/* 카테고리 필터 (데스크탑) */}
            <div className="hidden md:flex gap-2 mb-6 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* 결과 개수 및 정렬 */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                총 <span className="font-semibold text-gray-900 text-base">{filteredPolicies.length}</span>개의 정책
              </p>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="popular">인기순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 정책 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {policy.category}
                    </span>
                    {policy.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles size={12} className="mr-1" />
                        추천
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                  <CardDescription>{policy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm text-gray-600">
                    <p><strong>대상:</strong> {policy.target}</p>
                    <p><strong>기간:</strong> {policy.period}</p>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => navigate(`/policies/${policy.id}`)}
                  >
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">다른 검색어를 입력해보세요.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PolicyListPage