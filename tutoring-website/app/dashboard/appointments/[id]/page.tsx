// src/app/dashboard/appointments/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppointmentDetail from '@/components/Appointments/AppointmentDetail';

export default function AppointmentDetailPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
      setLoading(false);
    }
  }, [router]);

  if (loading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <AppointmentDetail token={token} />
      </div>
    </div>
  );
}