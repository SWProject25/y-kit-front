import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  MapPin, 
  FileText, 
  ExternalLink,
  Bookmark,
  Share2,
  Eye,
  Sparkles,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { policyAPI } from '@/api/client'
import type { PolicyDetailResponse } from '@/types/api'
import { COLORS } from '@/data/color'

function PolicyDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [policy, setPolicy] = useState<PolicyDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [checkedDocuments, setCheckedDocuments] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (id) {
      fetchPolicyDetail(parseInt(id))
    }
  }, [id])

  const fetchPolicyDetail = async (policyId: number) => {
    setLoading(true)
    setError(null)

    const { data, error: apiError } = await policyAPI.getPolicyDetail(policyId)

    if (apiError) {
      setError(apiError)
      setLoading(false)
      return
    }

    if (data) {
      setPolicy(data)
    }
    setLoading(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: policy?.detail.policyName,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다!')
    }
  }

  const toggleDocument = (index: number) => {
    setCheckedDocuments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-lg" style={{ color: COLORS.navy }}>로딩중...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !policy) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center">
            <p className="text-red-500 mb-4">정책을 불러올 수 없습니다.</p>
            <Button 
              onClick={() => navigate('/policies')}
              style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
            >
              목록으로
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 제출 서류 파싱 (예시)
  const documents = [
    "신분증 사본",
    "주민등록등본",
    "소득증명서류",
    "재학증명서 또는 졸업증명서",
    "사업자등록증 (해당시)",
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F9FAFB' }}>
      <Header />
      
      <main className="flex-1 w-full pt-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 뒤로가기 */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/policies')}
            className="mb-6 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2" size={18} />
            목록으로
          </Button>

          {/* 헤더 카드 & AI 분석 2열 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 헤더 카드 (왼쪽 2/3) */}
            <Card className="lg:col-span-2 rounded-xl" style={{ borderColor: COLORS.skyBorder }}>
              <CardHeader className="pb-4">
                {/* 상단: 카테고리 & 공유/북마크 버튼 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    {policy.categories.map((cat) => (
                      <Badge 
                        key={cat.categoryId} 
                        style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                      >
                        {cat.categoryName}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? 'bg-yellow-50 border-yellow-400' : ''}
                    >
                      <Bookmark size={16} className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''} />
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                    >
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* 정책명 */}
                <CardTitle className="text-3xl md:text-4xl mb-3 leading-tight" style={{ color: COLORS.navy }}>
                  {policy.detail.policyName}
                </CardTitle>

                {/* 키워드 & 적용지역 */}
                <div className="space-y-2 mb-3">
                  {/* 키워드 */}
                  {policy.keywords && policy.keywords.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-500 min-w-[70px] pt-1">키워드</span>
                      <div className="flex flex-wrap gap-2">
                        {policy.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-gray-100">
                            #{keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 적용지역 */}
                  {policy.regions && policy.regions.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-500 min-w-[70px] pt-1">적용지역</span>
                      <div className="flex flex-wrap gap-2">
                        {policy.regions.slice(0, 3).map((region) => (
                          <Badge key={region.regionCode} variant="outline">
                            <MapPin size={12} className="mr-1" />
                            {region.regionName}
                          </Badge>
                        ))}
                        {policy.regions.length > 3 && (
                          <Badge 
                            variant="outline" 
                            className="cursor-help"
                            title={policy.regions.slice(3).map(r => r.regionName).join(', ')}
                          >
                            외 {policy.regions.length - 3}개 지역
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 통계 */}
                <div className="flex items-center gap-6 text-sm text-gray-500 pb-4 border-b">
                  <span className="flex items-center gap-1.5">
                    <Eye size={16} />
                    <span className="font-medium">{policy.basicInfo.viewCount.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bookmark size={16} />
                    <span className="font-medium">{policy.basicInfo.bookmarkCount.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText size={16} />
                    <span className="font-medium">{policy.basicInfo.applicationCount.toLocaleString()}</span>
                  </span>
                </div>

                {/* 신청 버튼 */}
                {policy.application.applicationUrl && (
                  <div className="pt-4">
                    <Button 
                      className="w-full"
                      size="lg"
                      style={{ backgroundColor: COLORS.navy, color: COLORS.white }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = COLORS.navyHover)}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = COLORS.navy)}
                      onClick={() => window.open(policy.application.applicationUrl, '_blank')}
                    >
                      <ExternalLink className="mr-2" size={18} />
                      신청하기
                    </Button>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* AI 분석 */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2" style={{ color: COLORS.navy }}>
                  <Sparkles size={22} />
                  AI 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {policy.aiAnalysis ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        요약
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{policy.aiAnalysis.summary}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        장점
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{policy.aiAnalysis.pros}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        유의사항
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{policy.aiAnalysis.corn}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Sparkles size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-sm">AI 분석 정보가 준비 중입니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 2열 레이아웃 시작 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 메인 컬럼 (2/3) - 탭으로 변경 */}
            <div className="lg:col-span-2">
              <Card className="rounded-xl shadow-sm">
                <Tabs defaultValue="detail" className="w-full">
                  <CardHeader className="pb-2">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="detail">정책 상세</TabsTrigger>
                      <TabsTrigger value="qualification">자격 요건 및 신청 정보</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    {/* 정책 상세 탭 */}
                    <TabsContent value="detail" className="space-y-6 mt-0">
                      {/* 정책 설명 */}
                      <div>
                        <h3 className="font-semibold text-base mb-2" style={{ color: COLORS.navy }}>정책 설명</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{policy.detail.description}</p>
                      </div>

                      <Separator />

                      {/* 지원 내용 */}
                      <div> ㄴ
                        <h3 className="font-semibold text-base mb-2" style={{ color: COLORS.navy }}>지원 내용</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{policy.detail.supportContent}</p>
                      </div>

                      <Separator />

                      {/* 기관 & 사업 정보 */}
                      <div>
                        <h3 className="font-semibold text-base mb-3" style={{ color: COLORS.navy }}>기관 및 사업 정보</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">주관 기관</h4>
                            <p className="text-gray-900 text-sm">{policy.detail.supervisingInstitution}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">운영 기관</h4>
                            <p className="text-gray-900 text-sm">{policy.detail.operatingInstitution || '-'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">사업 기간</h4>
                            <p className="text-gray-900 text-sm">
                              {policy.detail.businessStartDate}<br />~ {policy.detail.businessEndDate}
                            </p>
                          </div>
                          {policy.detail.supportScale && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">지원 규모</h4>
                              <p className="text-gray-900 text-sm">{policy.detail.supportScale}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 참고 링크 */}
                      {(policy.detail.referenceUrl1 || policy.detail.referenceUrl2) && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="font-semibold text-base mb-2" style={{ color: COLORS.navy }}>참고 링크</h3>
                            <div className="space-y-2">
                              {policy.detail.referenceUrl1 && (
                                <a 
                                  href={policy.detail.referenceUrl1} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm hover:underline p-2 rounded hover:bg-gray-50 transition-colors"
                                  style={{ color: COLORS.accent }}
                                >
                                  <ExternalLink size={16} />
                                  참고 링크 1
                                </a>
                              )}
                              {policy.detail.referenceUrl2 && (
                                <a 
                                  href={policy.detail.referenceUrl2} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm hover:underline p-2 rounded hover:bg-gray-50 transition-colors"
                                  style={{ color: COLORS.accent }}
                                >
                                  <ExternalLink size={16} />
                                  참고 링크 2
                                </a>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    {/* 자격 요건 및 신청 정보 탭 */}
                    <TabsContent value="qualification" className="space-y-6 mt-0">
                      {/* 자격 요건 */}
                      <div>
                        <h3 className="font-semibold text-base mb-3" style={{ color: COLORS.navy }}>자격 요건</h3>
                        <div className="space-y-3">
                          {policy.qualification.ageLimitYn === 'Y' && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">연령</h4>
                              <p className="text-sm text-gray-900">
                                만 {policy.qualification.minAge}~{policy.qualification.maxAge}세
                              </p>
                            </div>
                          )}
                          {policy.qualification.employmentStatus && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">취업 상태</h4>
                              <p className="text-sm text-gray-900">{policy.qualification.employmentStatus}</p>
                            </div>
                          )}
                          {policy.qualification.educationLevel && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">학력</h4>
                              <p className="text-sm text-gray-900">{policy.qualification.educationLevel}</p>
                            </div>
                          )}
                          {policy.qualification.additionalQualification && (
                            <div className="pt-2 border-t">
                              <h4 className="text-sm font-medium text-gray-500 mb-2">추가 자격 조건</h4>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {policy.qualification.additionalQualification}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* 신청 정보 */}
                      <div>
                        <h3 className="font-semibold text-base mb-3" style={{ color: COLORS.navy }}>신청 정보</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">신청 기간</h4>
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {policy.application.applicationStartDate}<br />
                              ~ {policy.application.applicationEndDate}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">신청 방법</h4>
                            <p className="text-sm text-gray-900">{policy.application.applicationMethod || '-'}</p>
                          </div>
                          {policy.detail.screeningMethod && (
                            <div className="pt-2 border-t">
                              <h4 className="text-sm font-medium text-gray-500 mb-2">심사 방법</h4>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {policy.detail.screeningMethod}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>

            {/* 오른쪽 사이드바 (1/3) */}
            <div className="space-y-6">
              {/* 제출 서류 체크리스트 */}
              <Card className="rounded-xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: COLORS.navy }}>
                    <FileText size={20} />
                    제출 서류
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleDocument(idx)}
                      >
                        {checkedDocuments.has(idx) ? (
                          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle size={18} className="text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${checkedDocuments.has(idx) ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {doc}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-start gap-2">
                    <AlertCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                      클릭하여 준비 상태를 체크하세요
                    </p>
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

export default PolicyDetailsPage