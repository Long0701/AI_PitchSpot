# SmartSport API Documentation

## Overview
This document describes the API endpoints created for the SmartSport sports court booking platform.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. GET /api/courts
Returns a list of all courts with optional filtering.

**Query Parameters:**
- `search` (optional): Search by court name, address, or city
- `sport` (optional): Filter by sport type

**Example Requests:**
```bash
# Get all courts
curl http://localhost:3000/api/courts

# Search for courts
curl "http://localhost:3000/api/courts?search=Elite"

# Filter by sport
curl "http://localhost:3000/api/courts?sport=football"

# Combined search and filter
curl "http://localhost:3000/api/courts?search=Hà Nội&sport=football"
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Sân Thể Thao Trung Tâm",
      "address": "123 Đường Thể Thao",
      "sport": "football",
      "lat": 21.0285,
      "lng": 105.8542,
      "price": 200000,
      "rating": 4.8,
      "reviewCount": 124,
      "tags": ["Bãi Đỗ Xe", "Nhà Vệ Sinh", "Cho Thuê Thiết Bị", "Phòng Thay Đồ"],
      "description": "Cơ sở thể thao trong nhà cao cấp với thiết bị hiện đại và hệ thống chiếu sáng chuyên nghiệp.",
      "city": "Hà Nội",
      "currency": "VND",
      "images": ["/placeholder.svg?height=300&width=400&text=Sân+Bóng+Đá+1"],
      "features": {
        "lighting": true,
        "parking": true,
        "restrooms": true,
        "equipment": true
      }
    }
  ],
  "total": 1
}
```

### 2. GET /api/courts/:id
Returns detailed information for a specific court.

**Path Parameters:**
- `id`: Court ID

**Example Request:**
```bash
curl http://localhost:3000/api/courts/1
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Sân Thể Thao Trung Tâm",
    "address": "123 Đường Thể Thao",
    "sport": "football",
    "lat": 21.0285,
    "lng": 105.8542,
    "price": 200000,
    "rating": 4.8,
    "reviewCount": 124,
    "tags": ["Bãi Đỗ Xe", "Nhà Vệ Sinh", "Cho Thuê Thiết Bị", "Phòng Thay Đồ"],
    "description": "Cơ sở thể thao trong nhà cao cấp với thiết bị hiện đại và hệ thống chiếu sáng chuyên nghiệp.",
    "city": "Hà Nội",
    "currency": "VND",
    "images": ["/placeholder.svg?height=300&width=400&text=Sân+Bóng+Đá+1"],
    "features": {
      "lighting": true,
      "parking": true,
      "restrooms": true,
      "equipment": true
    },
    "availability": [
      {
        "date": "2025-08-05",
        "startTime": "08:00",
        "endTime": "09:00",
        "isAvailable": true,
        "price": 184626
      }
    ],
    "ownerId": "owner1"
  }
}
```

### 3. GET /api/courts/:id/reviews
Returns paginated reviews for a specific court.

**Path Parameters:**
- `id`: Court ID

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of reviews per page (default: 10)

**Example Request:**
```bash
curl "http://localhost:3000/api/courts/1/reviews?page=1&pageSize=5"
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "review1",
      "courtId": "1",
      "userId": "user1",
      "userName": "Nguyễn Văn A",
      "rating": 5,
      "comment": "Cơ sở vật chất tuyệt vời với ánh sáng tốt và phòng thay đồ sạch sẽ. Nhân viên rất nhiệt tình!",
      "aspects": {
        "cleanliness": 5,
        "lighting": 5,
        "equipment": 4,
        "location": 5
      },
      "createdAt": "2024-01-10T10:00:00Z",
      "userAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 5,
    "total": 124,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 4. GET /api/sports
Returns the list of supported sport types.

**Example Request:**
```bash
curl http://localhost:3000/api/sports
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": "football",
      "name": "Bóng Đá",
      "icon": "⚽",
      "color": "#22c55e",
      "variants": ["5v5", "7v7", "11v11"]
    },
    {
      "id": "badminton",
      "name": "Cầu Lông",
      "icon": "🏸",
      "color": "#3b82f6",
      "variants": []
    }
  ]
}
```

## Data Structure

### Court Object
```typescript
{
  id: string
  name: string
  address: string
  sport: SportType
  lat: number
  lng: number
  price: number
  rating: number
  reviewCount: number
  tags: string[]
  description: string
  city: string
  currency: string
  images: string[]
  features: {
    lighting: boolean
    parking: boolean
    restrooms: boolean
    equipment: boolean
  }
  availability?: TimeSlot[]
  ownerId?: string
}
```

### Review Object
```typescript
{
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
```

### TimeSlot Object
```typescript
{
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  price: number
}
```

## Sport Types
- `football`: Bóng Đá
- `badminton`: Cầu Lông
- `tennis`: Quần Vợt
- `volleyball`: Bóng Chuyền
- `basketball`: Bóng Rổ
- `pickleball`: Pickleball

## Error Responses
All endpoints return error responses in the following format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `404`: Court not found
- `500`: Internal server error 