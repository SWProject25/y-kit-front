import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Utensils, 
  Briefcase, 
  Dumbbell, 
  Coffee, 
  Search,
  MapPin,
  Star,
  Navigation,
  X
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// 임시 더미 데이터
const places = [
  {
    id: 1,
    name: "착한 김밥천국",
    category: "음식",
    description: "1,500원부터 시작하는 가성비 김밥 맛집",
    price: "1,500원~",
    rating: 4.5,
    address: "서울시 강남구 역삼동 123-45",
    lat: 37.5665,
    lng: 126.9780,
    tags: ["김밥", "분식", "저렴"],
    image: "🍱"
  },
  {
    id: 2,
    name: "청년 코워킹스페이스",
    category: "사무실",
    description: "시간당 2,000원 공유 오피스",
    price: "2,000원/시간",
    rating: 4.8,
    address: "서울시 강남구 역삼동 456-78",
    lat: 37.5675,
    lng: 126.9790,
    tags: ["코워킹", "스터디", "와이파이"],
    image: "💼"
  },
  {
    id: 3,
    name: "시민 체육센터",
    category: "운동",
    description: "월 3만원 헬스장 + 수영장",
    price: "30,000원/월",
    rating: 4.3,
    address: "서울시 강남구 역삼동 789-12",
    lat: 37.5655,
    lng: 126.9770,
    tags: ["헬스", "수영", "공공시설"],
    image: "🏋️"
  },
  {
    id: 4,
    name: "북카페 온더북",
    category: "문화",
    description: "음료 하나면 하루종일 독서 가능",
    price: "3,000원~",
    rating: 4.6,
    address: "서울시 강남구 역삼동 234-56",
    lat: 37.5685,
    lng: 126.9800,
    tags: ["카페", "독서", "조용"],
    image: "☕"
  },
  {
    id: 5,
    name: "맛있는 고기집",
    category: "음식",
    description: "1인분 9,900원 삼겹살",
    price: "9,900원~",
    rating: 4.4,
    address: "서울시 강남구 역삼동 567-89",
    lat: 37.5645,
    lng: 126.9760,
    tags: ["고기", "삼겹살", "저렴"],
    image: "🥩"
  }
]

const categories = [
  { name: "전체", icon: MapPin, color: "bg-gray-500" },
  { name: "음식", icon: Utensils, color: "bg-red-500" },
  { name: "사무실", icon: Briefcase, color: "bg-blue-500" },
  { name: "운동", icon: Dumbbell, color: "bg-green-500" },
  { name: "문화", icon: Coffee, color: "bg-purple-500" }
]

function AffordableMapPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedPlace, setSelectedPlace] = useState<typeof places[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 })

  // 필터링된 장소
  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === "전체" || place.category === selectedCategory
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log("위치 정보를 가져올 수 없습니다:", error)
        }
      )
    }
  }, [])

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.icon || MapPin
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || "bg-gray-500"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 페이지 타이틀 */}
          <div className="mb-6 text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              알뜰지도
            </h1>
            <p className="text-gray-600">
              주변의 가성비 좋은 장소를 찾아보세요
            </p>
          </div>

          {/* 검색바 */}
        
          {/* 카테고리 필터 */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center gap-2 whitespace-nowrap"
                  size="sm"
                >
                  <Icon size={16} />
                  {category.name}
                </Button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 지도 영역 (임시 - 실제로는 카카오맵 API 사용) */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  {/* 임시 지도 플레이스홀더 */}
                  <div className="relative w-full h-full bg-blue-100">
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
                      <Navigation size={20} className="text-blue-600" />
                      <span className="text-sm font-semibold">현재 위치</span>
                    </div>
                    
                    {/* 마커들 표시 */}
                    {filteredPlaces.map((place, index) => {
                      const Icon = getCategoryIcon(place.category)
                      return (
                        <div
                          key={place.id}
                          className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                          style={{
                            top: `${30 + index * 15}%`,
                            left: `${40 + index * 10}%`
                          }}
                          onClick={() => setSelectedPlace(place)}
                        >
                          <div className={`${getCategoryColor(place.category)} text-white rounded-full p-3 shadow-lg border-4 border-white`}>
                            <Icon size={24} />
                          </div>
                          <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs font-semibold">
                            {place.name}
                          </div>
                        </div>
                      )
                    })}

                    {/* 현재 위치 마커 */}
                    <div
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                      style={{ top: '50%', left: '50%' }}
                    >
                      <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg border-4 border-white animate-pulse">
                        <Navigation size={20} />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm">
                      💡 실제 서비스에서는 카카오맵 API가 표시됩니다
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 장소 리스트 */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-white z-10 border-b">
                  <CardTitle className="text-lg">
                    가까운 장소 ({filteredPlaces.length})
                  </CardTitle>
                  <div className="mb-6">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="장소 검색..."
                        className="pl-10 w-full bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredPlaces.map((place) => {
                    const Icon = getCategoryIcon(place.category)
                    return (
                      <div
                        key={place.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedPlace?.id === place.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                        }`}
                        onClick={() => setSelectedPlace(place)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${getCategoryColor(place.category)} text-white rounded-lg p-2 flex-shrink-0`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
                              <Badge variant="secondary" className="text-xs">{place.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="font-semibold text-blue-600">{place.price}</span>
                              <span className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                {place.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {filteredPlaces.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      검색 결과가 없습니다
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 선택된 장소 상세 정보 모달 */}
          {selectedPlace && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white shadow-2xl rounded-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-4xl">{selectedPlace.image}</span>
                        <Badge>{selectedPlace.category}</Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2">{selectedPlace.name}</CardTitle>
                      <CardDescription className="text-base">{selectedPlace.description}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPlace(null)}
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">가격</p>
                      <p className="font-semibold text-lg text-blue-600">{selectedPlace.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">평점</p>
                      <div className="flex items-center gap-1">
                        <Star size={20} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-lg">{selectedPlace.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">주소</p>
                    <p className="text-gray-700">{selectedPlace.address}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">태그</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.tags.map((tag) => (
                        <Badge key={tag} variant="outline">#{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">길찾기</Button>
                    <Button variant="outline" className="flex-1">저장</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AffordableMapPage