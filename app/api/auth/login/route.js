import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { UserModel } from "@/models/DB"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // ── Find user and include password for comparison ───
    const user = await UserModel.findOne({ 
      email: email.toLowerCase().trim() 
    }).select("+password")

    if (!user) {
      // ⚠ Always say "invalid credentials" — never reveal
      // whether the email exists or not. This prevents
      // attackers from guessing valid emails.
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // ── Block pending users from logging in ─────────────
    if (user.role === "pending") {
      return Response.json(
        { success: false, message: "Your account is awaiting admin approval" },
        { status: 403 }
      )
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    return Response.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    )
  }
}