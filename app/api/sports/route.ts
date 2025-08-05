import { NextResponse } from "next/server"
import { SPORTS_CONFIG } from "@/lib/types"

export async function GET() {
  try {
    // Transform SPORTS_CONFIG to array format for API response
    const sportsData = Object.entries(SPORTS_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      icon: config.icon,
      color: config.color,
      variants: config.variants || [],
    }))

    return NextResponse.json({
      success: true,
      data: sportsData,
    })
  } catch (error) {
    console.error("Error fetching sports:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sports" },
      { status: 500 }
    )
  }
} 