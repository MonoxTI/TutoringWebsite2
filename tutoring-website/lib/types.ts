// src/lib/types.ts
import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'pending' | 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isAdmin(): boolean;
  hasAccess(): boolean;
}

export interface IAppointment extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  chapters: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointmentDetails extends Document {
  appointmentId: Types.ObjectId;
  PaymentStatus: 'unpaid' | 'partial' | 'paid';
  Performance: string;
  TransactionID: string;
  AmountPaid: number;
  invoiceNumber: string;
  Note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}