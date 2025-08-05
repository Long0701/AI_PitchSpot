import { useState, useEffect, useCallback } from "react"
import { type SportType } from "@/lib/types"
import {
  getCourtsWithFallback,
  getCourtByIdWithFallback,
  getCourtReviewsWithFallback,
  type CourtsResponse,
  type CourtDetailResponse,
  type ReviewsResponse,
} from "@/lib/api/courts"

// Hook for fetching courts with search and filter
export function useCourts(params?: { search?: string; sport?: SportType }) {
  const [courts, setCourts] = useState<CourtsResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCourtsWithFallback(params)
      setCourts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch courts")
      console.error("Error fetching courts:", err)
    } finally {
      setLoading(false)
    }
  }, [params?.search, params?.sport])

  useEffect(() => {
    fetchCourts()
  }, [fetchCourts])

  const refetch = useCallback(() => {
    fetchCourts()
  }, [fetchCourts])

  return {
    courts,
    loading,
    error,
    refetch,
  }
}

// Hook for fetching a single court by ID
export function useCourtDetail(id: string) {
  const [court, setCourt] = useState<CourtDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourt = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await getCourtByIdWithFallback(id)
      setCourt(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch court details")
      console.error("Error fetching court details:", err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCourt()
  }, [fetchCourt])

  const refetch = useCallback(() => {
    fetchCourt()
  }, [fetchCourt])

  return {
    court,
    loading,
    error,
    refetch,
  }
}

// Hook for fetching court reviews with pagination
export function useCourtReviews(
  courtId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const [reviews, setReviews] = useState<ReviewsResponse>({
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    if (!courtId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getCourtReviewsWithFallback(courtId, page, pageSize)
      setReviews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews")
      console.error("Error fetching reviews:", err)
    } finally {
      setLoading(false)
    }
  }, [courtId, page, pageSize])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const refetch = useCallback(() => {
    fetchReviews()
  }, [fetchReviews])

  const loadMore = useCallback(async () => {
    if (!reviews.pagination.hasNextPage) return

    try {
      setLoading(true)
      const nextPage = reviews.pagination.page + 1
      const newReviews = await getCourtReviewsWithFallback(courtId, nextPage, pageSize)
      
      setReviews(prev => ({
        data: [...prev.data, ...newReviews.data],
        pagination: newReviews.pagination,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more reviews")
      console.error("Error loading more reviews:", err)
    } finally {
      setLoading(false)
    }
  }, [courtId, pageSize, reviews.pagination])

  return {
    reviews: reviews.data,
    pagination: reviews.pagination,
    loading,
    error,
    refetch,
    loadMore,
  }
}

// Hook for sports data
export function useSports() {
  const [sports, setSports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // For now, use the SPORTS_CONFIG from types
      const { SPORTS_CONFIG } = await import("@/lib/types")
      const sportsData = Object.entries(SPORTS_CONFIG).map(([key, config]) => ({
        id: key,
        name: config.name,
        icon: config.icon,
        color: config.color,
        variants: config.variants || [],
      }))
      setSports(sportsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sports")
      console.error("Error fetching sports:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSports()
  }, [fetchSports])

  const refetch = useCallback(() => {
    fetchSports()
  }, [fetchSports])

  return {
    sports,
    loading,
    error,
    refetch,
  }
} 