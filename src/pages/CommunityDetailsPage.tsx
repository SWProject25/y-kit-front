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
  Eye,
  Send
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { communityAPI } from '@/api/client'
import type { CommunityDetailResponse, CommunityCategory } from '@/types/api'

const categoryLabels: Record<CommunityCategory, string> = {
  "FREE": "자유",
  "QUESTION": "질문",
  "TIP": "팁",
  "REVIEW": "후기",
  "NEWS": "뉴스"
}

function CommunityDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<CommunityDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 게시글 상세 조회
  useEffect(() => {
    if (!id) return
    fetchPostDetail()
  }, [id])

  const fetchPostDetail = async () => {
    if (!id) return
    
    setLoading(true)
    const { data, error: apiError } = await communityAPI.getCommunityDetail(Number(id))

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setPost(data)
    }
    setLoading(false)
  }

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!id) return
    
    const { error } = await communityAPI.toggleLike(Number(id))
    if (error) {
      alert('좋아요 처리 실패: ' + error)
      return
    }
    
    fetchPostDetail()
  }

  // 북마크 토글
  const handleToggleBookmark = async () => {
    if (!id) return
    
    const { error } = await communityAPI.toggleBookmark(Number(id))
    if (error) {
      alert('북마크 처리 실패: ' + error)
      return
    }
    
    fetchPostDetail()
  }

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!id || !comment.trim()) return
    
    setSubmitting(true)
    const { error } = await communityAPI.createComment(Number(id), {
      content: comment
    })

    if (error) {
      alert('댓글 작성 실패: ' + error)
      setSubmitting(false)
      return
    }

    setComment("")
    setSubmitting(false)
    fetchPostDetail() // 댓글 목록 새로고침
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    
    const { error } = await communityAPI.deleteComment(commentId)
    if (error) {
      alert('댓글 삭제 실패: ' + error)
      return
    }
    
    fetchPostDetail()
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

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
            <Button onClick={() => navigate('/community')}>목록으로</Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6 text-left">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/community')}
            >
              <ArrowLeft className="mr-2" size={18} />
              목록으로
            </Button>
          </div>

          {/* 게시글 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge>{categoryLabels[post.category]}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Eye size={14} />
                    {post.viewCount}
                  </span>
                </div>
              </div>

              <CardTitle className="text-3xl mb-4">{post.title}</CardTitle>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>👤</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.authorName}</p>
                    <p className="text-sm text-gray-500">{post.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleLike}
                  >
                    <Heart 
                      size={20} 
                      className={post.isLiked ? "fill-red-500 text-red-500" : ""}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleBookmark}
                  >
                    <Bookmark 
                      size={20}
                      className={post.isBookmarked ? "fill-yellow-400 text-yellow-400" : ""}
                    />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Separator />

              {/* 게시글 내용 */}
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                  {post.content}
                </p>
              </div>

              <Separator />

              {/* 좋아요, 댓글 통계 */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-6">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                    onClick={handleToggleLike}
                  >
                    <Heart 
                      size={20} 
                      className={post.isLiked ? "fill-red-500 text-red-500" : ""}
                    />
                    <span className="font-semibold">{post.likeCount}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={20} />
                    <span className="font-semibold">{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 댓글 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle size={20} />
                댓글 {post.comments.length}개
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 댓글 입력 */}
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>😊</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="댓글을 입력하세요..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-2 min-h-[100px]"
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
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">{comment.createdAt}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                          답글
                        </button>
                        <button 
                          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CommunityDetailsPage