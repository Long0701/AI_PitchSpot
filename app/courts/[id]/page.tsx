import { notFound } from "next/navigation"
import { getCourtByIdWithFallback } from "@/lib/api/courts"
import { CourtDetailPageNew } from "@/components/court-detail-page-new"
import type { Metadata } from "next"

interface CourtDetailProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CourtDetailProps): Promise<Metadata> {
  const court = await getCourtByIdWithFallback(params.id)

  return {
    title: court ? `SmartSport - ${court.name}` : "SmartSport - Chi Tiết Sân",
    description: court ? court.description : "Xem chi tiết về sân thể thao, lịch đặt và đánh giá.",
  }
}

export default async function CourtDetail({ params }: CourtDetailProps) {
  const court = await getCourtByIdWithFallback(params.id)

  if (!court) {
    notFound()
  }

  return <CourtDetailPageNew court={court} />
}
