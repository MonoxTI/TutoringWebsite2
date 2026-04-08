// src/types/appointment.ts
export interface IAppointment {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  chapters: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentDetails {
  id: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  transactionId: string;
  amountPaid: number;
  invoiceNumber: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAppointmentDetail {
  appointment: IAppointment;
  paymentDetails: IPaymentDetails | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}