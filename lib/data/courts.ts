import { type Court, type SportType } from "../types"

function generateTimeSlots() {
  const slots = []
  const today = new Date()

  for (let day = 0; day < 14; day++) {
    const date = new Date(today)
    date.setDate(today.getDate() + day)
    const dateStr = date.toISOString().split("T")[0]

    for (let hour = 8; hour < 22; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`
      const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`

      slots.push({
        date: dateStr,
        startTime,
        endTime,
        isAvailable: Math.random() > 0.3, // 70% availability
        price: 100000 + Math.floor(Math.random() * 100000), // 100k-200k VND
      })
    }
  }

  return slots
}

export const courtsData: Court[] = [
  {
    id: "1",
    name: "Sân Bóng Đá Hoàng Sa",
    description: "Sân cỏ nhân tạo hiện đại, phù hợp tổ chức giải đấu mini và tập luyện thường xuyên.",
    sportType: "football",
    location: {
      lat: 16.0715,
      lng: 108.2241,
      address: "123 Đường Hoàng Sa",
      city: "Đà Nẵng",
    },
    pricing: {
      hourlyRate: 250000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Hoàng+Sa",
      "/placeholder.svg?height=300&width=400&text=Toàn+Cảnh+Sân",
    ],
    amenities: ["Phòng Thay Đồ", "Đèn Chiếu Sáng", "Bãi Đỗ Xe", "Nhà Vệ Sinh"],
    rating: 4.6,
    reviewCount: 87,
    ownerId: "owner1",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    id: "2",
    name: "Sân Cầu Lông Nguyễn Văn Linh",
    description: "Sân cầu lông trong nhà đạt chuẩn thi đấu, có mái che và sàn gỗ chuyên dụng.",
    sportType: "badminton",
    location: {
      lat: 16.0471,
      lng: 108.2103,
      address: "456 Nguyễn Văn Linh",
      city: "Đà Nẵng",
    },
    pricing: {
      hourlyRate: 100000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+2",
    ],
    amenities: ["Máy Lạnh", "Phòng Thay Đồ", "Nhà Vệ Sinh", "Quầy Đồ Uống"],
    rating: 4.4,
    reviewCount: 63,
    ownerId: "owner2",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: false,
      restrooms: true,
      equipment: true,
    },
  },
  {
    id: "3",
    name: "Câu Lạc Bộ Tennis Đà Nẵng",
    description: "Sân tennis ngoài trời với mặt sân đất sét chuyên nghiệp và tầm nhìn thành phố tuyệt đẹp.",
    sportType: "tennis",
    location: {
      lat: 16.0544,
      lng: 108.2022,
      address: "789 Đại Lộ Tennis",
      city: "Đà Nẵng",
    },
    pricing: {
      hourlyRate: 150000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Tennis+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Tennis+2",
    ],
    amenities: ["Cửa Hàng Dụng Cụ", "Có Huấn Luyện Viên", "Bãi Đỗ Xe", "Nhà Vệ Sinh"],
    rating: 4.7,
    reviewCount: 156,
    ownerId: "owner3",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: false,
    },
  }
]


export function getCourtsByLocation(lat: number, lng: number, radius = 10) {
  return courtsData.filter((court) => {
    const distance = calculateDistance(lat, lng, court.location.lat, court.location.lng)
    return distance <= radius
  })
}

export function getCourtsBySport(sportType: SportType) {
  return courtsData.filter((court) => court.sportType === sportType)
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
} 