// Robust Supabase client initialization
import { createClient } from '@supabase/supabase-js';

// Safely access environment
const isBrowser = typeof window !== 'undefined';

// Hardcoded values as fallback
const FALLBACK_SUPABASE_URL = "https://aftiuxltgxqwgsnylgtm.supabase.co";
const FALLBACK_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdGl1eGx0Z3hxd2dzbnlsZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzYwMjQsImV4cCI6MjA2MDA1MjAyNH0.Oa9BCNPJsSHfU2Or6u_FsdpSB2SXZ7v7c6iZcpow-R8";

// Try to get from environment variables first, then fall back to hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

// Log environment detection for debugging
console.log(`Supabase environment detection: 
  - URL from env: ${import.meta.env.VITE_SUPABASE_URL ? 'Yes' : 'No'}
  - Using URL: ${SUPABASE_URL}`);

// Lazy initialization to prevent errors during SSR/bundling
let _supabase: any;

// Factory function pattern for better initialization control
const getSupabase = () => {
  if (!_supabase) {
    try {
      console.log('Initializing Supabase client with:', 
        SUPABASE_URL.substring(0, 15) + '...',
        SUPABASE_PUBLISHABLE_KEY.substring(0, 15) + '...');
      
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