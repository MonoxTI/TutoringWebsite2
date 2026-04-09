// src/components/Home/CTASection.tsx
'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Ready to Excel Academically?
        </h2>

        {/* Subheading */}
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join our community of successful students. Get expert tutoring,
          flexible scheduling, and proven results.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/register"
            className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition duration-200 shadow-lg"
          >
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-200"
          >
            Contact Us
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}