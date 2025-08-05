"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG, type SportType } from "@/lib/types"
import { CourtCard } from "@/components/court-card"
import { BookingModal } from "@/components/booking-modal"
import { Search, Filter } from "lucide-react"

export function CourtSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState<SportType | "all">("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [selectedCourtIdForBooking, setSelectedCourtIdForBooking] = useState<string | null>(null)

  const cities = Array.from(new Set(mockCourts.map((court) => court.location.city)))

  const filteredCourts = useMemo(() => {
    return mockCourts.filter((court) => {
      const matchesSearch =
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSport = selectedSport === "all" || court.sportType === selectedSport
      const matchesCity = selectedCity === "all" || court.location.city === selectedCity
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && court.pricing.hourlyRate < 120000) ||
        (priceRange === "medium" && court.pricing.hourlyRate >= 120000 && court.pricing.hourlyRate < 180000) ||
        (priceRange === "high" && court.pricing.hourlyRate >= 180000)

      return matchesSearch && matchesSport && matchesCity && matchesPrice
    })
  }, [searchQuery, selectedSport, selectedCity, priceRange])

  return (
    <div className="w-full space-y-6">
      {/* Search and Filters */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Tìm Kiếm Sân</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm sân theo tên hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4 w-full">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Loại Thể Thao</label>
              <Select value={selectedSport} onValueChange={(value) => setSelectedSport(value as SportType | "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất Cả Môn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Môn</SelectItem>
                  {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <span>{sport.icon}</span>
                        <span>{sport.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Thành Phố</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất Cả Thành Phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Thành Phố</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Khoảng Giá</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất Cả Giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Giá</SelectItem>
                  <SelectItem value="low">Dưới 120.000đ/giờ</SelectItem>
                  <SelectItem value="medium">120.000đ - 180.000đ/giờ</SelectItem>
                  <SelectItem value="high">Trên 180.000đ/giờ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end w-full">
              <Button variant="outline" className="w-full bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Bộ Lọc Khác
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sports Filter Pills */}
      <div className="flex flex-wrap gap-2 w-full">
        <Button
          variant={selectedSport === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedSport("all")}
        >
          Tất Cả Môn
        </Button>
        {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
          <Button
            key={key}
            variant={selectedSport === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSport(key as SportType)}
            className="flex items-center space-x-1"
          >
            <span>{sport.icon}</span>
            <span>{sport.name}</span>
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold">Tìm thấy {filteredCourts.length} sân</h2>
        <Select defaultValue="rating">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Đánh Giá Cao Nhất</SelectItem>
            <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
            <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
            <SelectItem value="distance">Gần Nhất Trước</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Court Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredCourts.map((court) => (
          <CourtCard key={court.id} court={court} onBook={() => setSelectedCourtIdForBooking(court.id)} />
        ))}
      </div>

      {filteredCourts.length === 0 && (
        <Card className="w-full">
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sân</h3>
            <p className="text-gray-600">Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Modal */}
      {selectedCourtIdForBooking && (
        <BookingModal
          courtId={selectedCourtIdForBooking}
          isOpen={!!selectedCourtIdForBooking}
          onClose={() => setSelectedCourtIdForBooking(null)}
        />
      )}
    </div>
  )
}
