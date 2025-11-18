import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
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
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { communityAPI } from '@/api/client'
import type { CommunityListResponse, CommunityCategory } from '@/types/api'

const categories: (CommunityCategory | "전체")[] = ["전체", "FREE", "QUESTION", "TIP", "REVIEW", "NEWS"]
const categoryLabels: Record<CommunityCategory | "전체", string> = {
  "전체": "전체",
  "FREE": "자유",
  "QUESTION": "질문",
  "TIP": "팁",
  "REVIEW": "후기",
  "NEWS": "뉴스"
}

function CommunityPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | "전체">("전체")
  const [sortBy, setSortBy] = useState("latest")
  const [posts, setPosts] = useState<CommunityListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 게시글 목록 불러오기
  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, currentPage])

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)

    const { data, error: apiError } = await communityAPI.getCommunityList({
      category: selectedCategory === "전체" ? undefined : selectedCategory,
      page: currentPage,
      size: 20
    })

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setPosts(data.content)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }

  // 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchPosts()
      return
    }

    setLoading(true)
    const { data, error: apiError } = await communityAPI.searchCommunities({
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
      setPosts(data.content)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }

  // 좋아요 토글
  const handleLike = async (e: React.MouseEvent, communityId: number) => {
    e.stopPropagation()
    
    const { error } = await communityAPI.toggleLike(communityId)
    if (error) {
      alert('좋아요 처리 실패: ' + error)
      return
    }
    
    fetchPosts()
  }

  // 북마크 토글
  const handleBookmark = async (e: React.MouseEvent, communityId: number) => {
    e.stopPropagation()
    
    const { error } = await communityAPI.toggleBookmark(communityId)
    if (error) {
      alert('북마크 처리 실패: ' + error)
      return
    }
    
    fetchPosts()
  }

  if (loading && posts.length === 0) {
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
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate('/community/write')}
            >
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>검색</Button>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category)
                    setCurrentPage(0)
                  }}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  {categoryLabels[category]}
                </Button>
              ))}
            </div>

            {/* 결과 및 정렬 */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                총 <span className="font-semibold text-gray-900 text-base">{posts.length}</span>개의 게시글
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

          {error && (
            <div className="text-center py-6 text-red-500">
              에러: {error}
            </div>
          )}

          {/* 게시글 리스트 */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="hover:shadow-md transition-shadow cursor-pointer bg-white"
                onClick={() => navigate(`/community/${post.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* 작성자 아바타 */}
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>

                    {/* 게시글 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[post.category]}
                        </Badge>
                        <span className="text-sm text-gray-600">{post.authorName}</span>
                        <span className="text-sm text-gray-400">·</span>
                        <span className="text-sm text-gray-400">{post.createdAt}</span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                        {post.title}
                      </h3>

                      {/* 통계 및 액션 버튼 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={16} />
                            {post.viewCount}
                          </span>
                          <button
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            onClick={(e) => handleLike(e, post.id)}
                          >
                            <Heart size={16} />
                            {post.likeCount}
                          </button>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            {post.commentCount}
                          </span>
                        </div>

                        <button
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-500 transition-colors"
                          onClick={(e) => handleBookmark(e, post.id)}
                        >
                          <Bookmark size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
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

export default CommunityPage