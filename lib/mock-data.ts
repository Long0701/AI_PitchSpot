import {
  type Court,
  type Booking,
  type Review,
  type WeatherData,
  type SportType,
  BookingStatus,
  PaymentStatus,
} from "./types"

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

export const mockCourts: Court[] = [
  {
    id: "1",
    name: "Sân Thể Thao Trung Tâm",
    description: "Cơ sở thể thao trong nhà cao cấp với thiết bị hiện đại và hệ thống chiếu sáng chuyên nghiệp.",
    sportType: "football",
    location: {
      lat: 21.0285,
      lng: 105.8542,
      address: "123 Đường Thể Thao",
      city: "Hà Nội",
    },
    pricing: {
      hourlyRate: 200000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Đá+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Đá+2",
    ],
    amenities: ["Bãi Đỗ Xe", "Nhà Vệ Sinh", "Cho Thuê Thiết Bị", "Phòng Thay Đồ"],
    rating: 4.8,
    reviewCount: 124,
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
    name: "Trung Tâm Cầu Lông Elite",
    description: "Sân cầu lông chuyên nghiệp với sàn gỗ và hệ thống thông gió tuyệt vời.",
    sportType: "badminton",
    location: {
      lat: 10.7769,
      lng: 106.7009,
      address: "456 Đường Vợt",
      city: "Hồ Chí Minh",
    },
    pricing: {
      hourlyRate: 120000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Cầu+Lông+2",
    ],
    amenities: ["Điều Hòa", "Cho Thuê Thiết Bị", "Bãi Đỗ Xe"],
    rating: 4.6,
    reviewCount: 89,
    ownerId: "owner2",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: true,
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
  },
  {
    id: "4",
    name: "Sân Bóng Rổ Cần Thơ",
    description: "Sân bóng rổ trong nhà với sàn gỗ cứng chuyên nghiệp và rổ có thể điều chỉnh.",
    sportType: "basketball",
    location: {
      lat: 10.0452,
      lng: 105.7469,
      address: "321 Đường Rổ",
      city: "Cần Thơ",
    },
    pricing: {
      hourlyRate: 180000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Rổ+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Rổ+2",
    ],
    amenities: ["Bảng Điểm", "Hệ Thống Âm Thanh", "Bãi Đỗ Xe", "Phòng Thay Đồ"],
    rating: 4.9,
    reviewCount: 203,
    ownerId: "owner4",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    id: "5",
    name: "Sân Bóng Chuyền Biển Nha Trang",
    description: "Sân bóng chuyền bãi biển với cát nhập khẩu và lưới chuyên nghiệp.",
    sportType: "volleyball",
    location: {
      lat: 12.2388,
      lng: 109.1967,
      address: "654 Đường Biển",
      city: "Nha Trang",
    },
    pricing: {
      hourlyRate: 140000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Chuyền+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Bóng+Chuyền+2",
    ],
    amenities: ["Khung Cảnh Biển", "Cho Thuê Thiết Bị", "Quầy Ăn Vặt", "Bãi Đỗ Xe"],
    rating: 4.5,
    reviewCount: 78,
    ownerId: "owner5",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
  {
    id: "6",
    name: "Trung Tâm Pickleball Hải Phòng",
    description: "Sân pickleball hiện đại với kích thước tiêu chuẩn và bề mặt cao cấp.",
    sportType: "pickleball",
    location: {
      lat: 20.8449,
      lng: 106.6881,
      address: "987 Đường Paddle",
      city: "Hải Phòng",
    },
    pricing: {
      hourlyRate: 100000,
      currency: "VND",
    },
    images: [
      "/placeholder.svg?height=300&width=400&text=Sân+Pickleball+1",
      "/placeholder.svg?height=300&width=400&text=Sân+Pickleball+2",
    ],
    amenities: ["Cho Thuê Thiết Bị", "Có Lớp Học", "Bãi Đỗ Xe", "Nhà Vệ Sinh"],
    rating: 4.4,
    reviewCount: 92,
    ownerId: "owner6",
    availability: generateTimeSlots(),
    features: {
      lighting: true,
      parking: true,
      restrooms: true,
      equipment: true,
    },
  },
]

export const mockBookings: Booking[] = [
  {
    id: "booking1",
    courtId: "1",
    userId: "user1",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "16:00",
    totalPrice: 400000,
    status: BookingStatus.Confirmed,
    paymentStatus: PaymentStatus.Paid,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "booking2",
    courtId: "2",
    userId: "user1",
    date: "2024-01-18",
    startTime: "18:00",
    endTime: "19:00",
    totalPrice: 120000,
    status: BookingStatus.Pending,
    paymentStatus: PaymentStatus.Pending,
    createdAt: "2024-01-12T15:30:00Z",
  },
  {
    id: "booking3",
    courtId: "1",
    userId: "user2",
    date: "2024-01-16",
    startTime: "10:00",
    endTime: "11:00",
    totalPrice: 200000,
    status: BookingStatus.Completed,
    paymentStatus: PaymentStatus.Paid,
    createdAt: "2024-01-11T09:00:00Z",
  },
  {
    id: "booking4",
    courtId: "3",
    userId: "user1",
    date: "2024-01-20",
    startTime: "09:00",
    endTime: "10:00",
    totalPrice: 150000,
    status: BookingStatus.Confirmed,
    paymentStatus: PaymentStatus.Paid,
    createdAt: "2024-01-14T11:00:00Z",
  },
  {
    id: "booking5",
    courtId: "4",
    userId: "user3",
    date: "2024-01-22",
    startTime: "19:00",
    endTime: "21:00",
    totalPrice: 360000,
    status: BookingStatus.Pending,
    paymentStatus: PaymentStatus.Pending,
    createdAt: "2024-01-15T16:00:00Z",
  },
]

export const mockReviews: Review[] = [
  {
    id: "review1",
    courtId: "1",
    userId: "user1",
    userName: "Nguyễn Văn A",
    rating: 5,
    comment: "Cơ sở vật chất tuyệt vời với ánh sáng tốt và phòng thay đồ sạch sẽ. Nhân viên rất nhiệt tình!",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 4,
      location: 5,
    },
    createdAt: "2024-01-10T10:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "review2",
    courtId: "1",
    userId: "user2",
    userName: "Trần Thị B",
    rating: 4,
    comment: "Sân tốt nhưng chỗ đậu xe có thể khó khăn vào giờ cao điểm.",
    aspects: {
      cleanliness: 4,
      lighting: 5,
      equipment: 4,
      location: 3,
    },
    createdAt: "2024-01-08T14:30:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: "review3",
    courtId: "2",
    userId: "user3",
    userName: "Lê Văn C",
    rating: 5,
    comment: "Sân cầu lông rất chuyên nghiệp, sàn gỗ êm ái và không khí trong lành.",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 5,
      location: 4,
    },
    createdAt: "2024-01-11T09:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=le",
  },
  {
    id: "review4",
    courtId: "3",
    userId: "user1",
    userName: "Nguyễn Văn A",
    rating: 4,
    comment: "Sân tennis ngoài trời đẹp, nhưng hơi nắng vào buổi trưa.",
    aspects: {
      cleanliness: 4,
      lighting: 3,
      equipment: 4,
      location: 5,
    },
    createdAt: "2024-01-15T10:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
]

export const mockWeatherData: WeatherData = {
  current: {
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 8,
    icon: "⛅",
  },
  forecast: [
    {
      time: "14:00",
      temperature: 24,
      condition: "Sunny",
      precipitation: 0,
      icon: "☀️",
    },
    {
      time: "15:00",
      temperature: 25,
      condition: "Sunny",
      precipitation: 0,
      icon: "☀️",
    },
    {
      time: "16:00",
      temperature: 24,
      condition: "Partly Cloudy",
      precipitation: 10,
      icon: "⛅",
    },
    {
      time: "17:00",
      temperature: 23,
      condition: "Cloudy",
      precipitation: 20,
      icon: "☁️",
    },
    {
      time: "18:00",
      temperature: 21,
      condition: "Light Rain",
      precipitation: 60,
      icon: "🌦️",
    },
  ],
}

export function getCourtsByLocation(lat: number, lng: number, radius = 10) {
  return mockCourts.filter((court) => {
    const distance = calculateDistance(lat, lng, court.location.lat, court.location.lng)
    return distance <= radius
  })
}

export function getCourtsBySport(sportType: SportType) {
  return mockCourts.filter((court) => court.sportType === sportType)
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
