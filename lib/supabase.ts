import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = (rawSupabaseUrl && rawSupabaseUrl.startsWith('http')) ? rawSupabaseUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
