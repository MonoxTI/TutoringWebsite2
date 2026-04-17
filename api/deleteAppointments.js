import jwt from "jsonwebtoken";
import { UserModel, AppointmentModel } from "../Server/Models/DB.js";
import connectDB from "../Server/Config/DBconnect.js";

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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

    await AppointmentModel.deleteMany({});
    return res.status(200).json({
        success: true,
        message: "All appointments deleted successfully"
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointments', error: error.message });
  }
}