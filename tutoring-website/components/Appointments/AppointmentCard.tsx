// src/components/Appointments/AppointmentCard.tsx
'use client';

import Link from 'next/link';
import { IAppointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: IAppointment;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function AppointmentCard({
  appointment,
  onDelete,
  showActions = true,
}: AppointmentCardProps) {
  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete the appointment for ${appointment.fullName}?`
      )
    ) {
      onDelete?.(appointment.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4 text-white">
        <h3 className="text-lg font-semibold">{appointment.fullName}</h3>
        <p className="text-green-100 text-sm">
          📅 {formatDate(appointment.createdAt)} at {formatTime(appointment.createdAt)}
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-3">
        {/* Email */}
        <div className="flex items-start">
          <span className="text-gray-600 text-sm font-medium w-24">Email:</span>
          <a
            href={`mailto:${appointment.email}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {appointment.email}
          </a>
        </div>

        {/* Phone */}
        <div className="flex items-start">
          <span className="text-gray-600 text-sm font-medium w-24">Phone:</span>
          <a
            href={`tel:${appointment.phoneNumber}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {appointment.phoneNumber}
          </a>
        </div>

        {/* Chapters */}
        <div className="flex items-start">
          <span className="text-gray-600 text-sm font-medium w-24">Topics:</span>
          <p className="text-gray-700 text-sm line-clamp-2">
            {appointment.chapters}
          </p>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <Link
            href={`/dashboard/appointments/${appointment.id}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center text-sm font-medium"
          >
            View Details
          </Link>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}