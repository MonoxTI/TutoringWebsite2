// src/app/(auth)/layout.tsx
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Tutoring Website',
};

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-600">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {children}
        
      </div>
    </div>
  );
}