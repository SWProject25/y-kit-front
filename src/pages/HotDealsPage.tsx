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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 임시 더미 데이터
const deals = [
  {
    id: 1,
    title: "스타벅스 아메리카노 1+1",
    description: "오늘만! 강남역점 한정",
    author: "커피러버",
    authorAvatar: "☕",
    category: "카페",
    location: "강남구",
    district: "강남역",
    originalPrice: 9000,
    discountPrice: 4500,
    discount: 50,
    validUntil: "오늘 18:00까지",
    image: "☕",
    likes: 89,
    comments: 34,
    bookmarks: 56,
    isHot: true,
    createdAt: "1시간 전"
  },
  {
    id: 2,
    title: "피자헛 라지피자 반값",
    description: "매장 방문 시 50% 할인",
    author: "피자덕후",
    authorAvatar: "🍕",
    category: "음식",
    location: "서초구",
    district: "교대역",
    originalPrice: 28000,
    discountPrice: 14000,
    discount: 50,
    validUntil: "11/10까지",
    image: "🍕",
    likes: 156,
    comments: 67,
    bookmarks: 89,
    isHot: true,
    createdAt: "2시간 전"
  },
  {
    id: 3,
    title: "CGV 조조 영화 5,000원",
    description: "평일 오전 할인",
    author: "영화광",
    authorAvatar: "🎬",
    category: "문화",
    location: "강남구",
    district: "역삼역",
    originalPrice: 14000,
    discountPrice: 5000,
    discount: 64,
    validUntil: "평일 11시 전",
    image: "🎬",
    likes: 234,
    comments: 89,
    bookmarks: 145,
    isHot: true,
    createdAt: "3시간 전"
  },
  {
    id: 4,
    title: "네이처리퍼블릭 전품목 1+1",
    description: "회원 가입 시 추가 10% 할인",
    author: "뷰티헌터",
    authorAvatar: "💄",
    category: "뷰티",
    location: "송파구",
    district: "잠실역",
    originalPrice: 20000,
    discountPrice: 10000,
    discount: 50,
    validUntil: "11/15까지",
    image: "💄",
    likes: 123,
    comments: 45,
    bookmarks: 78,
    isHot: false,
    createdAt: "5시간 전"
  },
  {
    id: 5,
    title: "24시 피트니스 11월 무료체험",
    description: "신규 회원 한정",
    author: "헬린이",
    authorAvatar: "💪",
    category: "운동",
    location: "마포구",
    district: "홍대입구역",
    originalPrice: 80000,
    discountPrice: 0,
    discount: 100,
    validUntil: "11/30까지",
    image: "💪",
    likes: 67,
    comments: 23,
    bookmarks: 45,
    isHot: false,
    createdAt: "1일 전"
  }
]

const categories = ["전체", "카페", "음식", "문화", "뷰티", "운동", "쇼핑"]
const districts = ["전체", "강남구", "서초구", "송파구", "마포구", "영등포구"]

function HotDealsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedDistrict, setSelectedDistrict] = useState("전체")
  const [sortBy, setSortBy] = useState("latest")
  const [likedDeals, setLikedDeals] = useState<number[]>([])
  const [bookmarkedDeals, setBookmarkedDeals] = useState<number[]>([])

  const handleLike = (id: number) => {
    if (likedDeals.includes(id)) {
      setLikedDeals(likedDeals.filter(deal => deal !== id))
    } else {
      setLikedDeals([...likedDeals, id])
    }
  }

  const handleBookmark = (id: number) => {
    if (bookmarkedDeals.includes(id)) {
      setBookmarkedDeals(bookmarkedDeals.filter(deal => deal !== id))
    } else {
      setBookmarkedDeals([...bookmarkedDeals, id])
    }
  }

  // 필터링된 핫딜
  const filteredDeals = deals.filter(deal => {
    const matchesCategory = selectedCategory === "전체" || deal.category === selectedCategory
    const matchesDistrict = selectedDistrict === "전체" || deal.location === selectedDistrict
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesDistrict && matchesSearch
  })

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
                />
              </div>

              {/* 지역 선택 */}
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* 결과 및 정렬 */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                총 <span className="font-semibold text-gray-900 text-base">{filteredDeals.length}</span>개의 핫딜
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="discount">할인율순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 핫딜 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <Card 
                key={deal.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white overflow-hidden"
                onClick={() => navigate(`/hot-deals/${deal.id}`)}
              >
                <CardHeader className="pb-3 flex justify-between items-start">
                {/* 왼쪽 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{deal.category}</Badge>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      {deal.district}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                </div>

                {/* 오른쪽 퍼센트 뱃지 */}
                <Badge className="bg-blue-600 text-white text-lg font-bold">
                  {deal.discount}%
                </Badge>
              </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{deal.description}</p>

                  {/* 작성자 */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{deal.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{deal.author}</span>
                    <span className="text-xs text-gray-400">· {deal.createdAt}</span>
                  </div>

                  {/* 가격 */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-600">
                      {deal.discountPrice.toLocaleString()}원
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {deal.originalPrice.toLocaleString()}원
                    </span>
                  </div>

                  {/* 유효기간 */}
                  <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
                    <Clock size={12} />
                    {deal.validUntil}
                  </div>

                  {/* 좋아요, 댓글, 북마크 */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(deal.id)
                        }}
                      >
                        <Heart 
                          size={16} 
                          className={likedDeals.includes(deal.id) ? "fill-red-500 text-red-500" : ""}
                        />
                        {deal.likes + (likedDeals.includes(deal.id) ? 1 : 0)}
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/hot-deals/${deal.id}`)
                        }}
                      >
                        <MessageCircle size={16} />
                        {deal.comments}
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBookmark(deal.id)
                      }}
                    >
                      <Bookmark 
                        size={16}
                        className={bookmarkedDeals.includes(deal.id) ? "fill-yellow-400 text-yellow-400" : ""}
                      />
                      {deal.bookmarks + (bookmarkedDeals.includes(deal.id) ? 1 : 0)}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {filteredDeals.length === 0 && (
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

export default HotDealsPage