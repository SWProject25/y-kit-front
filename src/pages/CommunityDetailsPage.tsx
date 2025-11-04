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
  Send,
  Share2
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 임시 더미 데이터
const postData = {
  id: 1,
  title: "청년 월세 지원 받으신 분 계신가요?",
  content: `신청 방법이 궁금해요. 서류 준비는 어떻게 하나요?

안녕하세요! 청년 월세 지원 정책에 대해 궁금한 점이 많아서 글 올립니다.

1. 신청 자격이 정확히 어떻게 되나요?
2. 필요한 서류는 무엇인가요?
3. 신청 기간이 언제까지인가요?
4. 실제로 받으신 분들 계시면 후기 부탁드립니다!

자세한 정보 공유해주시면 정말 감사하겠습니다 🙏`,
  author: "청년A",
  authorAvatar: "👤",
  category: "정책질문",
  views: 234,
  likes: 45,
  comments: 23,
  bookmarks: 12,
  createdAt: "2시간 전",
  tags: ["월세지원", "청년정책", "주거", "질문"],
  commentList: [
    {
      id: 1,
      author: "정책박사",
      avatar: "🎓",
      content: "저도 최근에 신청했어요! 필요한 서류는 주민등록등본, 임대차계약서, 소득증빙서류 등이에요. 자세한 건 청년정책 페이지에서 확인하시면 됩니다!",
      createdAt: "1시간 전",
      likes: 12
    },
    {
      id: 2,
      author: "월세걱정",
      avatar: "😥",
      content: "저는 작년에 받았는데, 신청 과정이 생각보다 간단했어요. 온라인으로 신청하고 서류만 제출하면 됩니다.",
      createdAt: "1시간 전",
      likes: 8
    },
    {
      id: 3,
      author: "도움러",
      avatar: "💁",
      content: "신청 자격은 만 19-34세 무주택 청년이고, 소득 기준도 있으니 확인해보세요!",
      createdAt: "40분 전",
      likes: 5
    },
    {
      id: 4,
      author: "청년A",
      avatar: "👤",
      content: "다들 답변 감사합니다! 많은 도움이 됐어요 ㅎㅎ",
      createdAt: "30분 전",
      likes: 3
    }
  ]
}

function CommunityDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [comment, setComment] = useState("")
  const [commentLikes, setCommentLikes] = useState<number[]>([])

  const handleCommentLike = (commentId: number) => {
    if (commentLikes.includes(commentId)) {
      setCommentLikes(commentLikes.filter(id => id !== commentId))
    } else {
      setCommentLikes([...commentLikes, commentId])
    }
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
                  <Badge>{postData.category}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Eye size={14} />
                    {postData.views}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Share2 size={16} className="mr-1" />
                    공유
                  </Button>
                </div>
              </div>

              <CardTitle className="text-3xl mb-4">{postData.title}</CardTitle>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-2xl">{postData.authorAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{postData.author}</p>
                    <p className="text-sm text-gray-500">{postData.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart 
                      size={20} 
                      className={liked ? "fill-red-500 text-red-500" : ""}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBookmarked(!bookmarked)}
                  >
                    <Bookmark 
                      size={20}
                      className={bookmarked ? "fill-yellow-400 text-yellow-400" : ""}
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
                  {postData.content}
                </p>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2">
                {postData.tags.map(tag => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>

              <Separator />

              {/* 좋아요, 댓글 통계 */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-6">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart 
                      size={20} 
                      className={liked ? "fill-red-500 text-red-500" : ""}
                    />
                    <span className="font-semibold">
                      {postData.likes + (liked ? 1 : 0)}
                    </span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={20} />
                    <span className="font-semibold">{postData.comments}</span>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors"
                  onClick={() => setBookmarked(!bookmarked)}
                >
                </button>
              </div>
            </CardContent>
          </Card>

          {/* 댓글 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle size={20} />
                댓글 {postData.comments}개
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
                    <Button>
                      <Send size={16} className="mr-2" />
                      댓글 작성
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 댓글 목록 */}
              <div className="space-y-6">
                {postData.commentList.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{comment.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.createdAt}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <button 
                          className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                          onClick={() => handleCommentLike(comment.id)}
                        >
                          <Heart 
                            size={14}
                            className={commentLikes.includes(comment.id) ? "fill-red-500 text-red-500" : ""}
                          />
                          좋아요 {comment.likes + (commentLikes.includes(comment.id) ? 1 : 0)}
                        </button>
                        <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                          답글
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