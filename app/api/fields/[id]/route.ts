import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongoose';
import { Field } from '../../../../lib/models/Field';
import { updateFieldSchema } from '../../../../lib/validation/schemas';
import { requireAuth, requireOwner, AuthenticatedRequest } from '../../../../lib/middleware/auth';

// GET /api/fields/[id] - Get specific field
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const field = await Field.findById(params.id)
      .populate('owner', 'name email phone')
      .lean();
    
    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: field,
    });
    
  } catch (error) {
    console.error('Error fetching field:', error);
    return NextResponse.json(
      { error: 'Failed to fetch field' },
      { status: 500 }
    );
  }
}

// PUT /api/fields/[id] - Update field (Owner only)
export async function PUT(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and owner role
    const authResult = await requireOwner(request);
    if (authResult) return authResult;
    
    await connectDB();
    
    // Check if field exists and belongs to the authenticated owner
    const existingField = await Field.findById(params.id);
    if (!existingField) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }
    
    if (existingField.owner.toString() !== request.user._id.toString()) {
      return NextResponse.json(
        { error: 'Access denied. You can only edit your own fields.' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = updateFieldSchema.parse(body);
    
    // Update field
    const updatedField = await Field.findByIdAndUpdate(
      params.id,
      { ...validatedData },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');
    
    return NextResponse.json({
      success: true,
      data: updatedField,
      message: 'Field updated successfully',
    });
    
  } catch (error) {
    console.error('Error updating field:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update field' },
      { status: 500 }
    );
  }
}

// DELETE /api/fields/[id] - Delete field (Owner only)
export async function DELETE(
  request: AuthenticatedRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and owner role
    const authResult = await requireOwner(request);
    if (authResult) return authResult;
    
    await connectDB();
    
    // Check if field exists and belongs to the authenticated owner
    const field = await Field.findById(params.id);
    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }
    
    if (field.owner.toString() !== request.user._id.toString()) {
      return NextResponse.json(
        { error: 'Access denied. You can only delete your own fields.' },
        { status: 403 }
      );
    }
    
    // Soft delete by setting isActive to false
    await Field.findByIdAndUpdate(params.id, { isActive: false });
    
    return NextResponse.json({
      success: true,
      message: 'Field deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting field:', error);
    return NextResponse.json(
      { error: 'Failed to delete field' },
      { status: 500 }
    );
  }
} 