import { NextRequest, NextResponse } from "next/server"
import { courtsData } from "@/lib/data/courts"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const sport = searchParams.get("sport")

    let filteredCourts = [...courtsData]

    // Filter by search term (name or address)
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCourts = filteredCourts.filter(
        (court: any) =>
          court.name.toLowerCase().includes(searchLower) ||
          court.location.address.toLowerCase().includes(searchLower) ||
          court.location.city.toLowerCase().includes(searchLower)
      )
    }

    // Filter by sport type
    if (sport) {
      filteredCourts = filteredCourts.filter((court: any) => court.sportType === sport)
    }

    // Transform data to match the expected API response format
    const courtsResponse = filteredCourts.map((court: any) => ({
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

    return NextResponse.json({
      success: true,
      data: courtsResponse,
      total: courtsResponse.length,
    })
  } catch (error) {
    console.error("Error fetching courts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch courts" },
      { status: 500 }
    )
  }
} 