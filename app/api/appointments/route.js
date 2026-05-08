import { connectDB } from "@/lib/mongodb";
import { AppointmentModel } from "@/models/DB";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─── POST /api/appointments ─────────────────── 
   Public — anyone can book                      */
export async function POST(req) {
  try {
    const { fullName, email, phoneNumber, chapters } = await req.json();

    if (!fullName?.trim() || !email?.trim() || !phoneNumber || !chapters?.trim()) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const phoneClean = String(phoneNumber).replace(/\D/g, "");
    if (phoneClean.length < 9 || phoneClean.length > 15) {
      return Response.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    await connectDB();

    const appointment = await AppointmentModel.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneClean,
      chapters: chapters.trim(),
    });

    return Response.json(
      { success: true, message: "Appointment created", data: appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* ─── GET /api/appointments ──────────────────── 
   Protected — only logged-in users with access  */
export async function GET(req) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.hasAccess()) return forbidden("Your account is pending approval");

  await connectDB();
  const appointments = await AppointmentModel.find().sort({ createdAt: -1 });

  return Response.json({ success: true, data: appointments });
}