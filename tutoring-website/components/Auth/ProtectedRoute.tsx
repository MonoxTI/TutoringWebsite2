// src/components/Auth/ProtectedRoute.tsx
'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (
      !loading &&
      requiredRole &&
      user?.role !== requiredRole &&
      user?.role !== 'admin'
    ) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, requiredRole, user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (
    requiredRole &&
    user?.role !== requiredRole &&
    user?.role !== 'admin'
  ) {
    return null;
  }

  return <>{children}</>;
}