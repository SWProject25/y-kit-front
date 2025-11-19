// ===== 공통 타입 =====
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

/**
 * 페이징 응답
 */
export interface PageResponse<T> {
  content: T[]
  page: number          // 현재 페이지 (0부터 시작)
  size: number          // 페이지 크기
  totalElements: number // 전체 데이터 수
  totalPages: number    // 전체 페이지 수
  last: boolean         // 마지막 페이지 여부
  first: boolean        // 첫 페이지 여부
}


// ===== 정책 (Policy) =====
export interface PolicyListResponse {
  policyId: number;
  policyNo: string;
  policyName: string;
  summary: string;
  largeCategory: string;
  mediumCategory: string;
  isApplicationAvailable: boolean;
  applicationStartDate: string;
  applicationEndDate: string;
  supervisingInstitution: string;
  minAge: number;
  maxAge: number;
  keywords: string[];
  regions: string[];
  viewCount: number;
  bookmarkCount: number;
  applicationCount: number;
  createdAt: string;
}

export interface PolicyDetailResponse {
  basicInfo: {
    policyId: number;
    policyNo: string;
    isActive: boolean;
    viewCount: number;
    bookmarkCount: number;
    applicationCount: number;
    createdAt: string;
    updatedAt: string;
  };
  detail: {
    policyName: string;
    description: string;
    supervisingInstitution: string;
    operatingInstitution: string;
    approvalStatus: string;
    provisionMethod: string;
    supportContent: string;
    supportScale: string;
    participationTarget: string;
    screeningMethod: string;
    businessPeriodType: string;
    businessStartDate: string;
    businessEndDate: string;
    businessPeriodEtc: string;
    etcMatters: string;
    referenceUrl1: string;
    referenceUrl2: string;
  };
  application: {
    supportScaleLimit: string;
    firstComeFirstServed: string;
    applicationPeriodType: string;
    applicationStartDate: string;
    applicationEndDate: string;
    applicationMethod: string;
    applicationUrl: string;
  };
  qualification: {
    ageLimitYn: string;
    minAge: number;
    maxAge: number;
    incomeConditionType: string;
    minIncome: number;
    maxIncome: number;
    incomeEtc: string;
    maritalStatus: string;
    educationLevel: string;
    employmentStatus: string;
    majorField: string;
    specializedRequirement: string;
    additionalQualification: string;
  };
  document: {
    documentsOriginal: string;
    documentsParsed: string[];
  };
  categories: Array<{
    categoryId: number;
    categoryName: string;
    level: number;
  }>;
  keywords: string[];
  regions: Array<{
    regionCode: string;
    regionName: string;
  }>;
  aiAnalysis: {
    summary: string;
    pros: string;
    corn: string;
    generatedAt: string;
  };
}

export interface PolicySearchRequest {
  keyword?: string;
  categoryId?: number;
  regionCode?: string;
  age?: number;
  isApplicationAvailable?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// ===== 핫딜 관련 타입 =====
export interface HotDeal {
  id: number;
  title: string;
  content: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  link?: string;
  imageUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  authorId: number;
  authorName?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HotDealListResponse {
  id: number;
  title: string;
  price?: number;
  discount?: number;
  imageUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  authorName?: string;
  createdAt: string;
}

export interface HotDealDetailResponse extends HotDeal {
  comments: HotDealComment[];
}

export interface HotDealCreateRequest {
  title: string;
  content: string;
  price?: number;
  originalPrice?: number;
  link?: string;
  imageUrl?: string;
}

export interface HotDealUpdateRequest {
  title?: string;
  content?: string;
  price?: number;
  originalPrice?: number;
  link?: string;
  imageUrl?: string;
}

export interface HotDealComment {
  id: number;
  content: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
}

export interface HotDealCommentCreateRequest {
  content: string;
}

// ===== 공동구매 관련 타입 =====
export type GroupPurchaseStatus = 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface GroupPurchase {
  id: number;
  title: string;
  content: string;
  status: GroupPurchaseStatus;
  targetQuantity: number;      // 목표 수량
  currentQuantity: number;      // 현재 참여 수량
  price: number;
  regionCode: string;           // 지역 코드
  regionName?: string;
  deadline: string;             // 마감일
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  participantCount: number;     // 참여자 수
  authorId: number;
  authorName?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isParticipating: boolean;     // 내가 참여 중인지
  createdAt: string;
  updatedAt?: string;
}

export interface GroupPurchaseListResponse {
  id: number;
  title: string;
  status: GroupPurchaseStatus;
  targetQuantity: number;
  currentQuantity: number;
  price: number;
  regionName?: string;
  deadline: string;
  participantCount: number;
  likeCount: number;
  commentCount: number;
  authorName?: string;
  createdAt: string;
}

export interface GroupPurchaseDetailResponse extends GroupPurchase {
  comments: GroupPurchaseComment[];
}

export interface GroupPurchaseCreateRequest {
  title: string;
  content: string;
  targetQuantity: number;
  price: number;
  regionCode: string;
  deadline: string;
}

export interface GroupPurchaseUpdateRequest {
  title?: string;
  content?: string;
  targetQuantity?: number;
  price?: number;
  regionCode?: string;
  deadline?: string;
}

export interface GroupPurchaseComment {
  id: number;
  content: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
}

export interface GroupPurchaseCommentCreateRequest {
  content: string;
}

// ===== 커뮤니티 관련 타입 =====
export type CommunityCategory = 'FREE' | 'QUESTION' | 'TIP' | 'REVIEW' | 'NEWS';

export interface Community {
  id: number;
  title: string;
  content: string;
  category: CommunityCategory;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  authorId: number;
  authorName?: string;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityListResponse {
  id: number;
  title: string;
  category: CommunityCategory;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  authorName?: string;
  createdAt: string;
}

export interface CommunityDetailResponse extends Community {
  comments: CommunityComment[];
}

export interface CommunityCreateRequest {
  title: string;
  content: string;
  category: CommunityCategory;
}

export interface CommunityUpdateRequest {
  title?: string;
  content?: string;
  category?: CommunityCategory;
}

export interface CommunityComment {
  id: number;
  content: string;
  authorId: number;
  authorName?: string;
  createdAt: string;
}

export interface CommentCreateRequest {
  content: string;
}

// ===== 뱃지 관련 타입 =====
export interface Badge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
  condition?: string;
}

export interface BadgeResponse {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface UserBadge {
  id: number;
  badgeId: number;
  badge: Badge;
  earnedAt: string;
}

export interface UserBadgeResponse {
  id: number;
  badgeId: number;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  earnedAt: string;
}

// ===== 사용자 관련 타입 =====
export interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
  gender?: 'MAN' | 'WOMAN';
  region?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LocalSignUpRequest {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: 'MAN' | 'WOMAN';
  region?: string;
}

export interface DeviceTokenRequest {
  deviceName: string;
  deviceToken: string;
}