// src/components/Appointments/AppointmentDetail.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { appointmentService } from '@/lib/api/appointments';
import { IAppointmentDetail } from '@/types/appointment';
import PaymentForm from './PaymentForm';

interface AppointmentDetailProps {
  token: string;
}

export default function AppointmentDetail({
  token,
}: AppointmentDetailProps) {
  const params = useParams();
  const router = useRouter();
  const [appointmentData, setAppointmentData] =
    useState<IAppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    fetchAppointmentDetail();
  }, []);

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAppointmentById(
        params.id as string,
        token
      );

      if (response.success) {
        setAppointmentData(response.data);
      } else {
        setError(response.message || 'Failed to fetch appointment');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdated = () => {
    setShowPaymentForm(false);
    fetchAppointmentDetail();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchAppointmentDetail}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
        >
          Try Again
        </button>
        <button
          onClick={() => router.back()}
          className="mt-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Appointment not found</p>
      </div>
    );
  }

  const { appointment, paymentDetails } = appointmentData;
  const statusColors = {
    unpaid: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          {appointment.fullName}
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Go Back
        </button>
      </div>

      {/* Appointment Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Appointment Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <p className="text-gray-900 mt-1">{appointment.fullName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <a
              href={`mailto:${appointment.email}`}
              className="text-blue-600 hover:underline mt-1"
            >
              {appointment.email}
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <a
              href={`tel:${appointment.phoneNumber}`}
              className="text-blue-600 hover:underline mt-1"
            >
              {appointment.phoneNumber}
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Chapters
            </label>
            <p className="text-gray-900 mt-1">{appointment.chapters}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Appointment Date
            </label>
            <p className="text-gray-900 mt-1">
              {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Last Updated
            </label>
            <p className="text-gray-900 mt-1">
              {new Date(appointment.updatedAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Payment Information
          </h2>
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showPaymentForm ? 'Cancel' : 'Update Payment'}
          </button>
        </div>

        {paymentDetails ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Payment Status
              </label>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  statusColors[
                    paymentDetails.paymentStatus as keyof typeof statusColors
                  ]
                }`}
              >
                {paymentDetails.paymentStatus.charAt(0).toUpperCase() +
                  paymentDetails.paymentStatus.slice(1)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Amount Paid
              </label>
              <p className="text-gray-900 mt-1">
                R{paymentDetails.amountPaid?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Transaction ID
              </label>
              <p className="text-gray-900 mt-1 font-mono text-sm">
                {paymentDetails.transactionId || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Invoice Number
              </label>
              <p className="text-gray-900 mt-1 font-mono text-sm">
                {paymentDetails.invoiceNumber || 'N/A'}
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Notes
              </label>
              <p className="text-gray-900 mt-1">
                {paymentDetails.note || 'No notes'}
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                Payment Date
              </label>
              <p className="text-gray-900 mt-1">
                {new Date(paymentDetails.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No payment information recorded yet</p>
        )}

        {/* Payment Form */}
        {showPaymentForm && (
          <div className="mt-6 pt-6 border-t">
            <PaymentForm
              appointmentName={appointment.fullName}
              token={token}
              onSuccess={handlePaymentUpdated}
            />
          </div>
        )}
      </div>
    </div>
  );
}