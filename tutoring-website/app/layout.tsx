// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import Navbar from '@/components/Navigation/Navbar';
import Footer from '@/components/Navigation/Home/Footer';

export const metadata: Metadata = {
  title: 'Tutoring Website',
  description: 'Book tutoring appointments and manage your learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}