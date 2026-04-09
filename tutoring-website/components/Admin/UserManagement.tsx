// src/components/Admin/UserManagement.tsx
'use client';

import { useEffect, useState } from 'react';
import PendingUsers from './PendingUsers';
import ErrorAlert from '@/components/Common/ErrorAlert';

export default function UserManagement({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage and approve user registrations</p>
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Pending Users Section */}
      <PendingUsers token={token} onError={setError} />
    </div>
  );
}