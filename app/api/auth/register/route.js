import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/models/DB"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req) {
  try {
    const { username, email, password } = await req.json()

    // ── Validation ──────────────────────────────────────
    if (!username || !email || !password) {
      return Response.json(
        { success: false, message: "Username, email, and password are required" },
        { status: 400 }
      )
    }

    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      )
    }

    if (username.length < 3) {
      return Response.json(
        { success: false, message: "Username must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return Response.json(
        { success: false, message: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    await connectDB()

    // ── Check for duplicates ────────────────────────────
    const existing = await UserModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })

    if (existing) {
      return Response.json(
        { success: false, message: "Email or username already exists" },
        { status: 409 }
      )
    }

    // ── Create user (password auto-hashed by pre-save hook) ──
    const user = await UserModel.create({
      username,
      email: email.toLowerCase().trim(),
      password,
      role: "pending",
    })

    return Response.json(
      {
        success: true,
        message: "Registered successfully. Await admin approval.",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)
    return Response.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    )
  }
}