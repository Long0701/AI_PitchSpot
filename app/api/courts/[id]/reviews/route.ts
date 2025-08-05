import { NextRequest, NextResponse } from "next/server"
import { reviewsData, generateReviewsForCourt } from "@/lib/data/reviews"
import { courtsData } from "@/lib/data/courts"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")

    // Get court to check review count
    const court = courtsData.find((c) => c.id === params.id)
    if (!court) {
      return NextResponse.json(
        { success: false, error: "Court not found" },
        { status: 404 }
      )
    }

    // Get reviews for the specific court, generate additional ones if needed
    const baseReviews = reviewsData.filter((review) => review.courtId === params.id)
    const courtReviews = generateReviewsForCourt(params.id, court.reviewCount)

    // Calculate pagination
    const totalReviews = courtReviews.length
    const totalPages = Math.ceil(totalReviews / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedReviews = courtReviews.slice(startIndex, endIndex)

    // Transform reviews to match expected format
    const reviewsResponse = paginatedReviews.map((review) => ({
      id: review.id,
      courtId: review.courtId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      aspects: review.aspects,
      createdAt: review.createdAt,
      userAvatar: review.userAvatar,
    }))

    return NextResponse.json({
      success: true,
      data: reviewsResponse,
      pagination: {
        page,
        pageSize,
        total: totalReviews,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
} 