import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose';
import { Booking } from '../../../lib/models/Booking';
import { Field } from '../../../lib/models/Field';
import { createBookingSchema, bookingQuerySchema } from '../../../lib/validation/schemas';
import { requireAuth, requirePlayer, AuthenticatedRequest } from '../../../lib/middleware/auth';

// GET /api/bookings - Get bookings with filters
export async function GET(request: AuthenticatedRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult) return authResult;
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedQuery = bookingQuerySchema.parse(queryParams);
    
    // Build filter object
    const filter: any = {};
    
    // If user is not admin, only show their bookings
    if (request.user.role !== 'admin') {
      filter.user = request.user._id;
    } else if (validatedQuery.userId) {
      filter.user = validatedQuery.userId;
    }
    
    if (validatedQuery.fieldId) {
      filter.field = validatedQuery.fieldId;
    }
    
    if (validatedQuery.status) {
      filter.status = validatedQuery.status;
    }
    
    if (validatedQuery.date) {
      filter.date = validatedQuery.date;
    }
    
    // Pagination
    const page = validatedQuery.page || 1;
    const limit = validatedQuery.limit || 20;
    const skip = (page - 1) * limit;
    
    // Execute query
    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('field', 'name sportType location pricing')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Booking.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking (Player only)
export async function POST(request: AuthenticatedRequest) {
  try {
    // Check authentication and player role
    const authResult = await requirePlayer(request);
    if (authResult) return authResult;
    
    await connectDB();
    
    const body = await request.json();
    
    // Validate input
    const validatedData = createBookingSchema.parse(body);
    
    // Check if field exists and is active
    const field = await Field.findById(validatedData.fieldId);
    if (!field || !field.isActive) {
      return NextResponse.json(
        { error: 'Field not found or inactive' },
        { status: 404 }
      );
    }
    
    // Check if the requested time slot is available
    const requestedDate = validatedData.date;
    const requestedStartTime = validatedData.startTime;
    const requestedEndTime = validatedData.endTime;
    
    // Find the time slots for the requested date
    const availableSlots = field.availability.filter(slot => 
      slot.date === requestedDate &&
      slot.isAvailable &&
      slot.startTime >= requestedStartTime &&
      slot.endTime <= requestedEndTime
    );
    
    // Check if all required slots are available
    const requiredSlots = [];
    const startHour = parseInt(requestedStartTime.split(':')[0]);
    const endHour = parseInt(requestedEndTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const nextHour = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      const slot = field.availability.find(s => 
        s.date === requestedDate &&
        s.startTime === timeSlot &&
        s.endTime === nextHour &&
        s.isAvailable
      );
      
      if (!slot) {
        return NextResponse.json(
          { error: `Time slot ${timeSlot}-${nextHour} is not available` },
          { status: 400 }
        );
      }
      
      requiredSlots.push(slot);
    }
    
    // Calculate total cost
    const totalCost = requiredSlots.reduce((sum, slot) => sum + slot.price, 0);
    
    // Calculate duration
    const start = new Date(`2000-01-01T${requestedStartTime}:00`);
    const end = new Date(`2000-01-01T${requestedEndTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    // Create booking
    const booking = new Booking({
      user: request.user._id,
      field: field._id,
      date: requestedDate,
      startTime: requestedStartTime,
      endTime: requestedEndTime,
      duration,
      totalCost,
      notes: validatedData.notes,
    });
    
    await booking.save();
    
    // Update field availability - mark slots as unavailable
    const updatedAvailability = field.availability.map(slot => {
      if (slot.date === requestedDate &&
          slot.startTime >= requestedStartTime &&
          slot.endTime <= requestedEndTime) {
        return { ...slot, isAvailable: false };
      }
      return slot;
    });
    
    await Field.findByIdAndUpdate(field._id, {
      availability: updatedAvailability,
    });
    
    // Populate related data
    await booking.populate('user', 'name email');
    await booking.populate('field', 'name sportType location pricing');
    
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 