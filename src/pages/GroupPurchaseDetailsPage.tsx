import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Heart, 
  Bookmark, 
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
  Send
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { groupPurchaseAPI } from '@/api/client'
import type { GroupPurchaseDetailResponse, GroupPurchaseStatus } from '@/types/api'

const statusLabels: Record<GroupPurchaseStatus, string> = {
  'RECRUITING': '모집중',
  'IN_PROGRESS': '진행중',
  'COMPLETED': '완료',
  'CANCELLED': '취소'
}

function GroupPurchaseDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<GroupPurchaseDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 공동구매 상세 조회
  useEffect(() => {
    if (!id) return
    fetchItemDetail()
  }, [id])

  const fetchItemDetail = async () => {
    if (!id) return
    
    setLoading(true)
    const { data, error: apiError } = await groupPurchaseAPI.getGroupPurchase(Number(id))

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setItem(data)
    }
    setLoading(false)
  }

  // 참여하기
  const handleJoin = async () => {
    if (!id) return
    
    const { error } = await groupPurchaseAPI.joinGroupPurchase(Number(id))
    if (error) {
      alert('참여 실패: ' + error)
      return
    }
    
    alert('참여 완료!')
    fetchItemDetail()
  }

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!id) return
    
    const { error } = await groupPurchaseAPI.toggleLike(Number(id))
    if (error) {
      alert('좋아요 처리 실패: ' + error)
      return
    }
    
    fetchItemDetail()
  }

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!id) return
    
    const { error } = await groupPurchaseAPI.toggleBookmark(Number(id))
    if (error) {
      alert('북마크 처리 실패: ' + error)
      return
    }
    
    fetchItemDetail()
  }

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!id || !comment.trim()) return
    
    setSubmitting(true)
    const { error } = await groupPurchaseAPI.createComment(Number(id), {
      content: comment
    })

    if (error) {
      alert('댓글 작성 실패: ' + error)
      setSubmitting(false)
      return
    }

    setComment("")
    setSubmitting(false)
    fetchItemDetail()
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    
    const { error } = await groupPurchaseAPI.deleteComment(commentId)
    if (error) {
      alert('댓글 삭제 실패: ' + error)
      return
    }
    
    fetchItemDetail()
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
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

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || '공동구매를 찾을 수 없습니다.'}</p>
            <Button onClick={() => navigate('/group-purchase')}>목록으로</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6 text-left">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/group-purchase')}
            >
              <ArrowLeft className="mr-2" size={18} />
              목록으로
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 메인 컬럼 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 제목 & 정보 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge>{statusLabels[item.status]}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleLike}
                      >
                        <Heart 
                          size={20} 
                          className={item.isLiked ? "fill-red-500 text-red-500" : ""}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleBookmark}
                      >
                        <Bookmark 
                          size={20}
                          className={item.isBookmarked ? "fill-yellow-400 text-yellow-400" : ""}
                        />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-4">{item.title}</CardTitle>
                  
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{item.authorName}</p>
                      <p className="text-sm text-gray-500">{item.createdAt}</p>
                    </div>
                  </div>

                  {/* 위치 정보 */}
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <MapPin size={18} />
                    <span className="text-sm">{item.regionName}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  
                  {/* 상세 설명 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">상세 설명</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 댓글 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    댓글 ({item.comments?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 댓글 입력 */}
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>😊</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="댓글을 입력하세요..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSubmitComment}
                          disabled={submitting || !comment.trim()}
                        >
                          <Send size={16} className="mr-2" />
                          {submitting ? '작성중...' : '댓글 작성'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {item.comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>👤</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.authorName}</span>
                            <span className="text-xs text-gray-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                          <button 
                            className="text-xs text-gray-500 hover:text-red-500"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 사이드바 */}
            <div className="lg:col-span-1 space-y-4">
              {/* 가격 & 참여 정보 */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {/* 가격 */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">1인당 가격</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">
                        {item.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* 참여 현황 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">참여 현황</span>
                      <span className="font-semibold text-blue-600">
                        {item.currentQuantity}/{item.targetQuantity}명
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(item.currentQuantity, item.targetQuantity)} className="mb-2" />
                    <p className="text-xs text-gray-500">
                      {item.targetQuantity - item.currentQuantity}명 더 필요해요!
                    </p>
                  </div>

                  <Separator />

                  {/* 기간 정보 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-600">마감:</span>
                      <span className="font-semibold text-orange-600">{item.deadline}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* 참여하기 버튼 */}
                  <Button 
                    className="w-full bg-blue-500 h-12 text-lg"
                    disabled={item.status === "COMPLETED" || item.isParticipating}
                    onClick={handleJoin}
                  >
                    {item.isParticipating ? "참여 완료" : item.status === "COMPLETED" ? "마감되었습니다" : "참여하기"}
                  </Button>

                  {item.isParticipating && (
                    <p className="text-sm text-center text-green-600">
                      ✓ 공동구매에 참여하셨습니다!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default GroupPurchaseDetailsPage