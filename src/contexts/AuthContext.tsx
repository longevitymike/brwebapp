import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupaUser } from '@supabase/supabase-js';

// Types
type UserRole = 'athlete' | 'parent';

// Use Supabase User type
type User = SupaUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // initialize session, including parsing magic-link tokens
    (async () => {
      const authAny = supabase.auth as any;
      if (typeof authAny.getSessionFromUrl === 'function') {
        try { await authAny.getSessionFromUrl({ storeSession: true }); } catch {}
      }
      // Safely fetch session to avoid destructuring undefined
      let session: Session | null = null;
      try {
        const response = await supabase.auth.getSession();
        session = response.data?.session ?? null;
      } catch (err) {
        console.error('Error fetching session:', err);
      }
      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    })();
    // subscribe to auth changes safely
    let subscription: any = null;
    try {
      const resp = supabase.auth.onAuthStateChange((_, session: Session | null) => {
        if (mounted) setUser(session?.user ?? null);
      });
      subscription = (resp as any).data?.subscription;
    } catch (err) {
      console.error('Error subscribing to auth changes:', err);
    }
    return () => { mounted = false; subscription?.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      const session = response?.data?.session;
      if (!session) {
        throw new Error('Login failed: No session returned');
      }
      setUser(session.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Ensure user_metadata is never undefined to prevent "undefined has no properties" errors
  if (context.user && !context.user.user_metadata) {
    context.user.user_metadata = {};
  }
  return context;
};
