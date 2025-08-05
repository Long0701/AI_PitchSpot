"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockBookings, mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG, BookingStatus, PaymentStatus } from "@/lib/types" // Import enums
import { ReviewModal } from "@/components/review-modal"
import { Calendar, Clock, MapPin, MessageSquare } from "lucide-react"

export function BookingHistory() {
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<string | null>(null)

  const upcomingBookings = mockBookings.filter(
    (booking) => booking.status === BookingStatus.Confirmed && new Date(booking.date) >= new Date(),
  )

  const pastBookings = mockBookings.filter(
    (booking) => booking.status === BookingStatus.Completed || new Date(booking.date) < new Date(),
  )

  const pendingBookings = mockBookings.filter((booking) => booking.status === BookingStatus.Pending)

  const BookingCard = ({
    booking,
    showReviewButton = false,
  }: {
    booking: (typeof mockBookings)[0]
    showReviewButton?: boolean
  }) => {
    const court = mockCourts.find((c) => c.id === booking.courtId)
    if (!court) return null

    const sportConfig = SPORTS_CONFIG[court.sportType]

    const getStatusBadge = (status: BookingStatus) => {
      switch (status) {
        case BookingStatus.Confirmed:
          return <Badge variant="default">Đã xác nhận</Badge>
        case BookingStatus.Pending:
          return <Badge variant="secondary">Chờ xử lý</Badge>
        case BookingStatus.Completed:
          return <Badge variant="outline">Đã hoàn thành</Badge>
        case BookingStatus.Cancelled:
          return <Badge variant="destructive">Đã hủy</Badge>
        default:
          return <Badge variant="outline">{status}</Badge>
      }
    }

    const getPaymentStatusBadge = (status: PaymentStatus) => {
      switch (status) {
        case PaymentStatus.Paid:
          return (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
              Đã thanh toán
            </Badge>
          )
        case PaymentStatus.Pending:
          return (
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
              Chờ thanh toán
            </Badge>
          )
        case PaymentStatus.Failed:
          return (
            <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
              Thanh toán thất bại
            </Badge>
          )
        default:
          return (
            <Badge variant="outline" className="ml-2">
              {status}
            </Badge>
          )
      }
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: sportConfig.color }}
              >
                {sportConfig.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{court.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{court.location.city}</span>
                  </div>
                </div>
                <div className="mt-2">
                  {getStatusBadge(booking.status)}
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">${booking.totalPrice}</div>
              {showReviewButton && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => setSelectedBookingForReview(booking.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Đánh Giá
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Sắp Tới ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Đã Qua ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ Xử Lý ({pendingBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch đặt sắp tới</h3>
                <p className="text-gray-600">Hãy đặt sân để xem các lịch đặt sắp tới của bạn tại đây</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                showReviewButton={booking.status === BookingStatus.Completed}
              />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch đặt đã qua</h3>
                <p className="text-gray-600">Lịch sử đặt sân của bạn sẽ xuất hiện tại đây</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length > 0 ? (
            pendingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch đặt chờ xử lý</h3>
                <p className="text-gray-600">Các lịch đặt đang chờ xác nhận sẽ xuất hiện tại đây</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          bookingId={selectedBookingForReview}
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
        />
      )}
    </div>
  )
}
