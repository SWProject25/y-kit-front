import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface GroupBuyItem {
  id: number
  title: string
  description: string
  author: string
  authorAvatar: string
  category: string
  price: number
  originalPrice: number
  currentParticipants: number
  targetParticipants: number
  deadline: string
  location: {
    city: string
    district: string
    subdistrict: string
  }
  likes: number
  comments: number
  bookmarks: number
  status: string
}

const groupBuyItems: GroupBuyItem[] = [
  {
    id: 1,
    title: "제주 감귤 5kg 공동구매",
    description: "달콤한 제주 감귤을 저렴하게!",
    author: "김철수",
    authorAvatar: "👨",
    category: "식품",
    price: 15000,
    originalPrice: 25000,
    currentParticipants: 8,
    targetParticipants: 10,
    deadline: "2025.11.10",
    location: { city: "서울시", district: "강남구", subdistrict: "역삼동" },
    likes: 24,
    comments: 12,
    bookmarks: 8,
    status: "모집중"
  },
  {
    id: 2,
    title: "휴지 30개입",
    description: "부드러운 롤 휴지",
    author: "이영희",
    authorAvatar: "👩",
    category: "생활용품",
    price: 79000,
    originalPrice: 150000,
    currentParticipants: 15,
    targetParticipants: 20,
    deadline: "2025.11.08",
    location: { city: "서울시", district: "서초구", subdistrict: "삼성동" },
    likes: 45,
    comments: 23,
    bookmarks: 18,
    status: "모집중"
  },
  {
    id: 3,
    title: "유기농 쌀 10kg",
    description: "농가 직송 햅쌀 공구합니다",
    author: "박민수",
    authorAvatar: "👨",
    category: "식품",
    price: 28000,
    originalPrice: 40000,
    currentParticipants: 20,
    targetParticipants: 20,
    deadline: "2025.11.05",
    location: { city: "서울시", district: "송파구", subdistrict: "잠실동" },
    likes: 67,
    comments: 34,
    bookmarks: 29,
    status: "마감"
  },
  {
    id: 4,
    title: "프리미엄 캠핑 의자",
    description: "편안한 접이식 캠핑의자 공구",
    author: "정수진",
    authorAvatar: "👩",
    category: "레저",
    price: 35000,
    originalPrice: 55000,
    currentParticipants: 3,
    targetParticipants: 15,
    deadline: "2025.11.15",
    location: { city: "서울시", district: "마포구", subdistrict: "상암동" },
    likes: 12,
    comments: 5,
    bookmarks: 7,
    status: "모집중"
  }
]

const categories = ["전체", "식품", "전자제품", "생활용품", "레저", "패션"]

function GroupPurchasePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [sortBy, setSortBy] = useState("latest")
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [bookmarkedItems, setBookmarkedItems] = useState<number[]>([])

  const handleLike = (id: number) => {
    setLikedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleBookmark = (id: number) => {
    setBookmarkedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredItems = groupBuyItems.filter(item => {
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getProgressPercentage = (current: number, target: number) =>
    Math.min((current / target) * 100, 100)

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
                />
              </div>
              <div className="flex gap-2 overflow-x-auto justify-center">
                <Select>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="시/도" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="seoul">서울시</SelectItem>
                      <SelectItem value="busan">부산시</SelectItem>
                      <SelectItem value="incheon">인천시</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="시/군/구" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="gangnam">강남구</SelectItem>
                      <SelectItem value="songpa">송파구</SelectItem>
                      <SelectItem value="mapo">마포구</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="읍/면/동" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="yeoksam">역삼동</SelectItem>
                      <SelectItem value="sangam">상암동</SelectItem>
                      <SelectItem value="jamsil">잠실동</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>

            {/* 카테고리 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map(category => (
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
          </div>

          {/* 카드 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
                <CardHeader className="pb-3">
                  {/* ✅ 위치 정보 */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin size={12} className="text-blue-600" />
                    {item.location.city} &gt; {item.location.district} &gt; {item.location.subdistrict}
                  </div>

                  {/* 상태 / 카테고리 */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={item.status === "마감" ? "secondary" : "default"}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>

                  <CardTitle 
                    className="text-lg cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/group-purchase/${item.id}`)}
                  >
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* 작성자 */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{item.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{item.author}</span>
                  </div>

                  {/* 가격 */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {item.price.toLocaleString()}원
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {item.originalPrice.toLocaleString()}원
                    </span>
                  </div>

                  {/* 참여 현황 */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        <Users className="inline mr-1" size={14} />
                        {item.currentParticipants}/{item.targetParticipants}명
                      </span>
                      <span className="font-semibold text-blue-600">
                        {Math.round(getProgressPercentage(item.currentParticipants, item.targetParticipants))}%
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(item.currentParticipants, item.targetParticipants)} />
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
                    disabled={item.status === "마감"}
                    onClick={() => navigate(`/group-purchase/${item.id}`)}
                  >
                    {item.status === "마감" ? "마감되었습니다" : "참여하기"}
                  </Button>

                  {/* 좋아요, 댓글, 북마크 */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
                        onClick={() => handleLike(item.id)}
                      >
                        <Heart 
                          size={16} 
                          className={likedItems.includes(item.id) ? "fill-red-500 text-red-500" : ""}
                        />
                        {item.likes + (likedItems.includes(item.id) ? 1 : 0)}
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={() => navigate(`/group-purchase/${item.id}`)}
                      >
                        <MessageCircle size={16} />
                        {item.comments}
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-500 transition-colors"
                      onClick={() => handleBookmark(item.id)}
                    >
                      <Bookmark 
                        size={16}
                        className={bookmarkedItems.includes(item.id) ? "fill-yellow-400 text-yellow-400" : ""}
                      />
                      {item.bookmarks + (bookmarkedItems.includes(item.id) ? 1 : 0)}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 결과 없음 */}
          {filteredItems.length === 0 && (
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

export default GroupPurchasePage