// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/DB/connect';
import { UserModel } from '@/lib/DB/models';
import { verifyAuth, requireAdmin } from '@/lib/middleware/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { action } = await request.json();
    await connectDB();

    if (action === 'approve') {
      const approvedUser = await UserModel.findByIdAndUpdate(
        params.id,
        { role: 'user', approvedAt: new Date(), approvedBy: user._id },
        { new: true }
      ).select('-password');

      if (!approvedUser) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'User approved',
          data: approvedUser,
        },
        { status: 200 }
      );
    } else if (action === 'revoke') {
      const revokedUser = await UserModel.findByIdAndUpdate(
        params.id,
        { role: 'pending', approvedAt: null, approvedBy: null },
        { new: true }
      ).select('-password');

      if (!revokedUser) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: 'User access revoked',
          data: revokedUser,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}