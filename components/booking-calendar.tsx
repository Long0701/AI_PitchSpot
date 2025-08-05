"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockBookings, mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG, BookingStatus } from "@/lib/types" // Import BookingStatus enum
import { FullCalendarBooking } from "@/components/full-calendar-booking"

export function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCourt, setSelectedCourt] = useState<string>("all")

  const ownerCourts = mockCourts.filter((court) => court.ownerId === "owner1")
  const ownerBookings = mockBookings.filter((booking) => ownerCourts.some((court) => court.id === booking.courtId))


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lịch Đặt Sân</h2>
          <p className="text-gray-600">Xem và quản lý tất cả lượt đặt trong chế độ xem lịch</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedCourt} onValueChange={setSelectedCourt}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất Cả Sân" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Sân</SelectItem>
              {ownerCourts.map((court) => (
                <SelectItem key={court.id} value={court.id}>
                  <div className="flex items-center space-x-2">
                    <span>{SPORTS_CONFIG[court.sportType].icon}</span>
                    <span>{court.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar View */}
      <FullCalendarBooking />
    </div>
  )
}
