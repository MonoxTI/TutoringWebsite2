// src/app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { connectDB } from '@/lib/db/connect';
import {
  AppointmentModel,
  AppointmentDetailsModel,
} from '@/lib/db/models';
import { verifyAuth, requireAccess } from '@/lib/middleware/auth';
import { emailService } from '@/lib/email/service';

const escapeRegex = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function POST(request: NextRequest) {
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

    const { fullName, PaymentStatus, AmountPaid, Note } =
      await request.json();

    const normalizedStatus = PaymentStatus
      ? PaymentStatus.toLowerCase().trim()
      : 'unpaid';

    const validStatuses = ['unpaid', 'partial', 'paid'];

    // ─── Validation ──────────────────────────────────────
    if (!fullName || fullName.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full name is required (min 3 characters)',
        },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Parse and validate amount safely
    const amount =
      normalizedStatus !== 'unpaid' ? parseFloat(AmountPaid) : null;
    if (
      normalizedStatus !== 'unpaid' &&
      (!AmountPaid || isNaN(amount) || (amount && amount <= 0))
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Amount must be a valid number greater than zero for partial or paid status',
        },
        { status: 400 }
      );
    }

    await connectDB();

    // ─── Find Appointment (safe regex) ─────────────────
    const appointment = await AppointmentModel.findOne({
      fullName: {
        $regex: `^${escapeRegex(fullName.trim())}$`,
        $options: 'i',
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // ─── Find or Initialize Payment Details ────────────
    let paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id,
    });

    const previousStatus = paymentDetails?.PaymentStatus?.toLowerCase() || 'unpaid';
    const becamePaid =
      normalizedStatus === 'paid' && previousStatus !== 'paid';

    // ─── Generate secure IDs only on transition to PAID ─
    const transactionId = becamePaid
      ? `TXN-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`
      : paymentDetails?.TransactionID || null;

    const invoiceNumber = becamePaid
      ? `INV-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`
      : paymentDetails?.invoiceNumber || null;

    const performanceValue = 'Payment Updated';

    // ─── Update or Create Payment Record ───────────────
    const updateData = {
      PaymentStatus: normalizedStatus,
      AmountPaid: amount,
      Note: Note?.trim() || '',
      TransactionID: transactionId,
      invoiceNumber,
      Performance: performanceValue,
      updatedAt: new Date(),
    };

    if (paymentDetails) {
      Object.assign(paymentDetails, updateData);
      await paymentDetails.save();
    } else {
      paymentDetails = new AppointmentDetailsModel({
        appointmentId: appointment._id,
        ...updateData,
        createdAt: new Date(),
      });
      await paymentDetails.save();
    }

    // ─── Send Invoice Email (best-effort) ──────────────
    if (becamePaid && appointment.email) {
      try {
        await emailService.send({
          to: appointment.email,
          subject: `Invoice ${invoiceNumber} - Payment Confirmed`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
              <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">✅ Payment Received</h2>
              <p>Hello <strong>${appointment.fullName}</strong>,</p>
              <p>We have successfully received your payment.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0;"><strong>Invoice:</strong></td><td>${invoiceNumber}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Transaction ID:</strong></td><td>${transactionId}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Amount Paid:</strong></td><td>R${amount?.toFixed(2)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
              <p style="font-size: 14px; color: #666;">Thank you for your business. Please keep this email for your records.</p>
            </div>
          `,
        });
        console.log(`✅ Invoice email sent to ${appointment.email}`);
      } catch (emailError: any) {
        console.error('❌ Invoice email failed:', emailError.message);
        // Don't fail the request — email is best-effort
      }
    }

    // ─── Success Response ──────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: 'Payment details updated successfully',
        data: {
          paymentStatus: normalizedStatus,
          amountPaid: amount?.toFixed(2) || null,
          note: Note?.trim() || '',
          transactionId,
          invoiceNumber,
          becamePaid,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('💥 Update payment error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}