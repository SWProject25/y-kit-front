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
  Clock,
  MapPin,
  Flame,
  Send,
  Navigation,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 임시 데이터
const dealData = {
  id: 1,
  title: "스타벅스 아메리카노 1+1",
  description:
    "오늘만! 강남역점 한정\n\n매장 방문 시 아메리카노 2잔을 1잔 가격에 드립니다.\n직원에게 말씀하시면 됩니다!",
  author: "커피러버",
  authorAvatar: "☕",
  category: "카페",
  location: {
    city: "서울시",
    district: "강남구",
    neighborhood: "역삼동",
    detail: "강남역 2번 출구 앞"
  },
  storeName: "스타벅스 강남역점",
  address: "서울시 강남구 강남대로 지하 396",
  originalPrice: 9000,
  discountPrice: 4500,
  discount: 50,
  validUntil: "오늘 18:00까지",
  likes: 89,
  comments: 34,
  bookmarks: 56,
  isHot: true,
  createdAt: "1시간 전",
  tags: ["카페", "아메리카노", "1+1", "강남역"],
  lat: 37.5665,
  lng: 126.978
}

const commentsData = [
  { id: 1, author: "카페마니아", avatar: "😊", content: "오 좋은 정보 감사합니다!", createdAt: "30분 전", likes: 5 },
  { id: 2, author: "직장인A", avatar: "👔", content: "점심 후에 커피 마시러 가야겠네요", createdAt: "20분 전", likes: 2 },
  { id: 3, author: "커피러버", avatar: "☕", content: "서두르세요! 오늘까지만 해요", createdAt: "10분 전", likes: 3 }
]

function HotDealDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [comment, setComment] = useState("")

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
                    <div>
                      <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                        {dealData.title}
                        {dealData.isHot && (
                          <Badge className="bg-red-500 text-white flex items-center gap-1">
                            <Flame size={14} />
                            HOT
                          </Badge>
                        )}
                        <Badge className="bg-blue-600 text-white">{dealData.discount}% 할인</Badge>
                      </CardTitle>

                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{dealData.category}</Badge>
                        {dealData.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setLiked(!liked)}>
                        <Heart
                          size={20}
                          className={liked ? 'fill-red-500 text-red-500' : ''}
                        />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setBookmarked(!bookmarked)}>
                        <Bookmark
                          size={20}
                          className={bookmarked ? 'fill-yellow-400 text-yellow-400' : ''}
                        />
                      </Button>
                    </div>
                  </div>

                  {/* 작성자 */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="text-2xl">{dealData.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{dealData.author}</p>
                      <p className="text-sm text-gray-500">{dealData.createdAt}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />

                  {/* 상세 설명 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">상세 설명</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {dealData.description}
                    </p>
                  </div>

                  <Separator />

                  {/* 매장 정보 */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">매장 정보</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                      <MapPin size={48} className="text-blue-500 mb-2" />
                      <p className="font-semibold">{dealData.storeName}</p>
                      <p className="text-sm text-gray-500">{dealData.location.detail}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        (카카오맵 API 연동 예정)
                      </p>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Navigation size={16} className="mr-2" />
                      길찾기
                    </Button>
                  </div>

                  <span className="flex items-center gap-1">
                    <Heart size={14} className="text-red-500" />
                    {dealData.likes + (liked ? 1 : 0)}
                  </span>
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
                        onChange={e => setComment(e.target.value)}
                        className="mb-2"
                      />
                      <Button size="sm" className="w-full">
                        <Send size={16} className="mr-2" />
                        댓글 작성
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {commentsData.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>{c.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{c.author}</span>
                            <span className="text-xs text-gray-500">{c.createdAt}</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{c.content}</p>
                          <button className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
                            <Heart size={12} />
                            좋아요 {c.likes}
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
                  {/* 가격 */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">할인 가격</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-red-600">
                        {dealData.discountPrice.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-400 line-through">
                        {dealData.originalPrice.toLocaleString()}원
                      </span>
                      <Badge className="bg-red-500 text-white">
                        {dealData.discount}% 할인
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* 유효기간 */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-600">
                      <Clock size={18} />
                      <span className="font-semibold">{dealData.validUntil}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* 버튼 */}
                  <div className="space-y-2">
                    <Button className="w-full">
                      <ExternalLink size={16} className="mr-2" />
                      매장 바로가기
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Navigation size={16} className="mr-2" />
                      길찾기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 태그 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">태그</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dealData.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
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

export default HotDealDetailsPage