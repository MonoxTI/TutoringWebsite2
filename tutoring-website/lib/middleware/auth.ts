// src/lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../DB/connect';
import { UserModel } from '../DB/models';
import { IUser, JWTPayload } from '../types';

export async function verifyAuth(
  request: NextRequest
): Promise<{ user: IUser | null; error: NextResponse | null }> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: NextResponse.json(
          { message: 'No token provided' },
          { status: 401 }
        ),
      };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ''
    ) as JWTPayload;

    await connectDB();
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { message: 'User not found' },
          { status: 401 }
        ),
      };
    }

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }
}

export function requireAccess(user: IUser): NextResponse | null {
  if (!user.hasAccess()) {
    return NextResponse.json(
      { message: 'Your account is pending admin approval' },
      { status: 403 }
    );
  }
  return null;
}

export function requireAdmin(user: IUser): NextResponse | null {
  if (!user.isAdmin()) {
    return NextResponse.json(
      { message: 'Admin access required' },
      { status: 403 }
    );
  }
  return null;
}