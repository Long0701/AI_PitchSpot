export enum BookingStatus {
  Confirmed = "confirmed",
  Pending = "pending",
  Cancelled = "cancelled",
  Completed = "completed",
}

export enum PaymentStatus {
  Paid = "paid",
  Pending = "pending",
  Failed = "failed",
}

export enum UserRole {
  Player = "player",
  Owner = "owner",
}

export interface CourtTypeCount {
  footballType: "5" | "7" | "11" | "futsal"
  count: number
  hourlyRate: number
}

export interface Court {
  id: string
  name: string
  description: string
  sportType: SportType
  courtTypes?: CourtTypeCount[] // danh sách các loại sân và số lượng tương ứng (chỉ dành cho football)
  location: {
    lat: number
    lng: number
    address: string
    city: string
  }
  pricing: {
    hourlyRate: number
    currency: string
    ratesByFootballType?: Record<"5" | "7" | "11", number> // nếu muốn giá theo từng loại sân
  }
  images: string[]
  amenities: string[]
  rating: number
  reviewCount: number
  ownerId: string
  availability: TimeSlot[]
  features: {
    lighting: boolean
    parking: boolean
    restrooms: boolean
    equipment: boolean
  }
}

export interface TimeSlot {
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  price: number
}

export interface Booking {
  id: string
  courtId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  createdAt: string
  court?: Court
}

export interface Review {
  id: string
  courtId: string
  userId: string
  userName: string
  rating: number
  comment: string
  aspects: {
    cleanliness: number
    lighting: number
    equipment: number
    location: number
  }
  createdAt: string
  userAvatar?: string
}

export interface WeatherData {
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    icon: string
  }
  forecast: {
    time: string
    temperature: number
    condition: string
    precipitation: number
    icon: string
  }[]
}

export type SportType = "football" | "badminton" | "tennis" | "volleyball" | "basketball" | "pickleball"

export interface SportConfig {
  name: string
  icon: string
  color: string
  variants?: string[]
}

export const SPORTS_CONFIG: Record<SportType, SportConfig> = {
  football: {
    name: "Bóng Đá",
    icon: "⚽",
    color: "#22c55e",
    variants: ["5v5", "7v7", "11v11"],
  },
  badminton: {
    name: "Cầu Lông",
    icon: "🏸",
    color: "#3b82f6",
  },
  tennis: {
    name: "Quần Vợt",
    icon: "🎾",
    color: "#f59e0b",
  },
  volleyball: {
    name: "Bóng Chuyền",
    icon: "🏐",
    color: "#ef4444",
  },
  basketball: {
    name: "Bóng Rổ",
    icon: "🏀",
    color: "#8b5cf6",
  },
  pickleball: {
    name: "Pickleball",
    icon: "🏓",
    color: "#06b6d4",
  },
}
