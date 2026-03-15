import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Types for our database schema
export interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  working_hours: {
    day: string;
    start: string;
    end: string;
    is_working: boolean;
  }[];
  rating: number;
  commission_rate: number;
  avatar_url?: string;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  category: 'barbering' | 'hajama' | 'skincare';
  price: number;
  duration_minutes: number;
  description: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  barber_id: string;
  barber_name: string;
  service_ids: string[];
  service_titles: string[];
  start_time: string;
  end_time: string;
  total_duration: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_visits: number;
  total_spent: number;
  last_visit?: string;
  avatar_url?: string;
  created_at: string;
}
