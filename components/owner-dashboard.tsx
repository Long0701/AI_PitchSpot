"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { mockCourts, mockBookings } from "@/lib/mock-data"
import { BookingStatus } from "@/lib/types" // Import BookingStatus and UserRole enums
import { Calendar, BarChart3, LogOut, Building, DollarSign, Users, TrendingUp } from "lucide-react"
import { CourtManagement } from "@/components/court-management"
import { BookingCalendar } from "@/components/booking-calendar"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { formatVND } from "@/lib/utils" // Import formatVND

export function OwnerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for owner
  const ownerCourts = mockCourts.filter((court) => court.ownerId === "owner1")
  const ownerBookings = mockBookings.filter((booking) => ownerCourts.some((court) => court.id === booking.courtId))

  const totalRevenue = ownerBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const todayBookings = ownerBookings.filter(
    (booking) => booking.date === new Date().toISOString().split("T")[0],
  ).length

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SmartSport</span>
              <Badge variant="secondary">Chủ Sân</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={user?.avatar || "/placeholder.svg"} alt={user?.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8 w-full">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Bảng Quản Lý</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Tổng Quan
                </Button>
                <Button
                  variant={activeTab === "courts" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("courts")}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Sân Của Tôi
                </Button>
                <Button
                  variant={activeTab === "calendar" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Lịch Đặt
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("analytics")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Phân Tích
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Thống Kê Nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng Số Sân</span>
                  <Badge variant="secondary">{ownerCourts.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Đặt Sân Hôm Nay</span>
                  <Badge variant="secondary">{todayBookings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Doanh Thu Tháng</span>
                  <Badge variant="secondary">{formatVND(totalRevenue)}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 w-full">
            {activeTab === "overview" && (
              <div className="space-y-6 w-full">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Tổng Quan Bảng Điều Khiển</h1>
                  <p className="text-gray-600">Theo dõi hiệu suất sân và lượt đặt</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 w-full">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tổng Doanh Thu</p>
                          <p className="text-2xl font-bold">{formatVND(totalRevenue)}</p>
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
                          <p className="text-2xl font-bold">{ownerBookings.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Sân Hoạt Động</p>
                          <p className="text-2xl font-bold">{ownerCourts.length}</p>
                        </div>
                        <Building className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Đánh Giá TB</p>
                          <p className="text-2xl font-bold">4.8</p>
                        </div>
                        <Users className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Đặt Sân Gần Đây</CardTitle>
                    <CardDescription>Các lượt đặt sân mới nhất cho sân của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ownerBookings.slice(0, 5).map((booking) => {
                        const court = ownerCourts.find((c) => c.id === booking.courtId)
                        return (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{court?.name}</h3>
                              <p className="text-sm text-gray-600">
                                {booking.date} • {booking.startTime} - {booking.endTime}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatVND(booking.totalPrice)}</p>
                              <Badge variant={booking.status === BookingStatus.Confirmed ? "default" : "secondary"}>
                                {booking.status === BookingStatus.Confirmed
                                  ? "Đã xác nhận"
                                  : booking.status === BookingStatus.Pending
                                    ? "Chờ xử lý"
                                    : booking.status}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "courts" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản Lý Sân</h1>
                  <p className="text-gray-600">Thêm, chỉnh sửa và quản lý sân thể thao của bạn</p>
                </div>
                <CourtManagement />
              </div>
            )}

            {activeTab === "calendar" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch Đặt Sân</h1>
                  <p className="text-gray-600">Xem và quản lý tất cả lượt đặt trong chế độ xem lịch</p>
                </div>
                <BookingCalendar />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Phân Tích & Thông Tin Chi Tiết</h1>
                  <p className="text-gray-600">Theo dõi hiệu suất và nhận thông tin chi tiết từ AI</p>
                </div>
                <AnalyticsDashboard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
