import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole } from '../models/User';
import { connectDB } from '../mongoose';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export async function authenticateUser(request: NextRequest): Promise<NextResponse | null> {
  try {
    await connectDB();
    
    // Get token from headers (you can modify this based on your auth strategy)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // For now, we'll use a simple token validation
    // In production, you should use JWT or session-based auth
    // This is a placeholder - replace with your actual auth logic
    const user = await User.findOne({ _id: token }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    return null; // Continue to next middleware
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function requireAuth(request: AuthenticatedRequest): Promise<NextResponse | null> {
  const authResult = await authenticateUser(request);
  if (authResult) return authResult;
  
  // Add user to request object for downstream handlers
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.substring(7);
  const user = await User.findOne({ _id: token }).select('-password');
  request.user = user;
  
  return null;
}

export async function requireRole(role: UserRole) {
  return async (request: AuthenticatedRequest): Promise<NextResponse | null> => {
    const authResult = await requireAuth(request);
    if (authResult) return authResult;
    
    if (request.user?.role !== role) {
      return NextResponse.json(
        { error: `Access denied. ${role} role required.` },
        { status: 403 }
      );
    }
    
    return null;
  };
}

export async function requireOwner(request: AuthenticatedRequest): Promise<NextResponse | null> {
  return requireRole(UserRole.Owner)(request);
}

export async function requirePlayer(request: AuthenticatedRequest): Promise<NextResponse | null> {
  return requireRole(UserRole.Player)(request);
}

// Helper function to get user from request
export function getUserFromRequest(request: AuthenticatedRequest) {
  return request.user;
} 