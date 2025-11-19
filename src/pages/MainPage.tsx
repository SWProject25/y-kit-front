import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, TrendingUp, Bookmark, Award, ArrowRight, Flame, Users, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 더미 데이터
const recentPolicies = [
  { id: 1, title: "청년내일채움공제", category: "취업지원", description: "중소·중견기업 청년 근로자의 자산형성 지원", deadline: "2025.12.31" },
  { id: 2, title: "청년도약계좌", category: "금융지원", description: "청년의 중장기 자산형성을 지원하는 정책형 금융상품", deadline: "2025.12.31" },
  { id: 3, title: "청년월세 한시 특별지원", category: "주거지원", description: "저소득 청년의 월세 부담 경감을 위한 지원", deadline: "2025.06.30" },
  { id: 4, title: "국민취업지원제도", category: "취업지원", description: "취업지원서비스와 생계지원을 결합한 한국형 실업부조", deadline: "상시" },
]

// 실시간 순위 데이터
const trendingData = {
  policy: [
    { rank: 1, title: "청년 월세 지원 정책 총정리", views: 15234 },
    { rank: 2, title: "서울시 청년통장 신청 방법", views: 12456 },
    { rank: 3, title: "청년도약계좌 완벽 가이드", views: 9876 },
    { rank: 4, title: "청년내일채움공제 후기", views: 8543 },
    { rank: 5, title: "청년 취업 지원금 총정리", views: 7234 }
  ],
  groupbuy: [
    { rank: 1, title: "삼성 갤럭시 버즈 공동구매", participants: 145 },
    { rank: 2, title: "에어팟 프로 2세대 공구", participants: 132 },
    { rank: 3, title: "LG 그램 노트북 공구", participants: 98 },
    { rank: 4, title: "다이슨 청소기 V15", participants: 87 },
    { rank: 5, title: "나이키 에어포스 단체구매", participants: 76 }
  ],
  hotdeal: [
    { rank: 1, title: "애플워치 SE 역대급 할인!", discount: "35%" },
    { rank: 2, title: "쿠팡 로켓배송 1+1 행사", discount: "50%" },
    { rank: 3, title: "무신사 봄맞이 세일", discount: "40%" },
    { rank: 4, title: "올리브영 득템 리스트", discount: "30%" },
    { rank: 5, title: "편의점 2+1 추천템", discount: "33%" }
  ]
}

// 커뮤니티 최신글
const recentCommunity = [
  { id: 1, title: "청년 월세 지원 받으신 분 계신가요?", category: "질문", author: "청년A", comments: 23 },
  { id: 2, title: "강남 저렴한 헬스장 추천해주세요", category: "정보", author: "운동러버", comments: 45 },
  { id: 3, title: "취업 준비 같이 하실 분 구해요", category: "모임", author: "취준생123", comments: 18 },
]

// 핫딜 최신글
const recentHotDeals = [
  { id: 1, title: "스타벅스 아메리카노 1+1", place: "강남역점", discount: 50 },
  { id: 2, title: "피자헛 라지피자 반값", place: "교대역점", discount: 50 },
  { id: 3, title: "CGV 조조 영화 5,000원", place: "역삼역점", discount: 64 },
]

// 공동구매 최신글
const recentGroupPurchase = [
  { id: 1, title: "제주 감귤 5kg 공동구매", participants: "8/10명", status: "모집중" },
  { id: 2, title: "무선 이어폰 공동구매", participants: "15/20명", status: "모집중" },
  { id: 3, title: "유기농 쌀 10kg", participants: "20/20명", status: "마감" },
]

const myProfile = {
  name: "청년A",
  level: "활동가",
  savedPolicies: 5,
  badges: ["첫 글 작성", "댓글 달인"]
}

function MainPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<'policy' | 'groupbuy' | 'hotdeal'>('policy')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) console.log("검색어:", query)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 w-full pt-0">
        {/* 히어로 배너 */}
        <div className="w-full bg-sky-100 pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                청년을 위한 모든 정보, Y-Kit
              </h1>
              <p className="text-xl text-gray-700">
                정책부터 알뜰정보까지 한곳에서
              </p>
            </div>
            <form onSubmit={handleSearch} className="w-full max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="청년정책, 알뜰지도, 공동구매 등 원하는 정보를 검색해보세요"
                  className="pl-12 pr-4 h-14 text-base rounded-full border-2 border-gray-300 shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-sky-400 w-full bg-white"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ backgroundColor: '#FFFFFF' }} // 확실히 흰색으로
                />
              </div>
            </form>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 상단 카드 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 내 프로필 */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">내 프로필</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-2xl bg-blue-100">👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{myProfile.name}</h3>
                    <Badge variant="secondary" className="mt-1">{myProfile.level}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bookmark className="text-blue-600" size={20} />
                      <span className="text-sm font-medium">저장한 정책</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{myProfile.savedPolicies}</span>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="text-yellow-600" size={20} />
                      <span className="text-sm font-medium">획득 뱃지</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {myProfile.badges.map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">🏆 {badge}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 실시간 순위 */}
            <Card className="hover:shadow-lg transition-shadow border-[#E5E5E5] bg-white">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-[#0C2B4E]">
                  <TrendingUp className="text-[#1D546C]" />
                  실시간 인기 순위
                </CardTitle>
                <div className="flex gap-2 mt-4">
                  {['policy','groupbuy','hotdeal'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                        activeTab === tab ? 'bg-[#0C2B4E] text-white' : 'bg-[#F4F4F4] text-gray-600 hover:bg-[#E5E5E5]'
                      }`}
                    >
                      {tab==='policy'?'청년정책':tab==='groupbuy'?'공동구매':'핫딜'}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {activeTab === 'policy' && trendingData.policy.map(item => (
                    <div key={item.rank} className="flex items-center gap-3 p-3 hover:bg-[#F4F4F4] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E5E5E5]">
                      <span className={`font-bold w-8 text-center text-lg ${item.rank <= 3 ? 'text-[#1D546C]' : 'text-gray-500'}`}>{item.rank}</span>
                      <span className="flex-1 text-gray-800">{item.title}</span>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{item.views.toLocaleString()} 조회</span>
                    </div>
                  ))}
                  {activeTab === 'groupbuy' && trendingData.groupbuy.map(item => (
                    <div key={item.rank} className="flex items-center gap-3 p-3 hover:bg-[#F4F4F4] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E5E5E5]">
                      <span className={`font-bold w-8 text-center text-lg ${item.rank <= 3 ? 'text-[#1D546C]' : 'text-gray-500'}`}>{item.rank}</span>
                      <span className="flex-1 text-gray-800">{item.title}</span>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{item.participants}명 참여</span>
                    </div>
                  ))}
                  {activeTab === 'hotdeal' && trendingData.hotdeal.map(item => (
                    <div key={item.rank} className="flex items-center gap-3 p-3 hover:bg-[#F4F4F4] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E5E5E5]">
                      <span className={`font-bold w-8 text-center text-lg ${item.rank <= 3 ? 'text-[#1D546C]' : 'text-gray-500'}`}>{item.rank}</span>
                      <span className="flex-1 text-gray-800">{item.title}</span>
                      <span className="text-sm font-semibold text-red-500">{item.discount} 할인</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 추천 청년정책 (모바일 가로 스크롤 적용) */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">추천 청년정책</h2>
              <Button variant="ghost" onClick={() => navigate('/policies')} className="flex items-center gap-2">
                전체보기 <ArrowRight size={18} />
              </Button>
            </div>

            {/* 모바일 가로 스크롤 */}
            <div className="flex overflow-x-auto space-x-4 py-2 -mx-2 px-2">
              {recentPolicies.map(policy => (
                <Card
                  key={policy.id}
                  className="flex-shrink-0 w-72 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/policies/${policy.id}`)}
                >
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-blue-600">{policy.category}</Badge>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-3">{policy.description}</CardDescription>
                    <div className="text-xs text-gray-500">마감: {policy.deadline}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 커뮤니티, 핫딜, 공동구매 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 커뮤니티 */}
            <Card className="shadow-md">
              <CardHeader className="pb-4 flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="text-blue-600" size={24} /> 커뮤니티
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/community')}>더보기</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCommunity.map(post => (
                  <div key={post.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/community/${post.id}`)}>
                    <Badge variant="secondary" className="text-xs mb-2">{post.category}</Badge>
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{post.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 핫딜 */}
            <Card className="shadow-md">
              <CardHeader className="pb-4 flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Flame className="text-orange-500" size={24} /> 동네핫딜
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/hot-deals')}>더보기</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentHotDeals.map(deal => (
                  <div key={deal.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate(`/hot-deals/${deal.id}`)}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm flex-1 line-clamp-1">{deal.title}</h4>
                      <Badge className="bg-red-500 text-white ml-2">{deal.discount}%</Badge>
                    </div>
                    <div className="text-xs text-gray-500">📍 {deal.place}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 공동구매 */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="text-green-600" size={24} />
                    공동구매
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/group-purchase')}
                  >
                    더보기
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentGroupPurchase.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/group-purchase/${item.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm flex-1 line-clamp-1">{item.title}</h4>
                        <Badge variant={item.status === "마감" ? "secondary" : "default"} className="ml-2 text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">👥 {item.participants}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MainPage