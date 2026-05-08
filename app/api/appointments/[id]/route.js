import { connectDB } from "@/lib/mongodb"
import { AppointmentModel, AppointmentDetailsModel } from "@/models/DB"
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
import { randomUUID } from "crypto"

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/* ── GET /api/appointments/:id ───────────────────
   Get one appointment + its payment details       */
export async function GET(req, { params }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()
  if (!user.hasAccess()) return forbidden("Account pending approval")

  await connectDB()

  const appointment = await AppointmentModel.findById(params.id).lean()
  if (!appointment) {
    return Response.json(
      { success: false, message: "Appointment not found" },
      { status: 404 }
    )
  }

  const paymentDetails = await AppointmentDetailsModel.findOne({
    appointmentId: appointment._id,
  }).lean()

  return Response.json({
    success: true,
    data: {
      appointment: {
        id: appointment._id,
        fullName: appointment.fullName,
        email: appointment.email,
        phoneNumber: appointment.phoneNumber,
        chapters: appointment.chapters || "",
        createdAt: appointment.createdAt,
      },
      paymentDetails: paymentDetails
        ? {
            paymentStatus: paymentDetails.PaymentStatus,
            transactionId: paymentDetails.TransactionID,
            amountPaid: paymentDetails.AmountPaid,
            invoiceNumber: paymentDetails.invoiceNumber,
            note: paymentDetails.Note,
          }
        : null,
    },
  })
}

/* ── PATCH /api/appointments/:id ─────────────────
   Update payment status for one appointment       */
export async function PATCH(req, { params }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()
  if (!user.hasAccess()) return forbidden("Account pending approval")

  const { PaymentStatus, AmountPaid, Note } = await req.json()

  const normalizedStatus = PaymentStatus?.toLowerCase().trim() || "unpaid"
  const validStatuses = ["unpaid", "partial", "paid"]

  if (!validStatuses.includes(normalizedStatus)) {
    return Response.json(
      { success: false, message: `Status must be: ${validStatuses.join(", ")}` },
      { status: 400 }
    )
  }

  const amount = normalizedStatus !== "unpaid" ? parseFloat(AmountPaid) : null
  if (normalizedStatus !== "unpaid" && (!AmountPaid || isNaN(amount) || amount <= 0)) {
    return Response.json(
      { success: false, message: "Valid amount required for partial or paid status" },
      { status: 400 }
    )
  }

  await connectDB()

  const appointment = await AppointmentModel.findById(params.id)
  if (!appointment) {
    return Response.json(
      { success: false, message: "Appointment not found" },
      { status: 404 }
    )
  }

  let paymentDetails = await AppointmentDetailsModel.findOne({
    appointmentId: appointment._id,
  })

  const previousStatus = paymentDetails?.PaymentStatus?.toLowerCase() || "unpaid"
  const becamePaid = normalizedStatus === "paid" && previousStatus !== "paid"

  // ── Only generate IDs when payment transitions to paid ──
  const transactionId = becamePaid
    ? `TXN-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`
    : paymentDetails?.TransactionID || null

  const invoiceNumber = becamePaid
    ? `INV-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`
    : paymentDetails?.invoiceNumber || null

  const updateData = {
    PaymentStatus: normalizedStatus,
    AmountPaid: amount,
    Note: Note?.trim() || "",
    TransactionID: transactionId,
    invoiceNumber,
    Performance: "Payment Updated",
  }

  if (paymentDetails) {
    Object.assign(paymentDetails, updateData)
    await paymentDetails.save()
  } else {
    paymentDetails = await AppointmentDetailsModel.create({
      appointmentId: appointment._id,
      ...updateData,
    })
  }

  // ── Send invoice email only when payment first becomes paid ──
  if (becamePaid && appointment.email) {
    try {
      await sendEmail({
        to: appointment.email,
        subject: `Invoice ${invoiceNumber} - Payment Confirmed`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#333">
            <h2 style="color:#16a34a;border-bottom:2px solid #16a34a;padding-bottom:10px">
              ✅ Payment Received
            </h2>
            <p>Hello <strong>${appointment.fullName}</strong>,</p>
            <p>We have successfully received your payment.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0"><strong>Invoice:</strong></td><td>${invoiceNumber}</td></tr>
              <tr><td style="padding:6px 0"><strong>Transaction ID:</strong></td><td>${transactionId}</td></tr>
              <tr><td style="padding:6px 0"><strong>Amount Paid:</strong></td><td>R${amount.toFixed(2)}</td></tr>
              <tr><td style="padding:6px 0"><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
            </table>
            <p style="font-size:14px;color:#666;margin-top:20px">
              Thank you. Please keep this email for your records.
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      // Email failure should never crash the payment update
      console.error("Invoice email failed:", emailError.message)
    }
  }

  return Response.json({
    success: true,
    message: "Payment updated successfully",
    data: {
      paymentStatus: normalizedStatus,
      amountPaid: amount?.toFixed(2) || null,
      transactionId,
      invoiceNumber,
      becamePaid,
    },
  })
}

/* ── DELETE /api/appointments/:id ────────────────
   Delete one specific appointment                 */
export async function DELETE(req, { params }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()
  if (!user.hasAccess()) return forbidden("Account pending approval")

  await connectDB()

  const appointment = await AppointmentModel.findByIdAndDelete(params.id)
  if (!appointment) {
    return Response.json(
      { success: false, message: "Appointment not found" },
      { status: 404 }
    )
  }

  // ── Also delete the linked payment details ───────────
  await AppointmentDetailsModel.deleteOne({ appointmentId: params.id })

  return Response.json({
    success: true,
    message: "Appointment deleted successfully",
  })
}