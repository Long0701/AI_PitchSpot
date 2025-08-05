"use client"

import { useState, useMemo, type HTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SPORTS_CONFIG, type Review } from "@/lib/types"
import { type CourtDetailResponse } from "@/lib/api/courts"
import { useCourtReviews } from "@/hooks/use-courts"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Star, Clock, CalendarIcon, MessageSquare, ImageIcon, CreditCard } from "lucide-react"
import { formatVND } from "@/lib/utils"
import { cn } from "@/lib/utils"

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

interface ReviewItemProps {
  review: Review
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

  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center space-x-4 mb-3">
        <Avatar>
          <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{review.userName}</h4>
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{review.rating} / 5</span>
            <span className="ml-2 text-xs">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-800 mb-3">{review.comment}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {Object.entries(review.aspects).map(([aspect, score]) => (
          <div key={aspect} className="flex items-center space-x-1">
            <span className="font-medium">{getReviewAspectDisplayName(aspect)}:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${star <= score ? "fill-blue-400 text-blue-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ReviewSubmissionFormProps {
  courtId: string
  onSubmitReview: (rating: number, comment: string) => Promise<void>
}

function ReviewSubmissionForm({ courtId, onSubmitReview }: ReviewSubmissionFormProps) {
  const [currentReviewRating, setCurrentReviewRating] = useState(0)
  const [currentReviewComment, setCurrentReviewComment] = useState("")
  const [isReviewSubmissionInProgress, setIsReviewSubmissionInProgress] = useState(false)
  const { toast } = useToast()

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

  const handleSubmit = async () => {
    if (currentReviewRating === 0) {
      toast({
        title: "Vui lòng cung cấp đánh giá sao",
        variant: "destructive",
      })
      return
    }

    setIsReviewSubmissionInProgress(true)
    await onSubmitReview(currentReviewRating, currentReviewComment)
    setIsReviewSubmissionInProgress(false)
    setCurrentReviewRating(0)
    setCurrentReviewComment("")
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="text-lg font-semibold mb-4">Viết Đánh Giá Của Bạn</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Đánh Giá Sao</Label>
          <div className="flex items-center space-x-2 mt-2">
            <StarRatingSelector value={currentReviewRating} onChange={setCurrentReviewRating} />
            <span className="text-sm text-gray-600">{getRatingDescription(currentReviewRating)}</span>
          </div>
        </div>
        <div>
          <Label htmlFor="review-comment">Bình Luận</Label>
          <Textarea
            id="review-comment"
            placeholder="Chia sẻ trải nghiệm của bạn về sân này..."
            value={currentReviewComment}
            onChange={(e) => setCurrentReviewComment(e.target.value)}
            rows={4}
          />
        </div>
        <Button onClick={handleSubmit} disabled={isReviewSubmissionInProgress || currentReviewRating === 0}>
          {isReviewSubmissionInProgress ? "Đang gửi..." : "Gửi Đánh Giá"}
        </Button>
      </div>
    </div>
  )
}

interface CourtImageGalleryProps {
  images: string[]
  courtName: string
}

function CourtImageGallery({ images, courtName }: CourtImageGalleryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Hình Ảnh Sân</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img || "/placeholder.svg"}
            alt={`${courtName} - ${index + 1}`}
            className="w-full h-48 object-cover rounded-lg shadow-sm"
          />
        ))}
      </CardContent>
    </Card>
  )
}

interface CourtInfoSectionProps {
  court: CourtDetailResponse
}

function CourtInfoSection({ court }: CourtInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mô Tả Sân</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{court.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {court.amenities.map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-sm">
              {amenity}
            </Badge>
          ))}
          {court.features.lighting && <Badge variant="outline">💡 Đèn Chiếu Sáng</Badge>}
          {court.features.parking && <Badge variant="outline">🚗 Bãi Đỗ Xe</Badge>}
          {court.features.restrooms && <Badge variant="outline">🚽 Nhà Vệ Sinh</Badge>}
          {court.features.equipment && <Badge variant="outline">🏓 Thiết Bị</Badge>}
        </div>
      </CardContent>
    </Card>
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
          <span>Vị Trí Sân</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative">
          <img
            src={`/placeholder.svg?height=256&width=512&query=map+of+${encodeURIComponent(location.address)}+${encodeURIComponent(location.city)}`}
            alt="Map preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-lg font-bold">
            {location.address}, {location.city}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Địa chỉ: {location.address}, {location.city}
        </p>
      </CardContent>
    </Card>
  )
}

