import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calendar, 
  Users, 
  ArrowLeft, 
  Sparkles, 
  Gift, 
  ListChecks, 
  Bookmark, 
  CheckCheck,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 임시 더미 데이터
const policyData = {
  id: 1,
  title: "청년내일채움공제",
  category: "취업지원",
  description: "중소·중견기업 청년 근로자의 자산형성을 지원하는 제도입니다.",
  period: "2025.01.01 ~ 2025.12.31",
  target: "만 15~34세 청년",
  budget: "3,000억원",
  organization: "고용노동부",
  keywords: ["자산형성", "중소기업", "목돈마련", "장기근속", "청년지원"],
  
  detailDescription: `청년내일채움공제는 중소·중견기업에 취업한 청년들의 장기근속을 유도하고 목돈 마련을 지원하는 제도입니다. 
  청년이 2년 또는 3년간 근속하면서 일정금액을 적립하고, 정부와 기업이 추가로 지원금을 적립하여 만기 시 목돈을 수령할 수 있습니다.`,
  
  aiExplanation: `🤖 AI 설명: 이 정책은 쉽게 말해 '청년 적금'이에요! 
  여러분이 중소기업에서 2~3년 일하면서 매달 조금씩 저축하면, 정부와 회사가 추가로 돈을 더 넣어줘서 만기에 큰돈을 받을 수 있어요. 
  예를 들어, 2년형의 경우 본인이 300만원, 정부가 600만원, 기업이 300만원을 넣어서 총 1,200만원을 받을 수 있답니다!`,
  
  eligibility: [
    "만 15세 이상 34세 이하 청년 (군 복무기간 최대 6년 인정)",
    "고용보험 가입 이력이 없거나, 최종학교 졸업 후 고용보험 가입 이력이 12개월 이하인 미취업 청년",
    "정규직으로 채용된 청년",
    "중소·중견기업 근로자"
  ],
  
  benefits: [
    "2년형: 총 1,200만원 (본인 300만원 + 정부 600만원 + 기업 300만원)",
    "3년형: 총 3,000만원 (본인 600만원 + 정부 1,800만원 + 기업 600만원)",
    "중도해지 시에도 본인 적립금과 일부 지원금 수령 가능"
  ],
  
  documents: [
    "청년내일채움공제 가입신청서",
    "재직증명서",
    "주민등록등본",
    "통장 사본",
    "최종학력 증명서",
    "고용보험 가입내역 확인서"
  ],
  
  process: [
    { step: 1, title: "기업 선정", description: "중소·중견기업 취업" },
    { step: 2, title: "신청", description: "입사 후 6개월 이내 신청" },
    { step: 3, title: "적립", description: "매월 적립금 납부" },
    { step: 4, title: "수령", description: "2년 또는 3년 만기 시 수령" }
  ],
  
  contact: {
    phone: "1350",
    website: "www.work.go.kr/youngtomorrow",
    email: "support@work.go.kr"
  }
}

// 비슷한 정책 데이터
const similarPolicies = [
  {
    id: 2,
    title: "청년도약계좌",
    category: "금융지원",
    description: "청년의 중장기 자산형성을 지원하는 정책형 금융상품",
    target: "만 19~34세 청년"
  },
  {
    id: 4,
    title: "국민취업지원제도",
    category: "취업지원",
    description: "취업지원서비스와 생계지원을 결합한 한국형 실업부조",
    target: "구직자"
  },
  {
    id: 6,
    title: "청년 디지털 일자리",
    category: "취업지원",
    description: "디지털 분야 청년 일자리 매칭 및 교육 지원",
    target: "만 18~34세 청년"
  }
]

function PolicyDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [aiEnabled, setAiEnabled] = useState(false)
  const [checkedDocuments, setCheckedDocuments] = useState<number[]>([])
  const [bookmarked, setBookmarked] = useState(false)
  const [compareList, setCompareList] = useState<number[]>([])

  const handleCheckDocument = (index: number) => {
    if (checkedDocuments.includes(index)) {
      setCheckedDocuments(checkedDocuments.filter(i => i !== index))
    } else {
      setCheckedDocuments([...checkedDocuments, index])
    }
  }

  const handleCompareToggle = (policyId: number) => {
    if (compareList.includes(policyId)) {
      setCompareList(compareList.filter(id => id !== policyId))
    } else {
      setCompareList([...compareList, policyId])
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 뒤로가기 버튼 */}
          <div className="mb-6 text-left">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/policies')}
            >
              <ArrowLeft className="mr-2" size={18} />
              목록으로
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 메인 컬럼 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 헤더 - 제목 & 설명 & 북마크 */}
              <div className="text-left">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{policyData.category}</Badge>
                      <span className="text-sm text-gray-500">{policyData.organization}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                      {policyData.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {policyData.description}
                    </p>
                  </div>
                  {/* 북마크 아이콘 */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => setBookmarked(!bookmarked)}
                  >
                    <Bookmark 
                      size={24} 
                      className={bookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
                    />
                  </Button>
                </div>
                {/* 키워드 뱃지 */}
                <div className="flex flex-wrap gap-2">
                  {policyData.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-sm">
                      #{keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI 설명 */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-blue-600" size={24} />
                      <span className="font-semibold text-gray-900 text-lg">AI 쉬운 설명</span>
                    </div>
                    <Switch
                      checked={aiEnabled}
                      onCheckedChange={setAiEnabled}
                    />
                  </div>
                  {aiEnabled && (
                    <Alert className="bg-white border-blue-200">
                      <AlertDescription className="text-sm leading-relaxed">
                        {policyData.aiExplanation}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* 지원 혜택 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gift className="text-purple-600" size={24} />
                    <CardTitle className="text-xl">지원 혜택</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {policyData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <span className="text-purple-600 mt-1 font-bold">•</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* 신청 절차 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ListChecks className="text-green-600" size={24} />
                    <CardTitle className="text-xl">신청 절차</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {policyData.process.map((step, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 비슷한 정책 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">비슷한 정책</CardTitle>
                  <CardDescription>이 정책과 비슷한 다른 정책들을 확인해보세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {similarPolicies.map((policy) => (
                      <div 
                        key={policy.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 cursor-pointer" onClick={() => navigate(`/policies/${policy.id}`)}>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">{policy.category}</Badge>
                            <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{policy.description}</p>
                          <p className="text-xs text-gray-500">대상: {policy.target}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCompareToggle(policy.id)
                            }}
                          >
                            <CheckCheck size={16} className="mr-1" />
                            {compareList.includes(policy.id) ? '비교함' : '비교하기'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/policies/${policy.id}`)
                            }}
                          >
                            <ExternalLink size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {compareList.length > 0 && (
                    <Alert className="mt-4 bg-blue-50 border-blue-200">
                      <AlertDescription className="text-sm">
                        📋 비교함에 {compareList.length}개 정책이 담겼습니다.
                        <Button variant="link" className="ml-2 h-auto p-0 text-blue-600">
                          비교하기 →
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 사이드바 */}
            <div className="lg:col-span-1 space-y-4">
              {/* 신청 자격 & 대상 & 기간 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">신청 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 대상 */}
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                    <Users className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs font-semibold text-gray-500">신청 대상</p>
                      <p className="text-xs text-gray-900 font-medium">{policyData.target}</p>
                    </div>
                  </div>

                  {/* 기간 */}
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
                    <Calendar className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="text-xs font-semibold text-gray-500">신청 기간</p>
                      <p className="text-xs text-gray-900 font-medium">{policyData.period}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* 신청 자격 */}
                  <div>
                    <h3 className="font-semibold text-xs mb-2">신청 자격</h3>
                    <ul className="space-y-1.5">
                      {policyData.eligibility.map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-blue-600 mt-0.5 text-xs">✓</span>
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 신청하기 버튼 */}
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                신청하기
              </Button>

              {/* 제출 서류 체크리스트 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">제출 서류</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {checkedDocuments.length}/{policyData.documents.length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    준비된 서류를 체크하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {policyData.documents.map((doc, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleCheckDocument(index)}
                      >
                        <Checkbox
                          id={`doc-${index}`}
                          checked={checkedDocuments.includes(index)}
                          onCheckedChange={() => handleCheckDocument(index)}
                        />
                        <label
                          htmlFor={`doc-${index}`}
                          className={`flex-1 cursor-pointer text-xs ${
                            checkedDocuments.includes(index) 
                              ? 'line-through text-gray-400' 
                              : 'text-gray-700'
                          }`}
                        >
                          {doc}
                        </label>
                      </div>
                    ))}
                  </div>

                  {checkedDocuments.length === policyData.documents.length && (
                    <Alert className="mt-3 bg-green-50 border-green-200 py-2">
                      <AlertDescription className="text-xs text-green-700">
                        ✓ 모든 서류 준비 완료!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* 문의 정보 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">문의 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">전화</p>
                    <p className="text-sm font-semibold text-blue-600">{policyData.contact.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">웹사이트</p>
                    <a href={`https://${policyData.contact.website}`} className="text-xs font-semibold text-blue-600 hover:underline break-all">
                      {policyData.contact.website}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">이메일</p>
                    <a href={`mailto:${policyData.contact.email}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      {policyData.contact.email}
                    </a>
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