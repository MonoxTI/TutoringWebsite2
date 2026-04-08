// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/DB/connect';
import { UserModel } from '@/lib/DB/models';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Normalize and validate input
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { message: 'Email and password required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user and include password field
    const user = await UserModel.findOne({ email: normalizedEmail }).select(
      '+password'
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || '',
      { expiresIn: '1d' }
    );

    // Send response (no password, no role-specific naming)
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}