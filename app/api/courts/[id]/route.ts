import { NextRequest, NextResponse } from "next/server"
import { courtsData } from "@/lib/data/courts"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const court = courtsData.find((c) => c.id === params.id)

    if (!court) {
      return NextResponse.json(
        { success: false, error: "Court not found" },
        { status: 404 }
      )
    }

    // Transform data to match the expected API response format
    const courtData = {
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

    return NextResponse.json({
      success: true,
      data: courtData,
    })
  } catch (error) {
    console.error("Error fetching court:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch court" },
      { status: 500 }
    )
  }
} 