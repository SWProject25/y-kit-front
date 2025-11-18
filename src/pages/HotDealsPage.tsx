import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Search, 
  Heart, 
  Bookmark, 
  MessageCircle,
  MapPin,
  Clock,
  Flame
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { hotDealAPI } from '@/api/client'
import type { HotDealListResponse } from '@/types/api'

function HotDealsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [deals, setDeals] = useState<HotDealListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 핫딜 목록 불러오기
  useEffect(() => {
    fetchDeals()
  }, [currentPage])

  const fetchDeals = async () => {
    setLoading(true)
    setError(null)

    const { data, error: apiError } = await hotDealAPI.getHotDeals({
      keyword: searchTerm || undefined,
      page: currentPage,
      size: 20
    })

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setDeals(data.content)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }

  // 검색
  const handleSearch = () => {
    setCurrentPage(0)
    fetchDeals()
  }

  // 좋아요 토글
  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    
    const { error } = await hotDealAPI.toggleLike(id)
    if (error) {
      alert('좋아요 처리 실패: ' + error)
      return
    }
    
    fetchDeals()
  }

  // 북마크 토글
  const handleBookmark = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    
    const { error } = await hotDealAPI.toggleBookmark(id)
    if (error) {
      alert('북마크 처리 실패: ' + error)
      return
    }
    
    fetchDeals()
  }

  if (loading && deals.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>로딩중...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 페이지 타이틀 */}
          <div className="mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-500" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">
                동네핫딜
              </h1>
            </div>
            <p className="text-gray-600">
              우리 동네 실시간 할인 정보를 확인하세요!
            </p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 검색바 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="핫딜 검색..."
                  className="pl-10 w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>검색</Button>
            </div>

            {/* 결과 개수 */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                총 <span className="font-semibold text-gray-900 text-base">{deals.length}</span>개의 핫딜
              </p>
            </div>
          </div>

          {error && (
            <div className="text-center py-6 text-red-500">
              에러: {error}
            </div>
          )}

          {/* 핫딜 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card 
                key={deal.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white overflow-hidden"
                onClick={() => navigate(`/hot-deals/${deal.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">핫딜</Badge>
                    {deal.discount && (
                      <Badge className="bg-blue-600 text-white text-lg font-bold">
                        {deal.discount}%
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* 작성자 */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{deal.authorName}</span>
                    <span className="text-xs text-gray-400">· {deal.createdAt}</span>
                  </div>

                  {/* 가격 */}
                  {deal.price && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-red-600">
                        {deal.price.toLocaleString()}원
                      </span>
                    </div>
                  )}

                  {/* 좋아요, 댓글, 북마크 */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
                        onClick={(e) => handleLike(e, deal.id)}
                      >
                        <Heart size={16} />
                        {deal.likeCount}
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/hot-deals/${deal.id}`)
                        }}
                      >
                        <MessageCircle size={16} />
                        {deal.commentCount}
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={(e) => handleBookmark(e, deal.id)}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {!loading && deals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">핫딜이 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                이전
              </Button>
              <span className="flex items-center px-4">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HotDealsPage