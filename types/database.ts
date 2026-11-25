export interface Profile {
  id: string; // Terhubung langsung ke auth.users.id
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "user" | "cleaner";
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Cleaner {
  id: string;
  name: string;
  bio: string | null;
  rating: number | null;
  photo_url: string | null;
  is_available: boolean;
  profile_id: string | null; // Terhubung ke profiles.id
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string; // Terhubung ke auth.users.id
  service_id: string;
  cleaner_id: string;
  scheduled_at: string;
  address: string;
  notes: string | null;
  total_price: number;
  status: string;
  created_at: string;
}
