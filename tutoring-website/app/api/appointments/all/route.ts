// src/app/api/appointments/all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/DB/connect';
import { AppointmentModel } from '@/lib/DB/models';
import { verifyAuth, requireAccess } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await verifyAuth(request);

    if (error) return error;
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accessError = requireAccess(user);
    if (accessError) return accessError;

    await connectDB();

    const appointments = await AppointmentModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: 'All appointments retrieved successfully',
        data: {
          count: appointments.length,
          appointments: appointments.map((apt: any) => ({
            id: apt._id.toString(),
            fullName: apt.fullName,
            email: apt.email,
            phoneNumber: apt.phoneNumber,
            chapters: apt.chapters,
            createdAt: apt.createdAt || null,
            updatedAt: apt.updatedAt || null,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}