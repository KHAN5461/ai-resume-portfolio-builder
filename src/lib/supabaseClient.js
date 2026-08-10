import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client.
// In a real environment, you would provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
