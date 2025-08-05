"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockBookings, mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG, BookingStatus } from "@/lib/types" // Import BookingStatus enum
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { formatVND } from "@/lib/utils" // Import formatVND

// Mock FullCalendar-like functionality since we can't import external libraries
interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    courtId: string
    courtName: string
    sportType: string
    price: number
    status: BookingStatus // Use BookingStatus enum
  }
}

interface CalendarView {
  type: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek"
  title: string
}

export function FullCalendarBooking() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<CalendarView["type"]>("dayGridMonth")
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const ownerCourts = mockCourts.filter((court) => court.ownerId === "owner1")
  const ownerBookings = mockBookings.filter((booking) => ownerCourts.some((court) => court.id === booking.courtId))

  // Convert bookings to calendar events
  const calendarEvents: CalendarEvent[] = ownerBookings
    .filter((booking) => selectedCourt === "all" || booking.courtId === selectedCourt)
    .map((booking) => {
      const court = ownerCourts.find((c) => c.id === booking.courtId)
      if (!court) return null

      const sportConfig = SPORTS_CONFIG[court.sportType]
      const startDateTime = `${booking.date}T${booking.startTime}:00`
      const endDateTime = `${booking.date}T${booking.endTime}:00`

      return {
        id: booking.id,
        title: `${court.name} - ${booking.startTime}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: sportConfig.color,
        borderColor: sportConfig.color,
        textColor: "#ffffff",
        extendedProps: {
          courtId: booking.courtId,
          courtName: court.name,
          sportType: court.sportType,
          price: booking.totalPrice,
          status: booking.status,
        },
      }
    })
    .filter(Boolean) as CalendarEvent[]

  const views: { type: CalendarView["type"]; label: string }[] = [
    { type: "dayGridMonth", label: "Tháng" },
    { type: "timeGridWeek", label: "Tuần" },
    { type: "timeGridDay", label: "Ngày" },
    { type: "listWeek", label: "Danh Sách" },
  ]

  const navigateCalendar = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate)

    if (direction === "today") {
      setCurrentDate(new Date())
      return
    }

    switch (currentView) {
      case "dayGridMonth":
        newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
        break
      case "timeGridWeek":
      case "listWeek":
        newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
        break
      case "timeGridDay":
        newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
        break
    }

    setCurrentDate(newDate)
  }

  const getViewTitle = () => {
    const options: Intl.DateTimeFormatOptions = {}

    switch (currentView) {
      case "dayGridMonth":
        options.year = "numeric"
        options.month = "long"
        break
      case "timeGridWeek":
      case "listWeek":
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString("vi-VN", { day: "numeric", month: "short" })} - ${weekEnd.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}`
      case "timeGridDay":
        options.weekday = "long"
        options.year = "numeric"
        options.month = "long"
        options.day = "numeric"
        break
    }

    return currentDate.toLocaleDateString("vi-VN", options)
  }

  const renderMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = new Date(startOfMonth)
    startDate.setDate(startDate.getDate() - startOfMonth.getDay())

    const days = []
    const currentDateIter = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateIter))
      currentDateIter.setDate(currentDateIter.getDate() + 1)
    }

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

    return (
      <div className="grid grid-cols-7 gap-1 h-[600px]">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayEvents = calendarEvents.filter((event) => {
            const eventDate = new Date(event.start).toDateString()
            return eventDate === day.toDateString()
          })

          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-gray-200 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${isToday ? "ring-2 ring-blue-500" : ""}`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                } ${isToday ? "text-blue-600" : ""}`}
              >
                {day.getDate()}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate"
                    style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.extendedProps.courtName}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-xs text-gray-500">+{dayEvents.length - 3} khác</div>}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      weekDays.push(day)
    }

    const hours = Array.from({ length: 14 }, (_, i) => i + 8) // 8 AM to 9 PM

    return (
      <div className="h-[600px] overflow-auto border rounded-lg">
        <div className="grid grid-cols-8 gap-0 min-w-[800px]">
          {/* Time column header */}
          <div className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-100 border-b border-r sticky top-0 z-10">
            Giờ
          </div>

          {/* Day headers */}
          {weekDays.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div
                key={day.toISOString()}
                className={`p-3 text-center text-sm font-semibold border-b sticky top-0 z-10 ${
                  isToday ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                <div className="text-xs text-gray-500">{day.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
                <div className={`text-lg font-bold ${isToday ? "text-blue-600" : ""}`}>{day.getDate()}</div>
                <div className="text-xs text-gray-500">Tháng {day.getMonth() + 1}</div>
              </div>
            )
          })}

          {/* Time slots */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="p-2 text-center text-sm font-medium text-gray-600 border-r border-b bg-gray-50">
                <div className="font-bold">{hour.toString().padStart(2, "0")}:00</div>
                <div className="text-xs text-gray-400">{hour < 12 ? "SA" : "CH"}</div>
              </div>

              {/* Day columns */}
              {weekDays.map((day) => {
                const dayEvents = calendarEvents.filter((event) => {
                  const eventDate = new Date(event.start)
                  const eventHour = eventDate.getHours()
                  return eventDate.toDateString() === day.toDateString() && eventHour === hour
                })

                const isToday = day.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={`min-h-[60px] p-1 border-b border-r relative hover:bg-gray-50 ${
                      isToday ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="absolute inset-1 p-2 rounded-md text-xs cursor-pointer hover:shadow-md transition-all duration-200 border border-white/20"
                        style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-semibold truncate text-white">{event.extendedProps.courtName}</div>
                        <div className="text-white/90 text-xs">{formatVND(event.extendedProps.price)}</div>
                        <div className="text-white/80 text-xs">
                          {new Date(event.start).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 8) // 8 AM to 9 PM
    const dayEvents = calendarEvents.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === currentDate.toDateString()
    })

    return (
      <div className="h-[600px] overflow-auto border rounded-lg">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-2 gap-0 sticky top-0 z-10">
            <div className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-100 border-b border-r">
              Khung Giờ
            </div>
            <div className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-100 border-b">
              <div className="text-lg font-bold text-blue-600">
                {currentDate.toLocaleDateString("vi-VN", { weekday: "long" })}
              </div>
              <div className="text-sm text-gray-600">
                {currentDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          {hours.map((hour) => {
            const hourEvents = dayEvents.filter((event) => {
              const eventHour = new Date(event.start).getHours()
              return eventHour === hour
            })

            return (
              <div key={hour} className="grid grid-cols-2 gap-0 border-b">
                <div className="p-4 text-center border-r bg-gray-50">
                  <div className="text-lg font-bold text-gray-700">{hour.toString().padStart(2, "0")}:00</div>
                  <div className="text-xs text-gray-500">{hour < 12 ? "Sáng" : hour < 18 ? "Chiều" : "Tối"}</div>
                </div>
                <div className="min-h-[80px] p-2 relative bg-white hover:bg-gray-50">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg text-sm cursor-pointer hover:shadow-lg transition-all duration-200 border border-white/20"
                      style={{ backgroundColor: event.backgroundColor, color: event.textColor }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="font-semibold text-white mb-1">{event.extendedProps.courtName}</div>
                      <div className="text-white/90 text-xs mb-1">{formatVND(event.extendedProps.price)}</div>
                      <div className="text-white/80 text-xs">
                        {new Date(event.start).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}{" "}
                        -{" "}
                        {new Date(event.end).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </div>
                      <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30 text-xs">
                        {event.extendedProps.status === BookingStatus.Confirmed ? "Đã xác nhận" : "Chờ xử lý"}
                      </Badge>
                    </div>
                  ))}
                  {hourEvents.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-6">Không có lịch đặt</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderListView = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekEvents = calendarEvents
      .filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate >= weekStart && eventDate <= weekEnd
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    return (
      <div className="h-[600px] overflow-auto space-y-2">
        {weekEvents.map((event) => {
          const eventDate = new Date(event.start)
          const court = ownerCourts.find((c) => c.id === event.extendedProps.courtId)
          const sportConfig = SPORTS_CONFIG[event.extendedProps.sportType as keyof typeof SPORTS_CONFIG]

          return (
            <Card
              key={event.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedEvent(event)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: event.backgroundColor }}
                    >
                      {sportConfig.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.extendedProps.courtName}</h4>
                      <p className="text-sm text-gray-600">
                        {eventDate.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {eventDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} -
                        {new Date(event.end).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{formatVND(event.extendedProps.price)}</div>
                    <Badge variant={event.extendedProps.status === BookingStatus.Confirmed ? "default" : "secondary"}>
                      {event.extendedProps.status === BookingStatus.Confirmed ? "Đã xác nhận" : "Chờ xử lý"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {weekEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">Không có lịch đặt nào trong tuần này</div>
        )}
      </div>
    )
  }

  const renderCalendarView = () => {
    switch (currentView) {
      case "dayGridMonth":
        return renderMonthView()
      case "timeGridWeek":
      case "listWeek":
        return currentView === "listWeek" ? renderListView() : renderWeekView()
      case "timeGridDay":
        return renderDayView()
      default:
        return renderMonthView()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lịch Đặt Sân FullCalendar</h2>
          <p className="text-gray-600">Giao diện lịch chuyên nghiệp với nhiều chế độ xem</p>
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

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>{getViewTitle()}</span>
              </CardTitle>
            </div>

            <div className="flex items-center space-x-2">
              {/* Navigation */}
              <Button variant="outline" size="sm" onClick={() => navigateCalendar("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateCalendar("today")}>
                Hôm Nay
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateCalendar("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* View Selector */}
              <div className="flex border rounded-md">
                {views.map((view) => (
                  <Button
                    key={view.type}
                    variant={currentView === view.type ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView(view.type)}
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                  >
                    {view.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={calendarRef}>{renderCalendarView()}</div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full md:max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Chi Tiết Đặt Sân</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)} className="h-8 w-8 p-0">
                <span className="text-gray-400 hover:text-gray-600 text-lg">×</span>
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Court Info */}
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg"
                  style={{ backgroundColor: selectedEvent.backgroundColor }}
                >
                  {SPORTS_CONFIG[selectedEvent.extendedProps.sportType as keyof typeof SPORTS_CONFIG].icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedEvent.extendedProps.courtName}</h4>
                  <p className="text-sm text-gray-600">
                    {SPORTS_CONFIG[selectedEvent.extendedProps.sportType as keyof typeof SPORTS_CONFIG].name}
                  </p>
                  <Badge
                    variant={selectedEvent.extendedProps.status === BookingStatus.Confirmed ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {selectedEvent.extendedProps.status === BookingStatus.Confirmed ? "Đã Xác Nhận" : "Chờ Xử Lý"}
                  </Badge>
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Thông Tin Đặt Sân</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">📅 Ngày đặt:</span>
                      <span className="font-medium">
                        {new Date(selectedEvent.start).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🕐 Giờ bắt đầu:</span>
                      <span className="font-medium">
                        {new Date(selectedEvent.start).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🕐 Giờ kết thúc:</span>
                      <span className="font-medium">
                        {new Date(selectedEvent.end).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">⏱️ Thời lượng:</span>
                      <span className="font-medium">
                        {Math.round(
                          (new Date(selectedEvent.end).getTime() - new Date(selectedEvent.start).getTime()) /
                            (1000 * 60 * 60),
                        )}{" "}
                        giờ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Thông Tin Thanh Toán</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">💰 Tổng tiền:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatVND(selectedEvent.extendedProps.price)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">💳 Trạng thái thanh toán:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Đã Thanh Toán
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🧾 Mã đặt sân:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        #{selectedEvent.id.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Thông Tin Sân</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🏟️ Tên sân:</span>
                      <span className="font-medium">{selectedEvent.extendedProps.courtName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">⚽ Loại thể thao:</span>
                      <div className="flex items-center space-x-2">
                        <span>
                          {SPORTS_CONFIG[selectedEvent.extendedProps.sportType as keyof typeof SPORTS_CONFIG].icon}
                        </span>
                        <span className="font-medium">
                          {SPORTS_CONFIG[selectedEvent.extendedProps.sportType as keyof typeof SPORTS_CONFIG].name}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">📍 Địa chỉ:</span>
                      <span className="font-medium text-right text-sm">
                        {ownerCourts.find((c) => c.id === selectedEvent.extendedProps.courtId)?.location.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedEvent(null)}>
                  <span className="mr-2">📝</span>
                  Chỉnh Sửa
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedEvent(null)}>
                  <span className="mr-2">📞</span>
                  Liên Hệ
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setSelectedEvent(null)}>
                  <span className="mr-2">❌</span>
                  Hủy Đặt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Chú Thích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: sport.color }} />
                <span className="text-sm">{sport.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
