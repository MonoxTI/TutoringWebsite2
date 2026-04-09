// components/Navigation/MobileMenu.tsx
'use client';

import Link from 'next/link';
import type { PublicUser } from '@/lib/types';

interface MobileMenuProps {
  isAuthenticated: boolean;
  user: PublicUser | null;
  onLogout: () => void;
}

export default function MobileMenu({ isAuthenticated, user, onLogout }: MobileMenuProps) {
  return (
    <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
      <Link href="/" className="block text-gray-700 hover:text-green-600 py-2">
        Home
      </Link>
      <Link href="/appointments" className="block text-gray-700 hover:text-green-600 py-2">
        Book Now
      </Link>

      {isAuthenticated ? (
        <>
          <Link href="/dashboard" className="block text-gray-700 hover:text-green-600 py-2">
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link href="/dashboard/admin" className="block text-gray-700 hover:text-green-600 py-2">
              Admin
            </Link>
          )}
          <div className="pt-2 border-t border-gray-100">
            <span className="block text-gray-500 text-sm mb-2">{user?.username}</span>
            <button
              onClick={onLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-left"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <Link href="/login" className="block text-gray-700 hover:text-green-600 py-2">
            Login
          </Link>
          <Link href="/register" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Register
          </Link>
        </>
      )}
    </div>
  );
}