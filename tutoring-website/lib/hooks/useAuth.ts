// src/lib/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/components/Auth/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}