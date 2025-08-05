"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, MapPin, Star, CreditCard, MessageSquare } from "lucide-react" // Import MessageSquare
import { formatVND } from "@/lib/utils"
import { CourtReviewsDisplay } from "@/components/court-reviews-display" // Import CourtReviewsDisplay

interface BookingModalProps {
  courtId: string
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ courtId, isOpen, onClose }: BookingModalProps) {
  const [selectedBookingDate, setSelectedBookingDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [bookingDurationHours, setBookingDurationHours] = useState<number>(1)
  const [isBookingInProgress, setIsBookingInProgress] = useState(false)
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false) // State for reviews modal
  const { toast } = useToast()

  const court = mockCourts.find((c) => c.id === courtId)

  if (!court) return null

  const sportConfig = SPORTS_CONFIG[court.sportType]
  const selectedDateString = selectedBookingDate?.toISOString().split("T")[0]

  const availableSlots = court.availability.filter((slot) => slot.date === selectedDateString && slot.isAvailable)

  const totalBookingPrice = court.pricing.hourlyRate * bookingDurationHours

  const handleBooking = async () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Vui lòng chọn khung giờ",
        variant: "destructive",
      })
      return
    }

    setIsBookingInProgress(true)

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Đặt Sân Thành Công!",
      description: `Sân của bạn đã được đặt cho ${selectedBookingDate?.toLocaleDateString("vi-VN")} lúc ${selectedTimeSlot}`,
    })

    setIsBookingInProgress(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full md:max-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: sportConfig.color }}
            >
              {sportConfig.icon}
            </div>
            <span>Đặt {court.name}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>
              {court.location.address}, {court.location.city}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Left Column - Court Info & Calendar */}
          <div className="flex-1 space-y-6">
            {/* Court Image */}
            <div className="relative">
              <img
                src={court.images[0] || "/placeholder.svg"}
                alt={court.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {court.rating}
                </Badge>
              </div>
            </div>

            {/* Court Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chi Tiết Sân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{court.description}</p>

                <div className="flex flex-wrap gap-2">
                  {court.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">Giá Theo Giờ:</span>
                  <span className="text-lg font-bold text-green-600">{formatVND(court.pricing.hourlyRate)}</span>
                </div>

                {/* View Reviews Button */}
                <div className="flex justify-end">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary p-0 h-auto"
                    onClick={() => setIsReviewsModalOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Xem Đánh Giá ({court.reviewCount})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Chọn Ngày</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedBookingDate}
                  onSelect={setSelectedBookingDate}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div className="flex-2 space-y-6">
            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Giờ Trống</span>
                </CardTitle>
                <CardDescription>
                  {selectedBookingDate?.toLocaleDateString("vi-VN")} - {availableSlots.length} khung giờ trống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={`${slot.startTime}-${slot.endTime}`}
                      variant={selectedTimeSlot === slot.startTime ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeSlot(slot.startTime)}
                      className="text-xs"
                    >
                      {slot.startTime}
                    </Button>
                  ))}
                </div>
                {availableSlots.length === 0 && (
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

            {/* Weather Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Dự Báo Thời Tiết</CardTitle>
                <CardDescription>Điều kiện thời tiết cho thời gian đặt sân</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">☀️</div>
                  <div>
                    <p className="font-medium">Nắng, 24°C</p>
                    <p className="text-sm text-gray-600">Thời tiết hoàn hảo để chơi!</p>
                  </div>
                </div>
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
                    {selectedTimeSlot ? `${selectedTimeSlot} (${bookingDurationHours}h)` : "Chưa chọn"}
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
              disabled={!selectedTimeSlot || isBookingInProgress}
              className="w-full"
              size="lg"
            >
              {isBookingInProgress ? "Đang xử lý..." : `Đặt với ${formatVND(totalBookingPrice)}`}
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Reviews Modal */}
      {isReviewsModalOpen && (
        <CourtReviewsDisplay
          courtId={court.id}
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
        />
      )}
    </Dialog>
  )
}
