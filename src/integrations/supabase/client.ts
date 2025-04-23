// Robust Supabase client initialization
import { createClient } from '@supabase/supabase-js';

// Safely access environment
const isBrowser = typeof window !== 'undefined';

// Get Supabase credentials from Vite environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Supabase URL and Anon Key must be defined in environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).");
}

// Lazy initialization to prevent errors during SSR/bundling
let _supabase: any;

// Factory function pattern for better initialization control
const getSupabase = () => {
  if (!_supabase) {
    try {
      _supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: isBrowser, // Only persist in browser environments
        }
      });
      console.log('Supabase client initialized');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      // Create a fallback client that prevents crashes but logs errors
      _supabase = {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase client failed to initialize') }),
          signOut: () => Promise.resolve({ error: null })
        },
        from: () => ({
          select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) })
        })
      };
    }
  }
  return _supabase;
};

// Export the client getter
export const supabase = getSupabase();

// Export a way to check if Supabase is available
export const isSupabaseAvailable = () => {
  return !!_supabase;
};