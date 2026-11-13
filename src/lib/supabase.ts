import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseConfigMessage = 'Website chưa được cấu hình kết nối Supabase. Vui lòng kiểm tra GitHub Actions Secrets.';
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type NewsStatus = 'draft' | 'published';

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  published_at: string | null;
  status: NewsStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  translations?: Record<string, import('./translate').LocalizedFields>;
}

export interface JobPost {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  sort_order: number;
  status: NewsStatus;
  translations?: Record<string, import('./translate').LocalizedFields>;
  created_at: string;
  updated_at: string;
}
