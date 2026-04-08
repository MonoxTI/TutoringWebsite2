// src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import Sidebar from '@/components/Navigation/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Tutoring Website',
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">{children}</div>
      </div>
    </div>
  );
}