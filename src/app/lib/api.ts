import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0bdf1ecf`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Barbers
export const getBarbers = () => fetchAPI('/barbers');
export const createBarber = (data: any) => fetchAPI('/barbers', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updateBarber = (id: string, data: any) => fetchAPI(`/barbers/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deleteBarber = (id: string) => fetchAPI(`/barbers/${id}`, {
  method: 'DELETE',
});

// Services
export const getServices = () => fetchAPI('/services');
export const createService = (data: any) => fetchAPI('/services', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updateService = (id: string, data: any) => fetchAPI(`/services/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deleteService = (id: string) => fetchAPI(`/services/${id}`, {
  method: 'DELETE',
});

// Appointments
export const getAppointments = (params?: { date?: string; barber_id?: string; status?: string }) => {
  const query = new URLSearchParams(params as any).toString();
  return fetchAPI(`/appointments${query ? `?${query}` : ''}`);
};
export const createAppointment = (data: any) => fetchAPI('/appointments', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updateAppointment = (id: string, data: any) => fetchAPI(`/appointments/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deleteAppointment = (id: string) => fetchAPI(`/appointments/${id}`, {
  method: 'DELETE',
});

// Check availability
export const checkAvailability = (barberId: string, date: string, duration: number) => 
  fetchAPI(`/availability/${barberId}?date=${date}&duration=${duration}`);

// Customers
export const getCustomers = () => fetchAPI('/customers');

// Analytics
export const getAnalytics = (params?: { start_date?: string; end_date?: string }) => {
  const query = new URLSearchParams(params as any).toString();
  return fetchAPI(`/analytics${query ? `?${query}` : ''}`);
};
