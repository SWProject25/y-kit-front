import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Heart,
  Bookmark,
  MessageCircle,
  Send
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hotDealAPI } from '@/api/client'
import type { HotDealDetailResponse } from '@/types/api'

function HotDealDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [deal, setDeal] = useState<HotDealDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 핫딜 상세 조회
  useEffect(() => {
    if (!id) return
    fetchDealDetail()
  }, [id])

  const fetchDealDetail = async () => {
    if (!id) return
    
    setLoading(true)
    const { data, error: apiError } = await hotDealAPI.getHotDeal(Number(id))

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setDeal(data)
    }
    setLoading(false)
  }

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!id) return
    
    const { error } = await hotDealAPI.toggleLike(Number(id))
    if (error) {
      alert('좋아요 처리 실패: ' + error)
      return
    }
    
    fetchDealDetail()
  }

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!id) return
    
    const { error } = await hotDealAPI.toggleBookmark(Number(id))
    if (error) {
      alert('북마크 처리 실패: ' + error)
      return
    }
    
    fetchDealDetail()
  }

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!id || !comment.trim()) return
    
    setSubmitting(true)
    const { error } = await hotDealAPI.createComment(Number(id), {
      content: comment
    })

    if (error) {
      alert('댓글 작성 실패: ' + error)
      setSubmitting(false)
      return
    }

    setComment("")
    setSubmitting(false)
    fetchDealDetail()
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    
    const { error } = await hotDealAPI.deleteComment(commentId)
    if (error) {
      alert('댓글 삭제 실패: ' + error)
      return
    }
    
    fetchDealDetail()
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

  if (error || !deal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || '핫딜을 찾을 수 없습니다.'}</p>
            <Button onClick={() => navigate('/hot-deals')}>목록으로</Button>
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
          {/* 뒤로가기 */}
          <div className="mb-6 text-left">
            <Button variant="ghost" onClick={() => navigate('/hot-deals')}>
              <ArrowLeft className="mr-2" size={18} />
              목록으로
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 메인 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 제목 / 메타정보 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                        {deal.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={handleToggleLike}>
                        <Heart
                          size={20}
                          className={deal.isLiked ? 'fill-red-500 text-red-500' : ''}
                        />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleToggleBookmark}>
                        <Bookmark
                          size={20}
                          className={deal.isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* 작성자 */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{deal.authorName}</p>
                      <p className="text-sm text-gray-500">{deal.createdAt}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />

                  {/* 상세 설명 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">상세 설명</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {deal.content}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-red-500" />
                      {deal.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {deal.commentCount}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 댓글 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    댓글 ({deal.comments?.length || 0})
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
                        onChange={e => setComment(e.target.value)}
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
                    {deal.comments?.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>👤</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{c.authorName}</span>
                            <span className="text-xs text-gray-500">{c.createdAt}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{c.content}</p>
                          <button 
                            className="text-xs text-gray-500 hover:text-red-500"
                            onClick={() => handleDeleteComment(c.id)}
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
              {/* 가격 정보 */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {deal.price && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">할인 가격</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-600">
                          {deal.price.toLocaleString()}원
                        </span>
                      </div>
                      {deal.originalPrice && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-400 line-through">
                            {deal.originalPrice.toLocaleString()}원
                          </span>
                          {deal.discount && (
                            <Badge className="bg-red-500 text-white">
                              {deal.discount}% 할인
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
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

export default HotDealDetailsPage