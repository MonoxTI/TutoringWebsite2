// src/components/Admin/PendingUsers.tsx
'use client';

import { useEffect, useState } from 'react';
import UserCard from './UserCard';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import ErrorAlert from '@/components/Common/ErrorAlert';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PendingUsersProps {
  token: string;
  onError?: (error: string | null) => void;
}

export default function PendingUsers({
  token,
  onError,
}: PendingUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  useEffect(() => {
    onError?.(error);
  }, [error, onError]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/pending`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || 'Failed to fetch pending users');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'approve' }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove from pending list
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        setError(data.message || 'Failed to approve user');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke this user?')) {
      return;
    }

    try {
      setActionLoading(userId);

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'revoke' }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh list
        await fetchPendingUsers();
      } else {
        setError(data.message || 'Failed to revoke user');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Approvals
          </h2>
          <p className="text-gray-600 mt-1">
            {users.length} user{users.length !== 1 ? 's' : ''} awaiting approval
          </p>
        </div>
        <button
          onClick={fetchPendingUsers}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">✅ No pending users</p>
          <p className="text-gray-400">All registrations have been reviewed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onApprove={() => handleApprove(user._id)}
              onRevoke={() => handleRevoke(user._id)}
              isLoading={actionLoading === user._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}