"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { mockBookings, mockCourts } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

// Enums/Mappings
enum ReviewRatingDescription {
  VeryBad = "Rất Tệ",
  Bad = "Tệ",
  Average = "Trung Bình",
  Good = "Tốt",
  Excellent = "Tuyệt Vời",
}

enum ReviewAspectDisplayName {
  Cleanliness = "Sạch Sẽ",
  Lighting = "Ánh Sáng",
  Equipment = "Thiết Bị",
  Location = "Vị Trí",
}

interface StarRatingSelectorProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  onChange: (rating: number) => void
  onHover?: (rating: number) => void
  starSizeClass?: string
}

function StarRatingSelector({
  value,
  onChange,
  onHover,
  starSizeClass = "w-6 h-6",
  className,
  ...props
}: StarRatingSelectorProps) {
  const [hoveredStarRating, setHoveredStarRating] = useState(0)

  return (
    <div className={cn("flex space-x-1", className)} {...props}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoveredStarRating(star)}
          onMouseLeave={() => setHoveredStarRating(0)}
          className={`${starSizeClass} transition-colors`}
        >
          <Star
            className={`w-full h-full ${
              star <= (hoveredStarRating || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

interface ReviewModalProps {
  bookingId: string
  isOpen: boolean
  onClose: () => void
}

export function ReviewModal({ bookingId, isOpen, onClose }: ReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [aspectRatings, setAspectRatings] = useState({
    cleanliness: 0,
    lighting: 0,
    equipment: 0,
    location: 0,
  })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const { toast } = useToast()

  const booking = mockBookings.find((b) => b.id === bookingId)
  const court = booking ? mockCourts.find((c) => c.id === booking.courtId) : null

  if (!booking || !court) return null

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast({
        title: "Vui lòng cung cấp đánh giá",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingReview(true)

    // Simulate review submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Đánh giá đã được gửi!",
      description: "Cảm ơn bạn đã phản hồi",
    })

    setIsSubmittingReview(false)
    onClose()
  }

  const getRatingDescription = (value: number) => {
    switch (value) {
      case 1:
        return ReviewRatingDescription.VeryBad
      case 2:
        return ReviewRatingDescription.Bad
      case 3:
        return ReviewRatingDescription.Average
      case 4:
        return ReviewRatingDescription.Good
      case 5:
        return ReviewRatingDescription.Excellent
      default:
        return ""
    }
  }

  const getAspectDisplayName = (aspect: string) => {
    switch (aspect) {
      case "cleanliness":
        return ReviewAspectDisplayName.Cleanliness
      case "lighting":
        return ReviewAspectDisplayName.Lighting
      case "equipment":
        return ReviewAspectDisplayName.Equipment
      case "location":
        return ReviewAspectDisplayName.Location
      default:
        return aspect
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đánh Giá {court.name}</DialogTitle>
          <DialogDescription>Chia sẻ trải nghiệm của bạn để giúp những Người Dùng khác</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <Label className="text-base font-medium">Đánh Giá Tổng Thể</Label>
            <div className="flex items-center space-x-2 mt-2">
              <StarRatingSelector value={overallRating} onChange={setOverallRating} />
              <span className="text-sm text-gray-600">{getRatingDescription(overallRating)}</span>
            </div>
          </div>

          {/* Aspect Ratings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Đánh Giá Các Khía Cạnh Cụ Thể</Label>

            {Object.entries(aspectRatings).map(([aspect, value]) => (
              <div key={aspect} className="flex items-center justify-between">
                <span className="text-sm capitalize">{getAspectDisplayName(aspect)}</span>
                <StarRatingSelector
                  value={value}
                  onChange={(rating) => setAspectRatings((prev) => ({ ...prev, [aspect]: rating }))}
                  starSizeClass="w-4 h-4"
                />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-base font-medium">
              Bình Luận Của Bạn (Tùy Chọn)
            </Label>
            <Textarea
              id="comment"
              placeholder="Chia sẻ trải nghiệm của bạn với sân này..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={isSubmittingReview || overallRating === 0} className="w-full">
            {isSubmittingReview ? "Đang gửi..." : "Gửi Đánh Giá"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
