import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Eye,
  PenSquare
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 임시 더미 데이터
const posts = [
  {
    id: 1,
    title: "청년 월세 지원 받으신 분 계신가요?",
    content: "신청 방법이 궁금해요. 서류 준비는 어떻게 하나요?",
    author: "청년A",
    authorAvatar: "👤",
    category: "정책질문",
    views: 234,
    likes: 45,
    comments: 23,
    bookmarks: 12,
    createdAt: "2시간 전",
    tags: ["월세지원", "청년정책", "주거"]
  },
  {
    id: 2,
    title: "강남 저렴한 헬스장 추천해주세요",
    content: "월 3~4만원대로 다닐 수 있는 곳 있을까요?",
    author: "운동러버",
    authorAvatar: "💪",
    category: "정보공유",
    views: 567,
    likes: 89,
    comments: 45,
    bookmarks: 34,
    createdAt: "5시간 전",
    tags: ["헬스장", "강남구", "알뜰정보"]
  },
  {
    id: 3,
    title: "취업 준비 같이 하실 분 구해요",
    content: "스터디 카페에서 주 3회 모여서 같이 공부하실 분 찾습니다!",
    author: "취준생123",
    authorAvatar: "📚",
    category: "모임",
    views: 123,
    likes: 34,
    comments: 18,
    bookmarks: 8,
    createdAt: "1일 전",
    tags: ["취업", "스터디", "모임"]
  },
  {
    id: 4,
    title: "청년도약계좌 vs 청년내일저축계좌 비교",
    content: "두 개 중에 어떤 게 더 유리한가요? 자세한 비교 부탁드립니다.",
    author: "재테크초보",
    authorAvatar: "💰",
    category: "정책질문",
    views: 890,
    likes: 156,
    comments: 67,
    bookmarks: 89,
    createdAt: "1일 전",
    tags: ["저축", "금융정책", "비교"]
  },
  {
    id: 5,
    title: "저렴한 점심 식사 맛집 리스트",
    content: "서울 주요 지역별로 5천원 이하 점심 맛집 정리했어요!",
    author: "맛집탐방가",
    authorAvatar: "🍽️",
    category: "정보공유",
    views: 1234,
    likes: 234,
    comments: 89,
    bookmarks: 123,
    createdAt: "2일 전",
    tags: ["맛집", "점심", "가성비"]
  }
]

const categories = ["전체", "정책질문", "정보공유", "모임", "고민상담", "자유"]

function CommunityPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [sortBy, setSortBy] = useState("latest")
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([])

  const handleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(post => post !== id))
    } else {
      setLikedPosts([...likedPosts, id])
    }
  }

  const handleBookmark = (id: number) => {
    if (bookmarkedPosts.includes(id)) {
      setBookmarkedPosts(bookmarkedPosts.filter(post => post !== id))
    } else {
      setBookmarkedPosts([...bookmarkedPosts, id])
    }
  }

  // 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 페이지 타이틀 */}
          <div className="mb-6 text-left flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                커뮤니티
              </h1>
              <p className="text-gray-600">
                청년들과 정보를 나누고 소통하는 공간
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <PenSquare size={18} />
              글쓰기
            </Button>
          </div>

          {/* 검색 및 필터 */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 검색바 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="게시글 검색..."
                  className="pl-10 w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                총 <span className="font-semibold text-gray-900 text-base">{filteredPosts.length}</span>개의 게시글
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="comments">댓글많은순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 게시글 리스트 */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id} 
                className="hover:shadow-md transition-shadow cursor-pointer bg-white"
                onClick={() => navigate(`/community/${post.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* 작성자 아바타 */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="text-2xl">{post.authorAvatar}</AvatarFallback>
                    </Avatar>

                    {/* 게시글 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        <span className="text-sm text-gray-600">{post.author}</span>
                        <span className="text-sm text-gray-400">·</span>
                        <span className="text-sm text-gray-400">{post.createdAt}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* 통계 및 액션 버튼 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {post.views}
                          </span>
                          <button
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(post.id)
                            }}
                          >
                            <Heart 
                              size={16} 
                              className={likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""}
                            />
                            {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                          </button>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            {post.comments}
                          </span>
                        </div>

                        <button
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookmark(post.id)
                          }}
                        >
                          <Bookmark 
                            size={16}
                            className={bookmarkedPosts.includes(post.id) ? "fill-yellow-400 text-yellow-400" : ""}
                          />
                          {post.bookmarks + (bookmarkedPosts.includes(post.id) ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {filteredPosts.length === 0 && (
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

export default CommunityPage