import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseAvailable } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BootstrapProps {
  children: React.ReactNode;
}

/**
 * Bootstrap component that ensures all critical services are initialized
 * before rendering the application.
 */
const Bootstrap: React.FC<BootstrapProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Bootstrapping application...');
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log('Non-browser environment detected, deferring initialization');
          setInitialized(true);
          return;
        }
        
        // Check Supabase availability
        if (!isSupabaseAvailable()) {
          throw new Error('Supabase client is not available');
        }
        
        // Test supabase connection with a simple query
        try {
          await supabase.auth.getSession();
          console.log('Supabase connection verified');
        } catch (e) {
          console.warn('Unable to verify Supabase connection:', e);
          // Continue anyway as this might be a network issue
        }
        
        // Initialize any other critical services here...
        
        // Mark as initialized
        console.log('Bootstrap complete');
        setInitialized(true);
      } catch (err) {
        console.error('Bootstrap error:', err);
        setError(err instanceof Error ? err.message : 'Unknown initialization error');
        // Still mark as initialized so the app can show an error state
        setInitialized(true);
      }
    };
    
    initializeApp();
  }, []);
  
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="text-xl font-semibold mt-4 mb-2">Loading Barefoot Reset...</div>
          <p className="text-muted-foreground">Initializing application</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md p-6 rounded-lg border border-destructive bg-destructive/10">
          <h1 className="text-xl font-bold mb-4">Application Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            className="btn bg-primary text-white px-4 py-2 rounded-lg" 
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default Bootstrap;