// src/components/Appointments/AppointmentsList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { appointmentService } from '@/lib/api/appointments';
import { IAppointment } from '@/types/appointment';

interface AppointmentsListProps {
  token: string;
}

export default function AppointmentsList({ token }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentService.getAllAppointments(token);

      if (response.success) {
        setAppointments(response.data.appointments);
      } else {
        setError(response.message || 'Failed to fetch appointments');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const response = await appointmentService.deleteAppointment(id, token);

      if (response.success) {
        setAppointments(appointments.filter((apt) => apt.id !== id));
        alert('Appointment deleted successfully');
      } else {
        alert(response.message || 'Failed to delete appointment');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const filteredAppointments = appointments.filter((apt) =>
    apt.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={fetchAppointments}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Appointments ({filteredAppointments.length})
        </h2>
        <button
          onClick={fetchAppointments}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      {filteredAppointments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Chapters
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {apt.fullName}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{apt.email}</td>
                  <td className="px-4 py-3 text-gray-700">{apt.phoneNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{apt.chapters}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {new Date(apt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Link
                      href={`/dashboard/appointments/${apt.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 inline-block"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}