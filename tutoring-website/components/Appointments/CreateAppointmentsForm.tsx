// src/components/Appointments/CreateAppointmentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/Common/ErrorAlert';
import SuccessAlert from '@/components/Common/SuccessAlert';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  chapters: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  chapters?: string;
}

export default function CreateAppointmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    chapters: '',
  });

  // Validation helper
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else {
      const phoneClean = formData.phoneNumber.replace(/\D/g, '');
      if (phoneClean.length < 9 || phoneClean.length > 15) {
        errors.phoneNumber = 'Phone number must be 9-15 digits';
      }
    }

    // Chapters validation
    if (!formData.chapters.trim()) {
      errors.chapters = 'Please specify chapters or topics';
    } else if (formData.chapters.trim().length < 5) {
      errors.chapters = 'Please provide more details about the chapters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
          chapters: formData.chapters.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          chapters: '',
        });

        // Redirect to appointments list after success
        setTimeout(() => {
          router.push('/dashboard/appointments');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create appointment');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating appointment');
      console.error('Create appointment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
        <p className="text-gray-600 mt-2">
          Fill out the form below to request a tutoring appointment
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <ErrorAlert
            message={error}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <SuccessAlert message="Appointment created successfully! Redirecting..." />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
            placeholder="John Doe"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
              formErrors.fullName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            required
          />
          {formErrors.fullName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
              formErrors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            required
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={loading}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
              formErrors.phoneNumber
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            required
          />
          {formErrors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Include country code</p>
        </div>

        {/* Chapters/Topics */}
        <div>
          <label htmlFor="chapters" className="block text-sm font-medium text-gray-700 mb-2">
            Chapters/Topics *
          </label>
          <textarea
            id="chapters"
            name="chapters"
            value={formData.chapters}
            onChange={handleChange}
            disabled={loading}
            placeholder="List the chapters or topics you need tutoring for... e.g., Math Chapter 1-3, Algebra Basics"
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${
              formErrors.chapters
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-green-500'
            }`}
            required
          />
          {formErrors.chapters && (
            <p className="mt-1 text-sm text-red-600">{formErrors.chapters}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Please be specific about what you need help with
          </p>
        </div>

        {/* Terms Agreement */}
        <label className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
            disabled={loading}
            required
          />
          <span className="ml-3 text-sm text-gray-700">
            I agree that my information will be used to contact me about my tutoring appointment
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Booking appointment...
            </span>
          ) : (
            'Book Appointment'
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-900">📋 What happens next?</p>
        <ul className="text-sm text-green-800 mt-3 space-y-2">
          <li>✓ Your appointment request will be submitted</li>
          <li>✓ We'll review your information</li>
          <li>✓ We'll contact you to confirm the appointment</li>
          <li>✓ The tutoring session will be scheduled</li>
        </ul>
      </div>
    </div>
  );
}