// src/app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/DB/connect';
import {
  AppointmentModel,
  AppointmentDetailsModel,
} from '@/lib/DB/models';
import { verifyAuth, requireAccess } from '@/lib/middleware/auth';

// GET - Retrieve appointment details by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const appointment = await AppointmentModel.findById(params.id).lean();

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    const paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment details retrieved successfully',
        data: {
          appointment: {
            id: appointment._id.toString(),
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            chapters: appointment.chapters,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
          },
          paymentDetails: paymentDetails
            ? {
                id: paymentDetails._id.toString(),
                paymentStatus: paymentDetails.PaymentStatus,
                transactionId: paymentDetails.TransactionID,
                amountPaid: paymentDetails.AmountPaid,
                invoiceNumber: paymentDetails.invoiceNumber,
                note: paymentDetails.Note,
                createdAt: paymentDetails.createdAt,
                updatedAt: paymentDetails.updatedAt,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Get appointment details by full name
export async function POST(request: NextRequest) {
  try {
    const { fullName } = await request.json();

    if (!fullName || fullName.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full name is required',
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Case-insensitive search
    const appointment = await AppointmentModel.findOne({
      fullName: { $regex: `^${fullName.trim()}$`, $options: 'i' },
    }).lean();

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }

    const paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment details retrieved successfully',
        data: {
          appointment: {
            id: appointment._id.toString(),
            fullName: appointment.fullName,
            email: appointment.email,
            phoneNumber: appointment.phoneNumber,
            chapters: appointment.chapters,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
          },
          paymentDetails: paymentDetails
            ? {
                id: paymentDetails._id.toString(),
                paymentStatus: paymentDetails.PaymentStatus,
                transactionId: paymentDetails.TransactionID,
                amountPaid: paymentDetails.AmountPaid,
                invoiceNumber: paymentDetails.invoiceNumber,
                note: paymentDetails.Note,
                createdAt: paymentDetails.createdAt,
                updatedAt: paymentDetails.updatedAt,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const appointment = await AppointmentModel.findByIdAndDelete(params.id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Also delete associated payment details
    await AppointmentDetailsModel.deleteOne({
      appointmentId: appointment._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}