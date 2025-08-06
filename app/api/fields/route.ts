import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose';
import { Field } from '../../../lib/models/Field';
import { User } from '../../../lib/models/User';
import { createFieldSchema, fieldQuerySchema } from '../../../lib/validation/schemas';
import { requireAuth, requireOwner, AuthenticatedRequest } from '../../../lib/middleware/auth';
import { generateTimeSlots } from '../../../lib/utils/generateTimeSlots';

// GET /api/fields - Get all fields with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedQuery = fieldQuerySchema.parse(queryParams);
    
    // Build filter object
    const filter: any = { isActive: true };
    
    if (validatedQuery.city) {
      filter['location.city'] = { $regex: validatedQuery.city, $options: 'i' };
    }
    
    if (validatedQuery.sportType) {
      filter.sportType = validatedQuery.sportType;
    }
    
    if (validatedQuery.minPrice || validatedQuery.maxPrice) {
      filter['pricing.hourlyRate'] = {};
      if (validatedQuery.minPrice) filter['pricing.hourlyRate'].$gte = validatedQuery.minPrice;
      if (validatedQuery.maxPrice) filter['pricing.hourlyRate'].$lte = validatedQuery.maxPrice;
    }
    
    if (validatedQuery.rating) {
      filter.rating = { $gte: validatedQuery.rating };
    }
    
    // Geospatial query if coordinates provided
    if (validatedQuery.lat && validatedQuery.lng && validatedQuery.radius) {
      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [validatedQuery.lng, validatedQuery.lat],
          },
          $maxDistance: validatedQuery.radius * 1000, // Convert km to meters
        },
      };
    }
    
    // Pagination
    const page = validatedQuery.page || 1;
    const limit = validatedQuery.limit || 20;
    const skip = (page - 1) * limit;
    
    // Execute query
    const fields = await Field.find(filter)
      .populate('owner', 'name email')
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Field.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: fields,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching fields:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    );
  }
}

// POST /api/fields - Create new field (Owner only)
export async function POST(request: AuthenticatedRequest) {
  try {
    // Check authentication and owner role
    const authResult = await requireOwner(request);
    if (authResult) return authResult;
    
    await connectDB();
    
    const body = await request.json();
    
    // Validate input
    const validatedData = createFieldSchema.parse(body);
    
    // Generate time slots for the field
    const availability = generateTimeSlots({
      basePrice: validatedData.pricing.hourlyRate,
      priceVariation: validatedData.pricing.hourlyRate * 0.3,
    });
    
    // Create field
    const field = new Field({
      ...validatedData,
      owner: request.user._id,
      availability,
      rating: 0,
      reviewCount: 0,
    });
    
    await field.save();
    
    // Populate owner info
    await field.populate('owner', 'name email');
    
    return NextResponse.json({
      success: true,
      data: field,
      message: 'Field created successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating field:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Field with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create field' },
      { status: 500 }
    );
  }
} 