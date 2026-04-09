// src/components/Admin/AnalyticsDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import ErrorAlert from '@/components/Common/ErrorAlert';

interface AnalyticsData {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  adminUsers: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
}

export default function AnalyticsDashboard({ token }: { token: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - in production, create actual analytics endpoint
      setAnalytics({
        totalUsers: 156,
        pendingUsers: 12,
        approvedUsers: 140,
        adminUsers: 4,
        totalAppointments: 487,
        completedAppointments: 412,
        pendingAppointments: 75,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!analytics) {
    return null;
  }

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: number;
    icon: string;
    color: string;
  }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Dashboard overview and statistics</p>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* User Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={analytics.totalUsers}
            icon="👥"
            color="border-blue-500"
          />
          <StatCard
            title="Pending Approval"
            value={analytics.pendingUsers}
            icon="⏳"
            color="border-yellow-500"
          />
          <StatCard
            title="Approved Users"
            value={analytics.approvedUsers}
            icon="✓"
            color="border-green-500"
          />
          <StatCard
            title="Admin Users"
            value={analytics.adminUsers}
            icon="⚙️"
            color="border-red-500"
          />
        </div>
      </div>

      {/* Appointment Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Appointment Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Appointments"
            value={analytics.totalAppointments}
            icon="📅"
            color="border-blue-500"
          />
          <StatCard
            title="Completed"
            value={analytics.completedAppointments}
            icon="✅"
            color="border-green-500"
          />
          <StatCard
            title="Pending"
            value={analytics.pendingAppointments}
            icon="⏳"
            color="border-orange-500"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-around">
            <div className="w-12 bg-blue-500 rounded" style={{ height: '60%' }}></div>
            <div className="w-12 bg-blue-500 rounded" style={{ height: '75%' }}></div>
            <div className="w-12 bg-blue-500 rounded" style={{ height: '85%' }}></div>
            <div className="w-12 bg-blue-500 rounded" style={{ height: '95%' }}></div>
            <div className="w-12 bg-blue-500 rounded" style={{ height: '100%' }}></div>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-600">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
          </div>
        </div>

        {/* Appointment Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Completed</span>
                <span className="text-sm font-semibold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Pending</span>
                <span className="text-sm font-semibold text-gray-900">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: '15%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}