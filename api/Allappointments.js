import jwt from "jsonwebtoken";
import { UserModel, AppointmentModel } from "../Server/Models/DB.js";
import connectDB from "../Server/Config/DBconnect.js";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    const appointments = await AppointmentModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All appointments retrieved successfully",
      data: {
        count: appointments.length,
        appointments: appointments.map(apt => ({
          id: apt._id.toString(),
          fullName: apt.fullName,
          email: apt.email,
          phoneNumber: apt.phoneNumber,
          chapters: apt.chapters,
          createdAt: apt.createdAt || null,
          updatedAt: apt.updatedAt || null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}