// src/components/Navigation/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthProvider';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const menuItems = [
    { href: '/dashboard', label: '📊 Dashboard', role: 'all' },
    {
      href: '/dashboard/appointments',
      label: '📅 Appointments',
      role: 'all',
    },
    { href: '/dashboard/profile', label: '👤 Profile', role: 'all' },
    {
      href: '/dashboard/admin',
      label: '⚙️ Admin Panel',
      role: 'admin',
    },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">🎓 Tutoring</h2>
        <p className="text-sm text-gray-400 mt-2">{user?.role}</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          if (item.role !== 'all' && !isAdmin) return null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 transition ${
                isActive(item.href)
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            location.href = '/';
          }}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}