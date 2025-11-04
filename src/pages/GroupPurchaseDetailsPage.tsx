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
  Users, 
  Heart, 
  Bookmark, 
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
  Package,
  Send
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 임시 더미 데이터
const groupBuyData = {
  id: 1,
  title: "제주 감귤 5kg 공동구매",
  description: "달콤한 제주 감귤을 저렴하게! 무료배송\n\n신선한 제주 감귤을 산지 직송으로 받아보세요. 당도가 높고 맛있습니다!",
  author: "김철수",
  authorAvatar: "👨",
  category: "식품",
  price: 15000,
  originalPrice: 25000,
  currentParticipants: 8,
  targetParticipants: 10,
  deadline: "2025.11.10",
  startDate: "2025.11.04",
  location: {
    city: "서울시",
    district: "강남구",
    neighborhood: "역삼동"
  },
  meetingPlace: "역삼역 2번 출구 앞",
  image: "🍊",
  likes: 24,
  comments: 12,
  bookmarks: 8,
  status: "모집중",
  createdAt: "2시간 전",
  productInfo: "제주 감귤 5kg (중과)\n원산지: 제주\n배송: 산지직송",
  participants: [
    { name: "김철수", avatar: "👨", joinedAt: "2시간 전" },
    { name: "이영희", avatar: "👩", joinedAt: "1시간 전" },
    { name: "박민수", avatar: "👨", joinedAt: "30분 전" },
    { name: "정수진", avatar: "👩", joinedAt: "10분 전" }
  ]
}

const commentsData = [
  { id: 1, author: "이영희", avatar: "👩", content: "참여합니다! 언제 받을 수 있나요?", createdAt: "1시간 전", likes: 3 },
  { id: 2, author: "박민수", avatar: "👨", content: "감귤 당도가 어느정도인가요?", createdAt: "40분 전", likes: 1 },
  { id: 3, author: "김철수", avatar: "👨", content: "@박민수 당도 12-13브릭스 정도입니다!", createdAt: "35분 전", likes: 2 }
]

function GroupPurchaseDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [joined, setJoined] = useState(false)
  const [comment, setComment] = useState("")

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
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
                      <Badge>{groupBuyData.status}</Badge>
                      <Badge variant="outline">{groupBuyData.category}</Badge>
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
                  <CardTitle className="text-3xl mb-4">{groupBuyData.title}</CardTitle>
                  
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="text-2xl">{groupBuyData.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{groupBuyData.author}</p>
                      <p className="text-sm text-gray-500">{groupBuyData.createdAt}</p>
                    </div>
                  </div>

                  {/* 위치 정보 */}
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <MapPin size={18} />
                    <span className="text-sm">
                      {groupBuyData.location.city} {groupBuyData.location.district} {groupBuyData.location.neighborhood}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  
                  {/* 상세 설명 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">상세 설명</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {groupBuyData.description}
                    </p>
                  </div>

                  <Separator />

                  {/* 상품 정보 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Package size={20} />
                      상품 정보
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                      {groupBuyData.productInfo}
                    </p>
                  </div>

                  <Separator />

                  {/* 픽업 장소 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">픽업 장소</h3>
                    <p className="text-gray-700">{groupBuyData.meetingPlace}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 댓글 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    댓글 ({commentsData.length})
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
                    </div>
                  </div>

                  <Separator />

                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {commentsData.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>{comment.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.createdAt}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                          <button className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
                            <Heart size={12} />
                            좋아요 {comment.likes}
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
                        {groupBuyData.price.toLocaleString()}원
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {groupBuyData.originalPrice.toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      {Math.round(((groupBuyData.originalPrice - groupBuyData.price) / groupBuyData.originalPrice) * 100)}% 할인
                    </p>
                  </div>

                  <Separator />

                  {/* 참여 현황 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">참여 현황</span>
                      <span className="font-semibold text-blue-600">
                        {groupBuyData.currentParticipants}/{groupBuyData.targetParticipants}명
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(groupBuyData.currentParticipants, groupBuyData.targetParticipants)} className="mb-2" />
                    <p className="text-xs text-gray-500">
                      {groupBuyData.targetParticipants - groupBuyData.currentParticipants}명 더 필요해요!
                    </p>
                  </div>

                  <Separator />

                  {/* 기간 정보 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-600">시작:</span>
                      <span className="font-semibold">{groupBuyData.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-gray-600">마감:</span>
                      <span className="font-semibold text-orange-600">{groupBuyData.deadline}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* 참여하기 버튼 */}
                  <Button 
                    className="w-full bg-blue-500 h-12 text-lg"
                    disabled={groupBuyData.status === "마감" || joined}
                    onClick={() => setJoined(true)}
                  >
                    {joined ? "참여 완료" : groupBuyData.status === "마감" ? "마감되었습니다" : "참여하기"}
                  </Button>

                  {joined && (
                    <p className="text-sm text-center text-green-600">
                      ✓ 공동구매에 참여하셨습니다!
                    </p>
                  )}
                </CardContent>
              </Card>
              {/* 참여자 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    참여자 ({groupBuyData.currentParticipants}명)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {groupBuyData.participants.map((participant, index) => (
                      <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                        <Avatar className="mb-2">
                          <AvatarFallback className="text-2xl">{participant.avatar}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-sm">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.joinedAt}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 통계 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-around text-center">
                    <div>
                      <Heart size={20} className="mx-auto mb-1 text-gray-400" />
                      <p className="text-sm font-semibold">{groupBuyData.likes + (liked ? 1 : 0)}</p>
                      <p className="text-xs text-gray-500">좋아요</p>
                    </div>
                    <div>
                      <MessageCircle size={20} className="mx-auto mb-1 text-gray-400" />
                      <p className="text-sm font-semibold">{groupBuyData.comments}</p>
                      <p className="text-xs text-gray-500">댓글</p>
                    </div>
                    <div>
                      <Bookmark size={20} className="mx-auto mb-1 text-gray-400" />
                      <p className="text-sm font-semibold">{groupBuyData.bookmarks + (bookmarked ? 1 : 0)}</p>
                      <p className="text-xs text-gray-500">북마크</p>
                    </div>
                  </div>
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