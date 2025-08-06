import { z } from 'zod';
import { SportType } from '../types';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['player', 'owner']).default('player'),
  phone: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

// Field validation schemas
export const createFieldSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name cannot exceed 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description cannot exceed 1000 characters'),
  sportType: z.enum(['football', 'badminton', 'tennis', 'volleyball', 'basketball', 'pickleball']),
  location: z.object({
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    }),
  }),
  pricing: z.object({
    hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
    currency: z.enum(['VND', 'USD']).default('VND'),
  }),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  amenities: z.array(z.string()).optional(),
  features: z.object({
    lighting: z.boolean().default(false),
    parking: z.boolean().default(false),
    restrooms: z.boolean().default(false),
    equipment: z.boolean().default(false),
  }).optional(),
});

export const updateFieldSchema = createFieldSchema.partial();

export const fieldQuerySchema = z.object({
  city: z.string().optional(),
  sportType: z.enum(['football', 'badminton', 'tennis', 'volleyball', 'basketball', 'pickleball']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radius: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Booking validation schemas
export const createBookingSchema = z.object({
  fieldId: z.string().min(1, 'Field ID is required'),
  date: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date >= new Date();
  }, 'Date must be a valid future date'),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.startTime}:00`);
  const end = new Date(`2000-01-01T${data.endTime}:00`);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const updateBookingSchema = z.object({
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['paid', 'pending', 'failed']).optional(),
  notes: z.string().max(500).optional(),
});

export const bookingQuerySchema = z.object({
  userId: z.string().optional(),
  fieldId: z.string().optional(),
  status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).optional(),
  date: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Review validation schemas
export const createReviewSchema = z.object({
  fieldId: z.string().min(1, 'Field ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment cannot exceed 500 characters'),
  aspects: z.object({
    cleanliness: z.number().min(1).max(5),
    lighting: z.number().min(1).max(5),
    equipment: z.number().min(1).max(5),
    location: z.number().min(1).max(5),
  }).optional(),
});

// Time slot validation
export const timeSlotSchema = z.object({
  date: z.string(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isAvailable: z.boolean(),
  price: z.number().min(0),
});

export const updateAvailabilitySchema = z.object({
  date: z.string(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isAvailable: z.boolean(),
  price: z.number().min(0).optional(),
}); 