export function CourtDetailPage({ court }: CourtDetailPageProps) {
  const { toast } = useToast()
  const sportConfig = SPORTS_CONFIG[court.sportType]

  const [selectedBookingDate, setSelectedBookingDate] = useState<Date | undefined>(new Date())
  const [selectedBookingTimeSlot, setSelectedBookingTimeSlot] = useState<string>("")
  const [bookingDurationHours, setBookingDurationHours] = useState<number>(1)
  const [isBookingInProgress, setIsBookingInProgress] = useState(false)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)

  // Reviews state
  const allCourtReviews = useMemo(() => mockReviews.filter((r) => r.courtId === court.id), [court.id])
  const [numberOfReviewsToDisplay, setNumberOfReviewsToDisplay] = useState(INITIAL_REVIEWS_TO_DISPLAY)

  const availableTimeSlots = useMemo(() => {
    if (!selectedBookingDate) return []
    setIsLoadingTimeSlots(true)
    // Simulate API call delay
    setTimeout(() => setIsLoadingTimeSlots(false), 500)
    const selectedDateString = selectedBookingDate.toISOString().split("T")[0]
    return court.availability.filter((slot) => slot.date === selectedDateString && slot.isAvailable)
  }, [selectedBookingDate, court.availability])

  const totalBookingPrice = court.pricing.hourlyRate * bookingDurationHours

  const handleBooking = async () => {
    if (!selectedBookingTimeSlot) {
      toast({
        title: "Vui lòng chọn khung giờ",
        variant: "destructive",
      })
      return
    }

    setIsBookingInProgress(true)
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call
    toast({
      title: "Đặt Sân Thành Công!",
      description: `Sân của bạn đã được đặt cho ${selectedBookingDate?.toLocaleDateString("vi-VN")} lúc ${selectedBookingTimeSlot}`,
    })
    setIsBookingInProgress(false)
    // In a real app, you'd navigate or update booking history
  }

  const handleLoadMoreReviews = () => {
    setNumberOfReviewsToDisplay((prev) => prev + REVIEWS_TO_LOAD_MORE)
  }

  const handleReviewSubmission = async (rating: number, comment: string) => {
    // Simulate adding the new review (in a real app, this would be persisted)
    const newMockReview: Review = {
      id: `review-${Date.now()}`,
      courtId: court.id,
      userId: "mock-user", // Replace with actual user ID
      userName: "Người Dùng Mới", // Replace with actual user name
      rating: rating,
      comment: comment,
      aspects: {
        cleanliness: rating,
        lighting: rating,
        equipment: rating,
        location: rating,
      }, // Simplified
      createdAt: new Date().toISOString(),
      userAvatar: "/placeholder.svg?height=40&width=40",
    }
    mockReviews.unshift(newMockReview) // Add to mock data for immediate display
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 max-w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Court Info & Images */}
        <div className="lg:col-span-2 space-y-8">
          {/* Court Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{court.name}</h1>
              <p className="text-lg text-gray-600 flex items-center mt-2">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                {court.location.address}, {court.location.city}
              </p>
              <div className="flex items-center mt-2">
                <Badge className="text-white border-0" style={{ backgroundColor: sportConfig.color }}>
                  {sportConfig.icon} {sportConfig.name}
                </Badge>
                <div className="flex items-center ml-4 text-gray-700">
                  <Star className="w-5 h-5 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{court.rating}</span>
                  <span className="text-sm text-gray-600 ml-1">({court.reviewCount} đánh giá)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-green-600">{formatVND(court.pricing.hourlyRate)}/giờ</span>
            </div>
          </div>

          <CourtImageGallery images={court.images} courtName={court.name} />
          <CourtInfoSection court={court} />
          <MapPreviewSection location={court.location} />

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Đánh Giá ({allCourtReviews.length})</span>
              </CardTitle>
              <CardDescription>Xem những gì người dùng khác nói về sân này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {allCourtReviews.slice(0, numberOfReviewsToDisplay).map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}

              {allCourtReviews.length > numberOfReviewsToDisplay && (
                <Button variant="outline" onClick={handleLoadMoreReviews} className="w-full mt-4 bg-transparent">
                  Xem Thêm Đánh Giá
                </Button>
              )}

              {allCourtReviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-4" />
                  <p>Chưa có đánh giá nào cho sân này.</p>
                </div>
              )}

              <ReviewSubmissionForm courtId={court.id} onSubmitReview={handleReviewSubmission} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-1 space-y-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Chọn Ngày Đặt Sân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              <Calendar
                mode="single"
                selected={selectedBookingDate}
                onSelect={setSelectedBookingDate}
                disabled={(date) =>
                  date < new Date() || date > new Date(Date.now() + MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000)
                }
                className="rounded-md border w-full"
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Giờ Trống</span>
              </CardTitle>
              <CardDescription>
                {selectedBookingDate?.toLocaleDateString("vi-VN")} - {availableTimeSlots.length} khung giờ trống
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTimeSlots ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableTimeSlots.map((slot) => (
                    <Button
                      key={`${slot.startTime}-${slot.endTime}`}
                      variant={selectedBookingTimeSlot === slot.startTime ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBookingTimeSlot(slot.startTime)}
                      className="text-xs"
                    >
                      {slot.startTime}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Không có khung giờ trống cho ngày này</p>
              )}
            </CardContent>
          </Card>

          {/* Duration */}
          <Card>
            <CardHeader>
              <CardTitle>Thời Lượng</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={bookingDurationHours.toString()}
                onValueChange={(value) => setBookingDurationHours(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 giờ</SelectItem>
                  <SelectItem value="2">2 giờ</SelectItem>
                  <SelectItem value="3">3 giờ</SelectItem>
                  <SelectItem value="4">4 giờ</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Tóm Tắt Đặt Sân</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Sân:</span>
                <span className="font-medium">{court.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày:</span>
                <span className="font-medium">{selectedBookingDate?.toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Giờ:</span>
                <span className="font-medium">
                  {selectedBookingTimeSlot ? `${selectedBookingTimeSlot} (${bookingDurationHours}h)` : "Chưa chọn"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Giá:</span>
                <span className="font-medium">{formatVND(court.pricing.hourlyRate)}/giờ</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng:</span>
                  <span className="text-green-600">{formatVND(totalBookingPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={!selectedBookingTimeSlot || isBookingInProgress}
            className="w-full"
            size="lg"
          >
            {isBookingInProgress ? "Đang xử lý..." : `Đặt với ${formatVND(totalBookingPrice)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
