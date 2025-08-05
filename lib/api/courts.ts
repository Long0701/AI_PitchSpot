import { type Court, type SportType } from "@/lib/types"

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  total?: number
  error?: string
}

export interface CourtsResponse {
  id: string
  name: string
  address: string
  sport: SportType
  lat: number
  lng: number
  price: number
  rating: number
  reviewCount: number
  tags: string[]
  description: string
  city: string
  currency: string
  images: string[]
  features: {
    lighting: boolean
    parking: boolean
    restrooms: boolean
    equipment: boolean
  }
}

export interface CourtDetailResponse extends CourtsResponse {
  availability: Array<{
    date: string
    startTime: string
    endTime: string
    isAvailable: boolean
    price: number
  }>
  ownerId: string
}

export interface ReviewResponse {
  id: string
  courtId: string
  userId: string
  userName: string
  rating: number
  comment: string
  aspects: {
    cleanliness: number
    lighting: number
    equipment: number
    location: number
  }
  createdAt: string
  userAvatar?: string
}

export interface ReviewsResponse {
  data: ReviewResponse[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface SportResponse {
  id: string
  name: string
  icon: string
  color: string
  variants: string[]
}

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000/api"

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    return {
      success: false,
      data: null as T,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Courts API functions
export async function getCourts(params?: {
  search?: string
  sport?: SportType
}): Promise<ApiResponse<CourtsResponse[]>> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.append("search", params.search)
  if (params?.sport) searchParams.append("sport", params.sport)

  const queryString = searchParams.toString()
  const endpoint = `/courts${queryString ? `?${queryString}` : ""}`

  return apiCall<CourtsResponse[]>(endpoint)
}

export async function getCourtById(id: string): Promise<ApiResponse<CourtDetailResponse>> {
  return apiCall<CourtDetailResponse>(`/courts/${id}`)
}

export async function getCourtReviews(
  courtId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<ReviewsResponse>> {
  const endpoint = `/courts/${courtId}/reviews?page=${page}&pageSize=${pageSize}`
  return apiCall<ReviewsResponse>(endpoint)
}

export async function getSports(): Promise<ApiResponse<SportResponse[]>> {
  return apiCall<SportResponse[]>("/sports")
}

// Fallback to mock data if API fails
export async function getCourtsWithFallback(params?: {
  search?: string
  sport?: SportType
}): Promise<CourtsResponse[]> {
  const response = await getCourts(params)
  
  if (response.success && response.data) {
    return response.data
  }

  // Fallback to mock data
  console.warn("API failed, using mock data as fallback")
  const { courtsData } = await import("@/lib/data/courts")
  
  let filteredCourts = courtsData.map(court => ({
    id: court.id,
    name: court.name,
    address: court.location.address,
    sport: court.sportType,
    lat: court.location.lat,
    lng: court.location.lng,
    price: court.pricing.hourlyRate,
    rating: court.rating,
    reviewCount: court.reviewCount,
    tags: court.amenities,
    description: court.description,
    city: court.location.city,
    currency: court.pricing.currency,
    images: court.images,
    features: court.features,
  }))

  // Apply filters to mock data
  if (params?.search) {
    const searchLower = params.search.toLowerCase()
    filteredCourts = filteredCourts.filter(
      court =>
        court.name.toLowerCase().includes(searchLower) ||
        court.address.toLowerCase().includes(searchLower) ||
        court.city.toLowerCase().includes(searchLower)
    )
  }

  if (params?.sport) {
    filteredCourts = filteredCourts.filter(court => court.sport === params.sport)
  }

  return filteredCourts
}

export async function getCourtByIdWithFallback(id: string): Promise<CourtDetailResponse | null> {
  const response = await getCourtById(id)
  
  if (response.success && response.data) {
    return response.data
  }

  // Fallback to mock data
  console.warn("API failed, using mock data as fallback")
  const { courtsData } = await import("@/lib/data/courts")
  const court = courtsData.find(c => c.id === id)
  
  if (!court) return null

  return {
    id: court.id,
    name: court.name,
    address: court.location.address,
    sport: court.sportType,
    lat: court.location.lat,
    lng: court.location.lng,
    price: court.pricing.hourlyRate,
    rating: court.rating,
    reviewCount: court.reviewCount,
    tags: court.amenities,
    description: court.description,
    city: court.location.city,
    currency: court.pricing.currency,
    images: court.images,
    features: court.features,
    availability: court.availability,
    ownerId: court.ownerId,
  }
}

export async function getCourtReviewsWithFallback(
  courtId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<ReviewsResponse> {
  const response = await getCourtReviews(courtId, page, pageSize)
  
  if (response.success && response.data) {
    return response.data
  }

  // Fallback to mock data
  console.warn("API failed, using mock data as fallback")
  const { generateReviewsForCourt } = await import("@/lib/data/reviews")
  const { courtsData } = await import("@/lib/data/courts")
  
  const court = courtsData.find(c => c.id === courtId)
  if (!court) {
    return {
      data: [],
      pagination: {
        page,
        pageSize,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  const allReviews = generateReviewsForCourt(courtId, court.reviewCount)
  const totalReviews = allReviews.length
  const totalPages = Math.ceil(totalReviews / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedReviews = allReviews.slice(startIndex, endIndex)

  return {
    data: paginatedReviews.map(review => ({
      id: review.id,
      courtId: review.courtId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      aspects: review.aspects,
      createdAt: review.createdAt,
      userAvatar: review.userAvatar,
    })),
    pagination: {
      page,
      pageSize,
      total: totalReviews,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
} 