// src/components/Navigation/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">
              🎓 Tutoring
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600">
              Home
            </Link>
            <Link
              href="/appointments"
              className="text-gray-700 hover:text-green-600"
            >
              Book Now
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-green-600"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="text-gray-700 hover:text-green-600"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user?.username}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />
      )}
    </nav>
  );
}