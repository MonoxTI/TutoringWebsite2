// src/components/Appointments/PaymentForm.tsx
'use client';

import { useState } from 'react';

interface PaymentFormProps {
  appointmentName: string;
  token: string;
  onSuccess: () => void;
}

export default function PaymentForm({
  appointmentName,
  token,
  onSuccess,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: appointmentName,
    PaymentStatus: 'unpaid' as 'unpaid' | 'partial' | 'paid',
    AmountPaid: '',
    Note: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          PaymentStatus: formData.PaymentStatus,
          AmountPaid:
            formData.PaymentStatus !== 'unpaid'
              ? parseFloat(formData.AmountPaid)
              : 0,
          Note: formData.Note,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          fullName: appointmentName,
          PaymentStatus: 'unpaid',
          AmountPaid: '',
          Note: '',
        });
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError(data.message || 'Failed to update payment');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Update Payment Details
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Payment details updated successfully! ✅
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Status
        </label>
        <select
          name="PaymentStatus"
          value={formData.PaymentStatus}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {formData.PaymentStatus !== 'unpaid' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid (R)
          </label>
          <input
            type="number"
            name="AmountPaid"
            value={formData.AmountPaid}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required={formData.PaymentStatus !== 'unpaid'}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="Note"
          value={formData.Note}
          onChange={handleChange}
          placeholder="Add any notes about this payment..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Updating...' : 'Update Payment'}
      </button>
    </form>
  );
}