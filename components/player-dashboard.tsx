"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { CourtSearch } from "@/components/court-search"
import { BookingHistory } from "@/components/booking-history"
import { MapView } from "@/components/map-view" // Updated import
import { WeatherWidget } from "@/components/weather-widget"
import { mockBookings, mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG, BookingStatus } from "@/lib/types" // Import BookingStatus enum
import { Calendar, LogOut, User, Search, Map, History } from "lucide-react"

export function PlayerDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("search")

  const upcomingBookings = mockBookings.filter(
    (booking) => booking.status === BookingStatus.Confirmed && new Date(booking.date) >= new Date(),
  )

  const recentBookings = mockBookings
    .filter((booking) => booking.status === BookingStatus.Completed && new Date(booking.date) < new Date())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SmartSport</span>
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
                  <User className="w-5 h-5" />
                  <span>Bảng Điều Khiển Người Chơi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "search" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("search")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tìm Sân
                </Button>
                <Button
                  variant={activeTab === "map" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("map")}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Xem Bản Đồ
                </Button>
                <Button
                  variant={activeTab === "bookings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("bookings")}
                >
                  <History className="w-4 h-4 mr-2" />
                  Lịch Sử Đặt Sân
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
                  <span className="text-sm text-gray-600">Lịch Đặt Sắp Tới</span>
                  <Badge variant="secondary">{upcomingBookings.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sân Đã Chơi</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Môn Thể Thao Yêu Thích</span>
                  <Badge variant="secondary">Bóng Đá</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            <div className="mt-6">
              <WeatherWidget />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 w-full">
            {activeTab === "search" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Tìm Sân Hoàn Hảo</h1>
                  <p className="text-gray-600">Tìm kiếm và đặt sân thể thao với tình trạng trống theo thời gian thực</p>
                </div>
                <CourtSearch />
              </div>
            )}

            {activeTab === "map" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Sân Gần Bạn</h1>
                  <p className="text-gray-600">Khám phá sân trên bản đồ và kiểm tra tình trạng trống</p>
                </div>
                {/* need to update */}
                <div className="h-[650px] rounded-lg overflow-hidden"> 
                  <MapView />
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch Sử Đặt Sân</h1>
                  <p className="text-gray-600">Quản lý các lần đặt sân hiện tại và đã qua</p>
                </div>
                <BookingHistory />
              </div>
            )}

            {/* Upcoming Bookings Preview */}
            {activeTab === "search" && upcomingBookings.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Lịch Đặt Sắp Tới</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 2).map((booking) => {
                      const court = mockCourts.find((c) => c.id === booking.courtId)
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                              style={{ backgroundColor: SPORTS_CONFIG[court?.sportType || "football"].color }}
                            >
                              {SPORTS_CONFIG[court?.sportType || "football"].icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{court?.name}</h3>
                              <p className="text-sm text-gray-600">
                                {booking.date} • {booking.startTime} - {booking.endTime}
                              </p>
                            </div>
                          </div>
                          <Badge variant={booking.status === BookingStatus.Confirmed ? "default" : "secondary"}>
                            {booking.status === BookingStatus.Confirmed ? "Đã xác nhận" : "Chờ xử lý"}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
