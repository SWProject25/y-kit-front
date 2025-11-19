import type {
  ApiResponse,
  PageResponse,
  // HotDeal
  HotDealListResponse,
  HotDealDetailResponse,
  HotDealCreateRequest,
  HotDealUpdateRequest,
  HotDealCommentCreateRequest,
  // GroupPurchase
  GroupPurchaseStatus,
  GroupPurchaseListResponse,
  GroupPurchaseDetailResponse,
  GroupPurchaseCreateRequest,
  GroupPurchaseUpdateRequest,
  GroupPurchaseCommentCreateRequest,
  // Community
  CommunityCategory,
  CommunityListResponse,
  CommunityDetailResponse,
  CommunityCreateRequest,
  CommunityUpdateRequest,
  CommentCreateRequest,
  // Badge
  BadgeResponse,
  UserBadgeResponse,
  // User
  LocalSignUpRequest,
  DeviceTokenRequest,
  LoginRequest,
  // Policy
  PolicyListResponse,
  PolicyDetailResponse,
  PolicySearchRequest,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ===== RequestOptions 타입 정의 =====
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// ===== ApiClient 클래스 =====
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // JWT 토큰을 헤더에 추가
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // API 요청 핵심 메서드
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        credentials: 'include', // ⭐ CORS credentials 추가
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      // 401 에러: 인증 실패
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_id');
        window.location.reload();
        return { error: 'Authentication required' };
      }

      // HTTP 에러 처리
      if (!response.ok) {
        const errorText = await response.text();
        return { error: `HTTP ${response.status}: ${errorText || response.statusText}` };
      }

      // 204 No Content 처리
      if (response.status === 204) {
        return { data: undefined as T };
      }

      // 응답 파싱
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      return { data };
    } catch (error) {
      console.error('API Request Error:', error); // ⭐ 에러 로깅 추가
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// ===== 헬퍼 함수 =====
const get = <T = any>(endpoint: string, params?: Record<string, any>) => {
  if (!params) {
    return apiClient.get<T>(endpoint);
  }
  // null, undefined 제거
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
  
  const queryString = new URLSearchParams(cleanParams).toString();
  return apiClient.get<T>(`${endpoint}${queryString ? '?' + queryString : ''}`);
};

const post = <T = any>(endpoint: string, data?: any) =>
  apiClient.post<T>(endpoint, data);

const put = <T = any>(endpoint: string, data?: any) =>
  apiClient.put<T>(endpoint, data);

const del = <T = any>(endpoint: string) => apiClient.delete<T>(endpoint);

// ===== 핫딜 API =====
export const hotDealAPI = {
  // 핫딜 생성
  createHotDeal: (request: HotDealCreateRequest): Promise<ApiResponse<number>> =>
    post<number>('/api/v1/hotDeals', request),

  // 핫딜 상세 조회
  getHotDeal: (hotDealId: number): Promise<ApiResponse<HotDealDetailResponse>> =>
    apiClient.get<HotDealDetailResponse>(`/api/v1/hotDeals/${hotDealId}`),

  // 핫딜 목록 조회 (검색 포함)
  getHotDeals: (params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<HotDealListResponse>>> =>
    get<PageResponse<HotDealListResponse>>('/api/v1/hotDeals', params),

  // 핫딜 수정
  updateHotDeal: (id: number, request: HotDealUpdateRequest): Promise<ApiResponse<void>> =>
    put<void>(`/api/v1/hotDeals/${id}`, request),

  // 핫딜 삭제
  deleteHotDeal: (id: number): Promise<ApiResponse<void>> =>
    del<void>(`/api/v1/hotDeals/${id}`),

  // 좋아요 토글
  toggleLike: (id: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/hotDeals/${id}/like`),

  // 북마크 토글
  toggleBookmark: (id: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/hotDeals/${id}/bookmark`),

  // 댓글 작성
  createComment: (id: number, request: HotDealCommentCreateRequest): Promise<ApiResponse<number>> =>
    post<number>(`/api/v1/hotDeals/${id}/comments`, request),

  // 댓글 삭제
  deleteComment: (commentId: number): Promise<ApiResponse<void>> =>
    del<void>(`/api/v1/hotDeals/comments/${commentId}`),
};

// ===== 공동구매 API =====
export const groupPurchaseAPI = {
  // 공동구매 생성
  createGroupPurchase: (request: GroupPurchaseCreateRequest): Promise<ApiResponse<number>> =>
    post<number>('/api/v1/group-purchases', request),

  // 공동구매 상세 조회
  getGroupPurchase: (id: number): Promise<ApiResponse<GroupPurchaseDetailResponse>> =>
    apiClient.get<GroupPurchaseDetailResponse>(`/api/v1/group-purchases/${id}`),

  // 공동구매 목록 조회 (필터링)
  getGroupPurchases: (params?: {
    status?: GroupPurchaseStatus;
    regionCode?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<GroupPurchaseListResponse>>> =>
    get<PageResponse<GroupPurchaseListResponse>>('/api/v1/group-purchases', params),

  // 공동구매 검색
  searchGroupPurchases: (params: {
    keyword: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<GroupPurchaseListResponse>>> =>
    get<PageResponse<GroupPurchaseListResponse>>('/api/v1/group-purchases/search', params),

  // 공동구매 수정
  updateGroupPurchase: (id: number, request: GroupPurchaseUpdateRequest): Promise<ApiResponse<void>> =>
    put<void>(`/api/v1/group-purchases/${id}`, request),

  // 공동구매 삭제
  deleteGroupPurchase: (id: number): Promise<ApiResponse<void>> =>
    del<void>(`/api/v1/group-purchases/${id}`),

  // 좋아요 토글
  toggleLike: (id: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/group-purchases/${id}/like`),

  // 북마크 토글
  toggleBookmark: (id: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/group-purchases/${id}/bookmark`),

  // 댓글 작성
  createComment: (id: number, request: GroupPurchaseCommentCreateRequest): Promise<ApiResponse<number>> =>
    post<number>(`/api/v1/group-purchases/${id}/comments`, request),

  // 댓글 삭제
  deleteComment: (commentId: number): Promise<ApiResponse<void>> =>
    del<void>(`/api/v1/group-purchases/comments/${commentId}`),

  // 공동구매 참여
  joinGroupPurchase: (id: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/group-purchases/${id}/join`),

  // 내가 생성한 공동구매 목록
  getMyGroupPurchases: (params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<GroupPurchaseListResponse>>> =>
    get<PageResponse<GroupPurchaseListResponse>>('/api/v1/group-purchases/my-purchases', params),
};

// ===== 커뮤니티 API =====
export const communityAPI = {
  // 게시글 목록 조회
  getCommunityList: (params?: {
    category?: CommunityCategory;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<CommunityListResponse>>> =>
    get<PageResponse<CommunityListResponse>>('/api/v1/community', params),

  // 게시글 상세 조회
  getCommunityDetail: (communityId: number): Promise<ApiResponse<CommunityDetailResponse>> =>
    apiClient.get<CommunityDetailResponse>(`/api/v1/community/${communityId}`),

  // 게시글 작성
  createCommunity: (request: CommunityCreateRequest): Promise<ApiResponse<number>> =>
    post<number>('/api/v1/community', request),

  // 게시글 검색
  searchCommunities: (params: {
    keyword: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<CommunityListResponse>>> =>
    get<PageResponse<CommunityListResponse>>('/api/v1/community/search', params),

  // 게시글 수정
  updateCommunity: (communityId: number, request: CommunityUpdateRequest): Promise<ApiResponse<void>> =>
    put<void>(`/api/v1/community/${communityId}`, request),

  // 게시글 삭제
  deleteCommunity: (communityId: number): Promise<ApiResponse<void>> =>
    del<void>(`/api/v1/community/${communityId}`),

  // 좋아요 토글
  toggleLike: (communityId: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/community/${communityId}/like`),

  // 북마크 토글
  toggleBookmark: (communityId: number): Promise<ApiResponse<void>> =>
    post<void>(`/api/v1/community/${communityId}/bookmark`),

  // 댓글 작성
  createComment: (communityId: number, request: CommentCreateRequest): Promise<ApiResponse<number>> =>
    post<number>(`/api/v1/community/${communityId}/comments`, request),

  // 댓글 삭제
  deleteComment: (commentId: number): Promise<ApiResponse<void>> =>
    del<void>(`/api/v1/community/comments/${commentId}`),

  // 내가 작성한 게시글
  getMyPosts: (params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<CommunityListResponse>>> =>
    get<PageResponse<CommunityListResponse>>('/api/v1/community/my-posts', params),

  // 내가 북마크한 게시글
  getMyBookmarks: (): Promise<ApiResponse<CommunityListResponse[]>> =>
    apiClient.get<CommunityListResponse[]>('/api/v1/community/my-bookmarks'),
};

// ===== 뱃지 API =====
export const badgeAPI = {
  // 모든 뱃지 조회
  getAllBadges: (): Promise<ApiResponse<BadgeResponse[]>> =>
    apiClient.get<BadgeResponse[]>('/api/v1/badges'),

  // 뱃지 상세 조회
  getBadge: (badgeId: number): Promise<ApiResponse<BadgeResponse>> =>
    apiClient.get<BadgeResponse>(`/api/v1/badges/${badgeId}`),

  // 내 뱃지 조회
  getMyBadges: (): Promise<ApiResponse<UserBadgeResponse[]>> =>
    apiClient.get<UserBadgeResponse[]>('/api/v1/badges/my'),

  // 특정 사용자의 뱃지 조회
  getUserBadges: (userId: number): Promise<ApiResponse<UserBadgeResponse[]>> =>
    apiClient.get<UserBadgeResponse[]>(`/api/v1/badges/users/${userId}`),
};

// ===== 사용자 API =====
export const userAPI = {
  // 로컬 회원가입
  signUp: (request: LocalSignUpRequest): Promise<ApiResponse<void>> =>
    post<void>('/api/v1/user/sign-up', request),

  // 로컬 로그인
  login: (request: LoginRequest): Promise<ApiResponse<{ token: string }>> =>
    post<{ token: string }>('/api/v1/user/login', request),

  // FCM 디바이스 토큰 등록
  registerDeviceToken: (request: DeviceTokenRequest): Promise<ApiResponse<void>> =>
    post<void>('/api/v1/user/device/register', request),

  // FCM 디바이스 토큰 비활성화
  deactivateDeviceToken: (request: DeviceTokenRequest): Promise<ApiResponse<void>> =>
    post<void>('/api/v1/user/device/deactivate', request),
};

// ===== 정책 API =====
export const policyAPI = {
  getPolicies: (params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<ApiResponse<PageResponse<PolicyListResponse>>> => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.size !== undefined) queryParams.append("size", params.size.toString());
  if (params?.sort !== undefined) queryParams.append("sort", params.sort);

  return get<PageResponse<PolicyListResponse>>(`/api/v1/policies?${queryParams.toString()}`);
},


  // 정책 상세 조회 (ID)
  getPolicyDetail: (policyId: number): Promise<ApiResponse<PolicyDetailResponse>> =>
    get<PolicyDetailResponse>(`/api/v1/policies/${policyId}`),

  // 정책 상세 조회 (정책번호)
  getPolicyDetailByNo: (policyNo: string): Promise<ApiResponse<PolicyDetailResponse>> =>
    get<PolicyDetailResponse>(`/api/v1/policies/policyNo/${policyNo}`),

  // 추천 정책 조회
  getRecommendedPolicies: (params?: {
    age?: number;
    regionCode?: string;
    categoryId?: number;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<PolicyListResponse>>> => {
    const queryParams = new URLSearchParams();
    if (params?.age) queryParams.append('age', params.age.toString());
    if (params?.regionCode) queryParams.append('regionCode', params.regionCode);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    
    return get<PageResponse<PolicyListResponse>>(`/api/v1/policies/recommended?${queryParams.toString()}`);
  },

  // 인기 정책 조회
  getPopularPolicies: (params?: {
    sortBy?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<PolicyListResponse>>> => {
    const queryParams = new URLSearchParams();
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    
    return get<PageResponse<PolicyListResponse>>(`/api/v1/policies/popular?${queryParams.toString()}`);
  },

  // 마감 임박 정책 조회
  getDeadlineSoonPolicies: (params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<PolicyListResponse>>> => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    
    return get<PageResponse<PolicyListResponse>>(`/api/v1/policies/deadline?${queryParams.toString()}`);
  },
};