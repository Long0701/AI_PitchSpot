# MongoDB/Mongoose Setup for PitchSpot

This document outlines the complete MongoDB/Mongoose setup for the PitchSpot application, including models, schemas, API routes, and authentication.

## 📋 Table of Contents

1. [Models & Schemas](#models--schemas)
2. [API Routes](#api-routes)
3. [Authentication & Authorization](#authentication--authorization)
4. [Database Seeding](#database-seeding)
5. [Environment Setup](#environment-setup)
6. [Usage Examples](#usage-examples)

## 🗄️ Models & Schemas

### User Model (`lib/models/User.ts`)

**Features:**
- Role-based authentication (Player/Owner)
- Password hashing with bcrypt
- Email validation
- Phone number validation (Vietnamese format)
- Timestamps and proper indexing

**Schema Fields:**
```typescript
{
  name: string (required, max 100 chars)
  email: string (required, unique, validated)
  password: string (required, min 6 chars, hashed)
  role: UserRole enum ('player' | 'owner')
  phone?: string (Vietnamese format)
  avatar?: string (default: '/placeholder-user.jpg')
  isVerified: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

### Field Model (`lib/models/Field.ts`)

**Features:**
- Geospatial indexing for location-based queries
- Time slot availability management
- Owner reference with population
- Rating and review system
- Amenities and features tracking

**Schema Fields:**
```typescript
{
  name: string (required, max 200 chars)
  description: string (required, max 1000 chars)
  sportType: SportType enum
  location: {
    address: string (required)
    city: string (required)
    coordinates: { lat: number, lng: number }
  }
  pricing: {
    hourlyRate: number (required, min 0)
    currency: string (default: 'VND')
  }
  images: string[]
  amenities: string[]
  rating: number (default: 0, min 0, max 5)
  reviewCount: number (default: 0)
  owner: ObjectId (ref: 'User')
  availability: TimeSlot[]
  features: {
    lighting: boolean
    parking: boolean
    restrooms: boolean
    equipment: boolean
  }
  isActive: boolean (default: true)
}
```

### Booking Model (`lib/models/Booking.ts`)

**Features:**
- Real-time availability checking
- Automatic duration calculation
- Status and payment tracking
- User and field references

**Schema Fields:**
```typescript
{
  user: ObjectId (ref: 'User')
  field: ObjectId (ref: 'Field')
  date: string (required, future date)
  startTime: string (required, HH:MM format)
  endTime: string (required, HH:MM format)
  duration: number (hours, auto-calculated)
  totalCost: number (required, min 0)
  status: BookingStatus enum
  paymentStatus: PaymentStatus enum
  notes?: string (max 500 chars)
}
```

## 🛣️ API Routes

### Fields API

**GET `/api/fields`** - List all fields with filters
- Query parameters: `city`, `sportType`, `minPrice`, `maxPrice`, `rating`, `lat`, `lng`, `radius`
- Supports geospatial queries
- Pagination support
- Populates owner information

**POST `/api/fields`** - Create new field (Owner only)
- Requires authentication and owner role
- Validates input with Zod schema
- Generates time slots automatically
- Returns populated field data

**GET `/api/fields/[id]`** - Get specific field
- Populates owner information
- Returns detailed field data

**PUT `/api/fields/[id]`** - Update field (Owner only)
- Requires authentication and ownership
- Validates input with Zod schema
- Returns updated field data

**DELETE `/api/fields/[id]`** - Delete field (Owner only)
- Soft delete (sets isActive to false)
- Requires authentication and ownership

### Bookings API

**GET `/api/bookings`** - List bookings with filters
- Query parameters: `userId`, `fieldId`, `status`, `date`
- Role-based access (users see only their bookings)
- Pagination support
- Populates user and field information

**POST `/api/bookings`** - Create new booking (Player only)
- Requires authentication and player role
- Validates time slot availability
- Updates field availability automatically
- Calculates total cost and duration

## 🔐 Authentication & Authorization

### Middleware (`lib/middleware/auth.ts`)

**Functions:**
- `authenticateUser()` - Validates authentication token
- `requireAuth()` - Ensures user is authenticated
- `requireRole(role)` - Ensures user has specific role
- `requireOwner()` - Ensures user is an owner
- `requirePlayer()` - Ensures user is a player

**Usage:**
```typescript
// In API routes
const authResult = await requireOwner(request);
if (authResult) return authResult;
```

### Validation (`lib/validation/schemas.ts`)

**Zod Schemas:**
- `createUserSchema` - User registration validation
- `createFieldSchema` - Field creation validation
- `createBookingSchema` - Booking creation validation
- `fieldQuerySchema` - Field search parameters validation
- `bookingQuerySchema` - Booking search parameters validation

## 🌱 Database Seeding

### Seed Data (`lib/data/seedData.ts`)

**Sample Users:**
- 3 Owner accounts
- 2 Player accounts
- All with Vietnamese names and realistic data

**Sample Fields:**
- 9 fields across 3 cities (Đà Nẵng, Hồ Chí Minh, Hà Nội)
- 3 sport types (football, badminton, tennis)
- Realistic pricing and amenities
- Geospatial coordinates for each location

### Seeding Methods

**API Route:** `POST /api/seed`
- Only works in development environment
- Clears existing data and creates fresh sample data

**Script:** `scripts/seed.ts`
- Can be run directly with Node.js
- Useful for initial setup

## ⚙️ Environment Setup

### Required Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/pitchspot
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchspot
```

### Installation

```bash
# Install dependencies
npm install bcryptjs @types/bcryptjs

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Seed the database (development only)
curl -X POST http://localhost:3000/api/seed
```

## 📝 Usage Examples

### Creating a Field (Owner)

```typescript
const fieldData = {
  name: "Sân Bóng Đá Hoàng Sa",
  description: "Sân cỏ nhân tạo hiện đại...",
  sportType: "football",
  location: {
    address: "123 Đường Hoàng Sa, Quận Sơn Trà",
    city: "Đà Nẵng",
    coordinates: { lat: 16.0715, lng: 108.2241 }
  },
  pricing: {
    hourlyRate: 250000,
    currency: "VND"
  },
  amenities: ["Phòng Thay Đồ", "Đèn Chiếu Sáng"],
  features: {
    lighting: true,
    parking: true,
    restrooms: true,
    equipment: true
  }
};

const response = await fetch('/api/fields', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(fieldData)
});
```

### Creating a Booking (Player)

```typescript
const bookingData = {
  fieldId: "field_id_here",
  date: "2024-01-15",
  startTime: "14:00",
  endTime: "16:00",
  notes: "Booking for team practice"
};

const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(bookingData)
});
```

### Searching Fields

```typescript
// Search by city and sport type
const response = await fetch('/api/fields?city=Đà Nẵng&sportType=football');

// Search by location and radius
const response = await fetch('/api/fields?lat=16.0715&lng=108.2241&radius=5');

// Search by price range
const response = await fetch('/api/fields?minPrice=100000&maxPrice=300000');
```

## 🔧 Helper Functions

### Time Slot Generation (`lib/utils/generateTimeSlots.ts`)

**Functions:**
- `generateTimeSlots(options)` - Creates time slots with configurable parameters
- `generateTimeSlotsForField(fieldId, options)` - Field-specific time slot generation
- `updateTimeSlotAvailability(slots, date, startTime, endTime, isAvailable)` - Updates availability

**Options:**
```typescript
{
  startHour?: number (default: 8)
  endHour?: number (default: 22)
  daysAhead?: number (default: 14)
  basePrice?: number (default: 100000)
  priceVariation?: number (default: 50000)
  availabilityRate?: number (default: 0.7)
}
```

## 🚀 Getting Started

1. **Set up MongoDB connection**
   ```bash
   # Add to .env.local
   MONGODB_URI=your_mongodb_connection_string
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database**
   ```bash
   # Development only
   curl -X POST http://localhost:3000/api/seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 Database Indexes

### User Collection
- `email` (unique)
- `role`
- `createdAt` (descending)

### Field Collection
- `location.coordinates` (2dsphere for geospatial queries)
- `location.city`
- `sportType`
- `owner`
- `rating` (descending)
- `isActive`
- `createdAt` (descending)
- Compound indexes for common queries

### Booking Collection
- `user`
- `field`
- `date`
- `status`
- `paymentStatus`
- `createdAt` (descending)
- Compound indexes for user/field queries

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- Input validation with Zod schemas
- Role-based access control
- Authentication middleware
- Soft deletes for data integrity
- Geospatial validation for coordinates

## 📈 Performance Optimizations

- Proper indexing for common queries
- Geospatial indexes for location searches
- Compound indexes for multi-field queries
- Population of related data
- Pagination support
- Lean queries for read operations

## 🧪 Testing

The setup includes comprehensive validation and error handling:

- Input validation with detailed error messages
- Database constraint validation
- Authentication and authorization checks
- Proper HTTP status codes
- Error logging for debugging

This MongoDB/Mongoose setup provides a robust foundation for the PitchSpot application with real-time field availability, user management, and booking system capabilities. 