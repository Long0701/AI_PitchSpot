"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SPORTS_CONFIG } from "@/lib/types"
import { useCourtReviews } from "@/hooks/use-courts"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Star, Clock, CalendarIcon, MessageSquare, ImageIcon, CreditCard } from "lucide-react"
import { formatVND } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { type CourtDetailResponse } from "@/lib/api/courts"

// Constants
const MAX_BOOKING_DAYS_AHEAD = 14
const INITIAL_REVIEWS_TO_DISPLAY = 3
const REVIEWS_TO_LOAD_MORE = 3

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

interface CourtDetailPageProps {
  court: CourtDetailResponse
}

interface StarRatingSelectorProps {
  value: number
  onChange: (rating: number) => void
  onHover?: (rating: number) => void
  starSizeClass?: string
  className?: string
}

function StarRatingSelector({
  value,
  onChange,
  onHover,
  starSizeClass = "w-6 h-6",
  className,
}: StarRatingSelectorProps) {
  const [hoveredStarRating, setHoveredStarRating] = useState(0)

  return (
    <div className={cn("flex space-x-1", className)}>
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

interface ReviewItemProps {
  review: any // Using any for now to avoid type conflicts
}

function ReviewItem({ review }: ReviewItemProps) {
  const getReviewAspectDisplayName = (aspect: string) => {
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

  const getRatingDescription = (value: number) => {
    if (value >= 4.5) return ReviewRatingDescription.Excellent
    if (value >= 4) return ReviewRatingDescription.Good
    if (value >= 3) return ReviewRatingDescription.Average
    if (value >= 2) return ReviewRatingDescription.Bad
    return ReviewRatingDescription.VeryBad
  }

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.userAvatar} />
          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-sm">{review.userName}</h4>
              <div className="flex items-center space-x-2">
                <StarRatingSelector value={review.rating} onChange={() => {}} starSizeClass="w-3 h-3" />
                <span className="text-xs text-gray-500">{getRatingDescription(review.rating)}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(review.aspects).map(([aspect, rating]) => (
              <div key={aspect} className="flex justify-between">
                <span className="text-gray-600">{getReviewAspectDisplayName(aspect)}:</span>
                <span className="font-medium">{rating}/5</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ReviewSubmissionFormProps {
  courtId: string
  onSubmitReview: (rating: number, comment: string) => Promise<void>
}

function ReviewSubmissionForm({ courtId, onSubmitReview }: ReviewSubmissionFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const getRatingDescription = (value: number) => {
    if (value >= 4.5) return ReviewRatingDescription.Excellent
    if (value >= 4) return ReviewRatingDescription.Good
    if (value >= 3) return ReviewRatingDescription.Average
    if (value >= 2) return ReviewRatingDescription.Bad
    return ReviewRatingDescription.VeryBad
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Vui lòng chọn đánh giá",
        description: "Bạn cần chọn số sao trước khi gửi đánh giá.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Vui lòng nhập nhận xét",
        description: "Bạn cần nhập nhận xét trước khi gửi đánh giá.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmitReview(rating, comment)
      setRating(0)
      setComment("")
      toast({
        title: "Đánh giá đã được gửi",
        description: "Cảm ơn bạn đã đánh giá sân thể thao này!",
      })
    } catch (error) {
      toast({
        title: "Lỗi khi gửi đánh giá",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Viết Đánh Giá</CardTitle>
        <CardDescription>Chia sẻ trải nghiệm của bạn về sân thể thao này</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Đánh giá tổng quan</Label>
          <div className="flex items-center space-x-2 mt-2">
            <StarRatingSelector value={rating} onChange={setRating} />
            {rating > 0 && (
              <span className="text-sm text-gray-600">{getRatingDescription(rating)}</span>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="review-comment" className="text-sm font-medium">
            Nhận xét
          </Label>
          <Textarea
            id="review-comment"
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
        </Button>
      </CardContent>
    </Card>
  )
}

interface CourtImageGalleryProps {
  images: string[]
  courtName: string
}

function CourtImageGallery({ images, courtName }: CourtImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt={`${courtName} - Ảnh ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? "border-primary" : "border-gray-200"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${courtName} - Ảnh ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface CourtInfoSectionProps {
  court: CourtDetailResponse
}

function CourtInfoSection({ court }: CourtInfoSectionProps) {
  const sportConfig = SPORTS_CONFIG[court.sport]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{court.name}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{court.address}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{court.rating}</span>
            <span>({court.reviewCount} đánh giá)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge className="text-white" style={{ backgroundColor: sportConfig.color }}>
            {sportConfig.icon} {sportConfig.name}
          </Badge>
          <div className="flex items-center space-x-1 text-green-600">
            <CreditCard className="w-4 h-4" />
            <span className="font-medium">{formatVND(court.price)}/giờ</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Mô tả</h3>
        <p className="text-gray-700 leading-relaxed">{court.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Tiện ích</h3>
        <div className="flex flex-wrap gap-2">
          {court.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Đặc điểm</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${court.features.lighting ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-sm">Ánh sáng</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${court.features.parking ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-sm">Bãi đỗ xe</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${court.features.restrooms ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-sm">Nhà vệ sinh</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${court.features.equipment ? "bg-green-500" : "bg-gray-300"}`} />
            <span className="text-sm">Cho thuê thiết bị</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MapPreviewSectionProps {
  location: {
    lat: number
    lng: number
    address: string
  }
}

function MapPreviewSection({ location }: MapPreviewSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Vị trí</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
          {/* In a real app, this would be a map component */}
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Bản đồ sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">{location.address}</p>
      </CardContent>
    </Card>
  )
}

export function CourtDetailPageNew({ court }: CourtDetailPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const { toast } = useToast()

  // Use the hook for reviews
  const { reviews, loading: reviewsLoading, error: reviewsError, loadMore } = useCourtReviews(court.id)

  const sportConfig = SPORTS_CONFIG[court.sport]

  const availableTimeSlots = court.availability
    .filter((slot) => slot.isAvailable)
    .slice(0, 10) // Show first 10 available slots

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Vui lòng chọn thời gian",
        description: "Bạn cần chọn ngày và giờ đặt sân.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Đặt sân thành công",
      description: "Chúng tôi sẽ liên hệ với bạn để xác nhận.",
    })
  }

  const handleLoadMoreReviews = () => {
    loadMore()
  }

  const handleReviewSubmission = async (rating: number, comment: string) => {
    // In a real app, this would submit to the API
    console.log("Submitting review:", { rating, comment, courtId: court.id })
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Court Images */}
            <CourtImageGallery images={court.images} courtName={court.name} />

            {/* Court Information */}
            <Card>
              <CardContent className="p-6">
                <CourtInfoSection court={court} />
              </CardContent>
            </Card>

            {/* Map Preview */}
            <MapPreviewSection
              location={{
                lat: court.lat,
                lng: court.lng,
                address: court.address,
              }}
            />

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Đánh giá ({court.reviewCount})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Đang tải đánh giá...</p>
                  </div>
                ) : reviewsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Lỗi khi tải đánh giá</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                    {reviews.length < court.reviewCount && (
                      <Button onClick={handleLoadMoreReviews} variant="outline" className="w-full">
                        Xem thêm đánh giá
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Submission */}
            <ReviewSubmissionForm courtId={court.id} onSubmitReview={handleReviewSubmission} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Đặt Sân</span>
                </CardTitle>
                <CardDescription>Chọn ngày và giờ phù hợp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Chọn ngày</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Chọn giờ</Label>
                  <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giờ đặt sân" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((slot) => (
                        <SelectItem key={`${slot.date}-${slot.startTime}`} value={`${slot.date}-${slot.startTime}`}>
                          {slot.startTime} - {slot.endTime} ({formatVND(slot.price)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleBooking} className="w-full">
                  Đặt Sân Ngay
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span className="font-medium text-green-600">{formatVND(court.price)}/giờ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Đánh giá:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{court.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Số đánh giá:</span>
                  <span className="font-medium">{court.reviewCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 