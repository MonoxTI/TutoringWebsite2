import jwt from "jsonwebtoken";
import { UserModel } from "../../../Server/Models/DB.js";
import connectDB from "../../../Server/Config/DBconnect.js";

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
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

    // Require admin
    if (!user.isAdmin()) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { id } = req.query;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { role: "user", approvedAt: new Date(), approvedBy: user._id },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User approved", data: updatedUser });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}