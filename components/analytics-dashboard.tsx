"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockBookings, mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG } from "@/lib/types"
import { TrendingUp, DollarSign, Calendar, Users, Star } from "lucide-react"
import { formatVND } from "@/lib/utils"

export function AnalyticsDashboard() {
  const ownerCourts = mockCourts.filter((court) => court.ownerId === "owner1")
  const ownerBookings = mockBookings.filter((booking) => ownerCourts.some((court) => court.id === booking.courtId))

  // Calculate metrics
  const totalRevenue = ownerBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const totalBookings = ownerBookings.length
  const averageRating = ownerCourts.reduce((sum, court) => sum + court.rating, 0) / ownerCourts.length
  const totalReviews = ownerCourts.reduce((sum, court) => sum + court.reviewCount, 0)

  // Mock data for trends
  const revenueGrowthPercentage = 12.5
  const bookingGrowthPercentage = 8.3
  const ratingGrowthPoints = 0.2

  // Revenue by month
  const monthlyRevenueData = [
    { month: "Tháng 1", revenue: 2400000 },
    { month: "Tháng 2", revenue: 1398000 },
    { month: "Tháng 3", revenue: 9800000 },
    { month: "Tháng 4", revenue: 3908000 },
    { month: "Tháng 5", revenue: 4800000 },
    { month: "Tháng 6", revenue: 3800000 },
  ]

  const topPerformingCourts = ownerCourts
    .map((court) => ({
      ...court,
      bookings: ownerBookings.filter((b) => b.courtId === court.id).length,
      revenue: ownerBookings.filter((b) => b.courtId === court.id).reduce((sum, b) => sum + b.totalPrice, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Phân Tích & Thông Tin Chi Tiết</h2>
        <p className="text-gray-600">Theo dõi hiệu suất và doanh thu của sân</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Doanh Thu</p>
                <p className="text-2xl font-bold">{formatVND(totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{revenueGrowthPercentage}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Lượt Đặt</p>
                <p className="text-2xl font-bold">{totalBookings}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{bookingGrowthPercentage}%</span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đánh Giá Trung Bình</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{ratingGrowthPoints}</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Số Đánh Giá</p>
                <p className="text-2xl font-bold">{totalReviews}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+15</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Xu Hướng Doanh Thu</CardTitle>
          <CardDescription>Doanh thu hàng tháng trong 6 tháng qua</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyRevenueData.map((month, index) => (
              <div key={month.month} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t-md min-h-[20px] flex items-end justify-center text-white text-xs font-medium pb-2"
                  style={{
                    height: `${(month.revenue / Math.max(...monthlyRevenueData.map((m) => m.revenue))) * 200}px`,
                  }}
                >
                  {formatVND(month.revenue)}
                </div>
                <div className="text-sm text-gray-600 mt-2">{month.month}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Courts */}
        <Card>
          <CardHeader>
            <CardTitle>Các Sân Hoạt Động Tốt Nhất</CardTitle>
            <CardDescription>Các sân được xếp hạng theo doanh thu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingCourts.map((court, index) => {
                const sportConfig = SPORTS_CONFIG[court.sportType]
                return (
                  <div key={court.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-bold">
                        {index + 1}
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: sportConfig.color }}
                      >
                        {sportConfig.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{court.name}</h4>
                        <p className="text-sm text-gray-600">{court.bookings} lượt đặt</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{formatVND(court.revenue)}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {court.rating}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Chi Tiết & Đề Xuất Từ AI</CardTitle>
            <CardDescription>Các gợi ý thông minh để tối ưu hóa doanh nghiệp của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-blue-900">Tối Ưu Giờ Cao Điểm</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Các sân của bạn có tỷ lệ sử dụng thấp từ 2-4 giờ chiều. Hãy cân nhắc giảm giá 20% trong những
                      khung giờ này.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-green-900">Định Giá Dựa Trên Thời Tiết</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Những ngày mưa cho thấy nhu cầu sân trong nhà cao hơn 40%. Hãy cân nhắc áp dụng giá động.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-yellow-900">Nâng Cấp Thiết Bị</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Các sân có thiết bị mới hơn nhận được đánh giá cao hơn 15%. Hãy cân nhắc nâng cấp Sân #2.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-purple-900">Cơ Hội Tiếp Thị</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Các sân bóng rổ cho thấy nhu cầu ngày càng tăng (+25%). Hãy cân nhắc quảng bá các cơ sở này.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
