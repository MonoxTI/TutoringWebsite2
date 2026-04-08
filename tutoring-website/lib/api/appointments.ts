// src/lib/api/appointments.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const appointmentService = {
  // Get all appointments
  async getAllAppointments(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    return response.json();
  },

  // Get specific appointment by ID
  async getAppointmentById(id: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointment');
    }

    return response.json();
  },

  // Get appointment by full name
  async getAppointmentByName(fullName: string) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointment');
    }

    return response.json();
  },

  // Create appointment
  async createAppointment(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    chapters: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }

    return response.json();
  },

  // Delete appointment
  async deleteAppointment(id: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete appointment');
    }

    return response.json();
  },
};