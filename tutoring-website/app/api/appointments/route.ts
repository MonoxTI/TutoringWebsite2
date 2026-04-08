// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/DB/connect';
import { AppointmentModel } from '@/lib/DB/models';
import { verifyAuth, requireAccess } from '@/lib/middleware/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST - Create appointment
export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phoneNumber, chapters } = await request.json();

    // Validate required fields
    if (!fullName?.trim() || !email?.trim() || !phoneNumber || !chapters?.trim()) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone
    const phoneNumberClean = String(phoneNumber).replace(/\D/g, '');
    if (phoneNumberClean.length < 9 || phoneNumberClean.length > 15) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      );
    }

    await connectDB();

    const newAppointment = new AppointmentModel({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumberClean,
      chapters: chapters.trim(),
    });

    const savedAppointment = await newAppointment.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment created successfully',
        data: {
          id: savedAppointment._id.toString(),
          fullName: savedAppointment.fullName,
          email: savedAppointment.email,
          phoneNumber: savedAppointment.phoneNumber,
          chapters: savedAppointment.chapters,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Appointment creation error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: Object.values(error.errors).map((e: any) => e.message),
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Duplicate entry',
          error: error.keyValue,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Server error occurred while creating appointment',
      },
      { status: 500 }
    );
  }
}

// GET - Get all appointments
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

    const accessError = requireAccess(user);
    if (accessError) return accessError;

    await connectDB();

    const appointments = await AppointmentModel.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'All appointments retrieved successfully',
        data: {
          count: appointments.length,
          appointments: appointments.map((apt) => ({
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

// DELETE - Delete all appointments
export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await verifyAuth(request);

    if (error) return error;
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accessError = requireAccess(user);
    if (accessError) return accessError;

    await connectDB();
    await AppointmentModel.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        message: 'All appointments deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Error deleting appointments',
        error: error.message,
      },
      { status: 500 }
    );
  }
}