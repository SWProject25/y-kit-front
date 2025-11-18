import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Users, 
  Heart, 
  Bookmark, 
  MessageCircle,
  Clock,
  MapPin
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { groupPurchaseAPI } from '@/api/client'
import type { GroupPurchaseListResponse, GroupPurchaseStatus } from '@/types/api'

const statusLabels: Record<GroupPurchaseStatus, string> = {
  'RECRUITING': '모집중',
  'IN_PROGRESS': '진행중',
  'COMPLETED': '완료',
  'CANCELLED': '취소'
}

function GroupPurchasePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState<GroupPurchaseListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 공동구매 목록 불러오기
  useEffect(() => {
    fetchItems()
  }, [currentPage])

  const fetchItems = async () => {
    setLoading(true)
    setError(null)

    const { data, error: apiError } = await groupPurchaseAPI.getGroupPurchases({
      page: currentPage,
      size: 20
    })

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setItems(data.content)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }

  // 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems()
      return
    }

    setLoading(true)
    const { data, error: apiError } = await groupPurchaseAPI.searchGroupPurchases({
      keyword: searchTerm,
      page: currentPage,
      size: 20
    })

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setItems(data.content)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }

  // 좋아요 토글
  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    
    const { error } = await groupPurchaseAPI.toggleLike(id)
    if (error) {
      alert('좋아요 처리 실패: ' + error)
      return
    }
    
    fetchItems()
  }

  // 북마크 토글
  const handleBookmark = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    
    const { error } = await groupPurchaseAPI.toggleBookmark(id)
    if (error) {
      alert('북마크 처리 실패: ' + error)
      return
    }
    
    fetchItems()
  }

  const getProgressPercentage = (current: number, target: number) =>
    Math.min((current / target) * 100, 100)

  if (loading && items.length === 0) {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">공동구매</h1>
            <p className="text-gray-600">
              함께 사면 더 저렴하게! 우리 동네 공동구매에 참여하세요
            </p>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="공동구매 검색..."
                  className="pl-10 w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>검색</Button>
            </div>
          </div>

          {error && (
            <div className="text-center py-6 text-red-500">
              에러: {error}
            </div>
          )}

          {/* 카드 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card 
                key={item.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white"
                onClick={() => navigate(`/group-purchase/${item.id}`)}
              >
                <CardHeader className="pb-3">
                  {/* 위치 정보 */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin size={12} className="text-blue-600" />
                    {item.regionName}
                  </div>

                  {/* 상태 */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={item.status === "COMPLETED" ? "secondary" : "default"}>
                      {statusLabels[item.status]}
                    </Badge>
                  </div>

                  <CardTitle 
                    className="text-lg cursor-pointer hover:text-blue-600"
                  >
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* 작성자 */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{item.authorName}</span>
                  </div>

                  {/* 가격 */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>

                  {/* 참여 현황 */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        <Users className="inline mr-1" size={14} />
                        {item.currentQuantity}/{item.targetQuantity}명
                      </span>
                      <span className="font-semibold text-blue-600">
                        {Math.round(getProgressPercentage(item.currentQuantity, item.targetQuantity))}%
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(item.currentQuantity, item.targetQuantity)} />
                  </div>

                  {/* 마감일 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.deadline}
                    </span>
                  </div>

                  {/* 참여 버튼 */}
                  <Button 
                    className="w-full"
                    disabled={item.status === "COMPLETED"}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/group-purchase/${item.id}`)
                    }}
                  >
                    {item.status === "COMPLETED" ? "마감되었습니다" : "참여하기"}
                  </Button>

                  {/* 좋아요, 댓글, 북마크 */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
                        onClick={(e) => handleLike(e, item.id)}
                      >
                        <Heart size={16} />
                        {item.likeCount}
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/group-purchase/${item.id}`)
                        }}
                      >
                        <MessageCircle size={16} />
                        {item.commentCount}
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={(e) => handleBookmark(e, item.id)}
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 결과 없음 */}
          {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">공동구매가 없습니다.</p>
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

export default GroupPurchasePage