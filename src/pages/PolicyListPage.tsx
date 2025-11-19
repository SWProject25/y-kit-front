import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Sparkles, Filter, Eye, Bookmark, FileText } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { policyAPI } from '@/api/client'
import type { PolicyListResponse } from '@/types/api'
import { CATEGORIES, KEYWORDS } from '@/data/policyFilters'
import { COLORS } from '@/data/color'

function PolicyListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [policies, setPolicies] = useState<PolicyListResponse[]>([])
  const [recommendedPolicies, setRecommendedPolicies] = useState<PolicyListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortBy, setSortBy] = useState('latest')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchPolicies = useCallback(async (page: number = 0) => {
    setLoading(true)
    setError(null)

    let sortParam = 'createdAt,desc'
    if (sortBy === 'name') sortParam = 'policyName,asc'
    else if (sortBy === 'popular') sortParam = 'viewCount,desc'

    try {
      const { data, error: apiError } = await policyAPI.getPolicies({ page, size: 30, sort: sortParam })
      if (apiError) throw new Error(apiError)
      if (data) {
        setPolicies(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
        setCurrentPage(data.page)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  const fetchRecommendedPolicies = async () => {
    try {
      const { data } = await policyAPI.getRecommendedPolicies({ page: 0, size: 3 })
      if (data) setRecommendedPolicies(data.content)
    } catch (e) {}
  }

  useEffect(() => { fetchPolicies(0) }, [fetchPolicies])
  useEffect(() => { fetchRecommendedPolicies() }, [])

  const handleSearch = () => fetchPolicies(0)
  const handlePageChange = (newPage: number) => {
    fetchPolicies(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 필터 토글
  const toggleCategory = (id: number) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }
  const toggleKeyword = (id: number) => {
    setSelectedKeywords(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  // 필터링 적용
  const filteredPolicies = policies.filter(policy => {
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(CATEGORIES.find(c => c.name === policy.largeCategory)?.id!)
    const matchKeyword =
      selectedKeywords.length === 0 || policy.keywords?.some(k => selectedKeywords.includes(KEYWORDS.find(kw => kw.name === k)?.id!))
    const matchSearch =
      searchTerm === '' ||
      policy.policyName.includes(searchTerm) ||
      policy.summary.includes(searchTerm)
    return matchCategory && matchKeyword && matchSearch
  })

  if (loading && policies.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg">로딩중...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.white }}>
      <Header />
      <main className="flex-1 w-full pt-15" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Title */}
          <div className="mb-6 text-left p-6 rounded-2xl">
            <h1 className="text-4xl font-bold mb-2" style={{ color: COLORS.navy }}>청년정책</h1>
            <p className="text-gray-700">청년을 위한 다양한 지원 정책을 확인하고 나에게 맞는 혜택을 찾아보세요</p>
          </div>

          {/* 검색 & 필터 */}
          <div className="mb-6">
            {/* 검색바 & 필터 토글 버튼 */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="정책 검색..."
                  className="pl-10 w-full bg-white"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                필터 {showFilters ? '숨기기' : '보기'}
                {(selectedCategories.length > 0 || selectedKeywords.length > 0) && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({selectedCategories.length + selectedKeywords.length})
                  </span>
                )}
              </Button>
              <Button onClick={handleSearch} style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = COLORS.navyHover)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = COLORS.navy)}
              >검색</Button>
            </div>

            {/* 필터 UI - 토글 */}
            {showFilters && (
              <div className="p-4 rounded-xl border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.navy }}>카테고리</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {CATEGORIES.map(cat => {
                      const isSelected = selectedCategories.includes(cat.id)
                      return (
                        <Badge
                          key={cat.id}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => toggleCategory(cat.id)}
                          className={`cursor-pointer ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                          #{cat.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.navy }}>키워드</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {KEYWORDS.map(kw => {
                      const isSelected = selectedKeywords.includes(kw.id)
                      return (
                        <Badge
                          key={kw.id}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => toggleKeyword(kw.id)}
                          className={`cursor-pointer ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                          #{kw.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                {(selectedCategories.length > 0 || selectedKeywords.length > 0) && (
                  <div className="pt-4 border-t" style={{ borderColor: COLORS.border }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategories([])
                        setSelectedKeywords([])
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      필터 초기화
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI 추천 정책 */}
          {!isLoggedIn ? (
            <div className="mb-6 p-8 rounded-xl flex flex-col items-center justify-center text-center" 
              style={{ backgroundColor: COLORS.skyLight, border: `1px solid ${COLORS.skyBorder}` }}>
              <Sparkles style={{ color: COLORS.accent }} size={32} className="mb-3" />
              <h3 className="font-semibold text-lg mb-2" style={{ color: COLORS.navy }}>
                AI 맞춤 정책 추천
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                로그인하고 나만을 위한 청년정책을 추천받으세요
              </p>
              <Button 
                onClick={() => navigate('/login')}
                style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = COLORS.navyHover)}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = COLORS.navy)}
                className="px-6"
              >
                로그인하기
              </Button>
            </div>
          ) : (
            recommendedPolicies.length > 0 && (
              <Card className="mb-6 rounded-xl" style={{ borderColor: COLORS.skyBorder, backgroundColor: COLORS.skyLight }}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles style={{ color: COLORS.accent }} size={24} />
                    <CardTitle className="text-xl" style={{ color: COLORS.navy }}>AI 추천 정책</CardTitle>
                  </div>
                  <CardDescription>회원님의 프로필 기반 맞춤 추천</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedPolicies.map(policy => (
                      <Card key={policy.policyId} className="bg-white cursor-pointer hover:shadow-md transition-shadow rounded-xl"
                        onClick={() => navigate(`/policies/${policy.policyId}`)}>
                        <CardHeader className="pb-3">
                          <Badge className="w-fit mb-2 text-xs" style={{ backgroundColor: COLORS.accent, color: COLORS.white }}>{policy.largeCategory}</Badge>
                          <CardTitle className="text-base line-clamp-2">{policy.policyName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-600 line-clamp-2">{policy.summary}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {/* 정책 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map(policy => (
              <Card key={policy.policyId} className="bg-white hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                  onClick={() => navigate(`/policies/${policy.policyId}`)}>
              <CardHeader>
                <div className="flex items-start mb-2 gap-2">
                  <Badge className="text-xs" style={{ backgroundColor: COLORS.skyLight, color: COLORS.navy }}>
                    {policy.largeCategory}
                  </Badge>
                  {policy.mediumCategory && (
                    <Badge className="text-xs" style={{ backgroundColor: COLORS.skyLight, color: COLORS.navy }}>
                      {policy.mediumCategory}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl line-clamp-2">{policy.policyName}</CardTitle>
                <CardDescription className="line-clamp-2">{policy.summary}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 justify-between space-y-2">
                <div>
                  {policy.minAge && policy.maxAge && (
                    <p className="text-sm text-gray-600"><strong>대상:</strong> 만 {policy.minAge}~{policy.maxAge}세</p>
                  )}
                  {policy.supervisingInstitution && (
                    <p className="text-sm text-gray-600"><strong>기관:</strong> {policy.supervisingInstitution}</p>
                  )}
                  {policy.isApplicationAvailable && (
                    <p className="text-green-600 font-medium mt-1">✓ 신청 가능</p>
                  )}
                  {policy.keywords && policy.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {policy.keywords.slice(0, 3).map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">#{keyword}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* 조회수/북마크/신청수 영역 항상 카드 바닥에 */}
                <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t">
                  <span title="조회수" className="flex items-center gap-1"><Eye size={14} />{policy.viewCount?.toLocaleString() || 0}</span>
                  <span title="북마크" className="flex items-center gap-1"><Bookmark size={14} />{policy.bookmarkCount?.toLocaleString() || 0}</span>
                  <span title="신청수" className="flex items-center gap-1"><FileText size={14} />{policy.applicationCount?.toLocaleString() || 0}</span>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button disabled={currentPage === 0} onClick={() => handlePageChange(0)} variant="outline" size="sm" className="cursor-pointer active:scale-95 active:shadow-inner active:cursor-grabbing transition-transform">처음</Button>
              <Button disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)} variant="outline" className="cursor-pointer active:scale-95 active:shadow-inner active:cursor-grabbing transition-transform">이전</Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) pageNum = i
                  else if (currentPage < 3) pageNum = i
                  else if (currentPage > totalPages - 4) pageNum = totalPages - 5 + i
                  else pageNum = currentPage - 2 + i
                  const isActive = currentPage === pageNum
                  return (
                    <Button 
                      key={pageNum} 
                      onClick={() => handlePageChange(pageNum)}
                      variant={isActive ? "default" : "outline"} 
                      size="sm" 
                      className="w-10 cursor-pointer active:scale-95 active:shadow-inner active:cursor-grabbing transition-transform"
                      style={{ backgroundColor: isActive ? COLORS.navy : undefined, color: isActive ? COLORS.white : undefined }}
                    >
                      {pageNum + 1}
                    </Button>
                  )
                })}
              </div>
              <Button disabled={currentPage >= totalPages - 1} onClick={() => handlePageChange(currentPage + 1)} variant="outline" className="cursor-pointer active:scale-95 active:shadow-inner active:cursor-grabbing transition-transform">다음</Button>
              <Button disabled={currentPage >= totalPages - 1} onClick={() => handlePageChange(totalPages - 1)} variant="outline" size="sm" className="cursor-pointer active:scale-95 active:shadow-inner active:cursor-grabbing transition-transform">마지막</Button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PolicyListPage