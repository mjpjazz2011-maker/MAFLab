import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_database_URL;
const supabaseAnonKey = import.meta.env.VITE_database_ANON_KEY;

// Create a mock client for development when env vars are missing
const createMockClient = (): SupabaseClient => {
  console.warn('⚠️ Supabase env vars missing. Using mock client. Set VITE_database_URL and VITE_database_ANON_KEY');
  return createClient('https://placeholder.supabase.co', 'placeholder-key');
};

export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
