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
  sendMagicLink: (email: string) => Promise<{ success: boolean, error?: Error }>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    
    // Initialize auth session
    (async () => {
      try {
        console.log("Initializing auth session...");
        
        // Process magic link from URL if present
        try {
          console.log("Checking for magic link in URL...");
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const hasAccessToken = hashParams.get('access_token');
          const hasRefreshToken = hashParams.get('refresh_token');
          
          if (hasAccessToken || hasRefreshToken) {
            console.log("Magic link parameters detected in URL");
            // Get session from URL (converts hash params to session)
            await supabase.auth.getSession();
          }
        } catch (urlError) {
          console.error("Error processing URL parameters:", urlError);
        }
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        if (mounted) {
          const userFromSession = data?.session?.user || null;
          console.log("User from session:", userFromSession ? "Found" : "Not found");
          setUser(userFromSession);
          setIsLoading(false);
        }
        
        // Subscribe to auth changes
        const authSubscription = supabase.auth.onAuthStateChange((_event, session) => {
          console.log("Auth state changed, event:", _event);
          if (mounted) {
            setUser(session?.user ?? null);
          }
        });
        
        subscription = authSubscription.data.subscription;
      } catch (e) {
        console.error("Unexpected error in auth initialization:", e);
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    
    return () => { 
      mounted = false; 
      if (subscription) subscription.unsubscribe(); 
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !session) {
      setIsLoading(false);
      throw error || new Error('Login failed');
    }
    // Set user immediately for ProtectedRoute
    setUser(session.user);
    setIsLoading(false);
  };

  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          // You can set a redirectTo URL if needed
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Magic link error:", error);
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Magic link exception:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to send magic link') 
      };
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
        sendMagicLink,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
