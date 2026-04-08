// src/lib/DB/models.ts
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IAppointment, IAppointmentDetails } from '../types';

/* ─── User Schema ─────────────────────────────────────── */
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['pending', 'user', 'admin'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Convenience helpers
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === 'admin';
};

UserSchema.methods.hasAccess = function (): boolean {
  return ['user', 'admin'].includes(this.role);
};

/* ─── Appointment Schema ──────────────────────────────── */
const AppointmentSchema = new Schema<IAppointment>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true },
    chapters: { type: String, required: true },
  },
  { timestamps: true }
);

/* ─── Appointment Details Schema ──────────────────────── */
const AppointmentDetailsSchema = new Schema<IAppointmentDetails>(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    PaymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      required: true,
    },
    Performance: { type: String, required: true },
    TransactionID: { type: String, required: true },
    AmountPaid: { type: Number, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    Note: { type: String, trim: true },
  },
  { timestamps: true }
);

/* ─── Models ──────────────────────────────────────────── */
export const UserModel =
  mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);

export const AppointmentModel =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export const AppointmentDetailsModel =
  mongoose.models.AppointmentDetails ||
  mongoose.model<IAppointmentDetails>(
    'AppointmentDetails',
    AppointmentDetailsSchema
  );