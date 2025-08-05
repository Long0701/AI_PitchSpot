"use client"

import { useState } from "react" // Import useState
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Court } from "@/lib/types"
import { SPORTS_CONFIG } from "@/lib/types"
import { MapPin, Star, Clock, DollarSign, MessageSquare } from "lucide-react" // Import MessageSquare
import { formatVND } from "@/lib/utils"
import { CourtReviewsDisplay } from "@/components/court-reviews-display" // Import CourtReviewsDisplay

interface CourtCardProps {
  court: Court
  onBook: () => void
}

export function CourtCard({ court, onBook }: CourtCardProps) {
  const sportConfig = SPORTS_CONFIG[court.sportType]
  const availableToday = court.availability.filter(
    (slot) => slot.date === new Date().toISOString().split("T")[0] && slot.isAvailable,
  ).length

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false) // State for reviews modal

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full">
      <div className="relative">
        <img src={court.images[0] || "/placeholder.svg"} alt={court.name} className="w-full h-48 object-cover" />
        <div className="absolute top-4 left-4">
          <Badge className="text-white border-0" style={{ backgroundColor: sportConfig.color }}>
            {sportConfig.icon} {sportConfig.name}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {court.rating}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{court.name}</CardTitle>
        <CardDescription className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          {court.location.address}, {court.location.city}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{court.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {court.features.lighting && (
            <Badge variant="outline" className="text-xs">
              💡 Đèn Chiếu Sáng
            </Badge>
          )}
          {court.features.parking && (
            <Badge variant="outline" className="text-xs">
              🚗 Bãi Đỗ Xe
            </Badge>
          )}
          {court.features.equipment && (
            <Badge variant="outline" className="text-xs">
              🏓 Thiết Bị
            </Badge>
          )}
        </div>

        {/* Pricing and Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-medium">{formatVND(court.pricing.hourlyRate)}/giờ</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{availableToday} khung giờ hôm nay</span>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{court.rating}</span>
            <span className="text-gray-600">({court.reviewCount} đánh giá)</span>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-primary p-0 h-auto"
            onClick={() => setIsReviewsModalOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Xem Đánh Giá
          </Button>
        </div>

        <Button onClick={onBook} className="w-full">
          Đặt Ngay
        </Button>
      </CardContent>

      {/* Reviews Modal */}
      {isReviewsModalOpen && (
        <CourtReviewsDisplay
          courtId={court.id}
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
        />
      )}
    </Card>
  )
}
