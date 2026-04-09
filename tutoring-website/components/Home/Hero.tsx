// src/components/Home/Hero.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthProvider';

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Master Your Studies with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Expert Tutoring
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
              Get personalized tutoring sessions from experienced educators. Improve
              your grades, build confidence, and achieve your academic goals.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: '✓', text: 'Expert tutors in all subjects' },
                { icon: '✓', text: 'Flexible scheduling' },
                { icon: '✓', text: 'One-on-one personalized sessions' },
                { icon: '✓', text: 'Affordable rates' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-600">
                    {feature.icon}
                  </span>
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href={isAuthenticated ? '/dashboard/appointments' : '/register'}
                className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition duration-200 text-center shadow-lg hover:shadow-xl"
              >
                {isAuthenticated ? 'Book Now' : 'Get Started'}
              </Link>
              <Link
                href="#features"
                className="border-2 border-green-600 text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-green-50 transition duration-200 text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Trusted by students worldwide</p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">2.5k+</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4.8★</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Expert Tutors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-lg rotate-45"></div>
              <div className="absolute bottom-20 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>

              {/* Main illustration */}
              <div className="text-center">
                <div className="text-9xl mb-4">👨‍🎓</div>
                <p className="text-white text-xl font-semibold">
                  Learning Made Easy
                </p>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-sm">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl">⭐</span>
                <p className="font-semibold text-gray-900">Top Rated Service</p>
              </div>
              <p className="text-gray-600 text-sm">
                Our platform connects you with the best tutors in your area.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}