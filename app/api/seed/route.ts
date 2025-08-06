import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongoose';
import { seedDatabase } from '../../../lib/data/seedData';

// POST /api/seed - Seed the database with sample data
export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is not allowed in production' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    // Seed the database
    await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 