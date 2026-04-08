// src/app/api/admin/users/pending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/DB/connect';
import { UserModel } from '@/lib/DB/models';
import { verifyAuth, requireAdmin } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await verifyAuth(request);

    if (error) return error;
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    await connectDB();

    const pendingUsers = await UserModel.find({ role: 'pending' }).select(
      '-password'
    );
    return NextResponse.json(
      { success: true, data: pendingUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}