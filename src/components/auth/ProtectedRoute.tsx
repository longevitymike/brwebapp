import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Profile {
  onboarding_complete: boolean;
}

const ProtectedRoute: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const location = useLocation(); // Get current location
  const navigate = useNavigate();

  useEffect(() => {
    async function checkProfile() {
      try {
        setProfile(null);
        setProfileLoading(true);
        
        // Don't proceed if still loading auth
        if (authLoading) return;
        
        // No user means not authenticated
        if (!user) {
          console.log("No user found, skipping profile check");
          setProfileLoading(false);
          return;
        }
        
        console.log("Checking user profile for:", user.id);
        
        // Attempt to fetch user profile
        try {
          const response = await (supabase as any)
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          const data = response?.data || null;
          const error = response?.error || null;
          
          if (error) {
            console.error("Error fetching user profile:", error);
            throw error;
          }
          
          console.log("Profile data:", data);
          
          // No profile or incomplete onboarding
          if (!data || !data.onboarding_complete) {
            console.log("User needs onboarding, redirecting...");
            setProfile({ onboarding_complete: false });
            setProfileLoading(false);
            
            // Don't redirect if already on onboarding page
            if (location.pathname !== '/onboarding') {
              navigate('/onboarding', { replace: true });
            }
            return;
          }
          
          // Profile exists and onboarding complete
          console.log("User profile complete, proceeding");
          setProfile({ onboarding_complete: true });
          setProfileLoading(false);
        } catch (e) {
          console.error("Profile fetch failed:", e);
          
          // Create default profile and redirect to onboarding
          setProfile({ onboarding_complete: false });
          setProfileLoading(false);
          
          // Don't redirect if already on onboarding page
          if (location.pathname !== '/onboarding') {
            navigate('/onboarding', { replace: true });
          }
        }
      } catch (error) {
        console.error("Unexpected error in profile check:", error);
        setProfileLoading(false);
      }
    }
    
    checkProfile();
  }, [authLoading, user, navigate, location.pathname]);

  const isLoading = authLoading || profileLoading;
  
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-background">
      <LoadingSpinner size="lg" text="Loading your profile..." />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!profile) return (
    <div className="flex justify-center items-center h-screen bg-background">
      <LoadingSpinner size="lg" text="Preparing your dashboard..." />
    </div>
  );

  // Safety check for undefined onboarding_complete property
  const isOnboardingComplete = profile && typeof profile.onboarding_complete === 'boolean' 
    ? profile.onboarding_complete 
    : false;

  if (isOnboardingComplete && location.pathname === '/onboarding') return <Navigate to="/dashboard" replace />;

  // Authenticated and onboarding complete (or on the onboarding page itself), render the requested route content
  return <Outlet />;
};

export default ProtectedRoute;