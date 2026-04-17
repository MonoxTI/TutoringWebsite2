import jwt from "jsonwebtoken";
import { UserModel, AppointmentModel, AppointmentDetailsModel } from "../Server/Models/DB.js";
import connectDB from "../Server/Config/DBconnect.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Authenticate
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Require access
    if (!user.hasAccess()) {
      return res.status(403).json({
        message: "Your account is pending admin approval"
      });
    }

    const { fullName } = req.body;

    if (!fullName || fullName.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name is required"
      });
    }

    // Case-insensitive search
    const appointment = await AppointmentModel.findOne({
      fullName: { $regex: `^${fullName.trim()}$`, $options: "i" }
    }).lean();

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    const paymentDetails = await AppointmentDetailsModel.findOne({
      appointmentId: appointment._id
    }).lean();

    return res.status(200).json({
      success: true,
      message: "Appointment details retrieved successfully",
      data: {
        appointment: {
          id: appointment._id,
          fullName: appointment.fullName,
          email: appointment.email,
          phoneNumber: appointment.phoneNumber,
          packageName: appointment.packageName,
          date: appointment.date?.toISOString().split("T")[0],
          tutor: appointment.tutor,
          chapters: appointment.chapters || "",
          createdAt: appointment.createdAt
        },
        paymentDetails: paymentDetails
          ? {
              paymentStatus: paymentDetails.PaymentStatus,
              transactionId: paymentDetails.TransactionID,
              amountPaid: paymentDetails.AmountPaid,
              invoiceNumber: paymentDetails.invoiceNumber,
              note: paymentDetails.Note
            }
          : null
      }
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}