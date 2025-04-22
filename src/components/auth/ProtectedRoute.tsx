import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
      setProfile(null);
      setProfileLoading(true);
      if (authLoading) return;
      if (!user) {
        setProfileLoading(false);
        return;
      }
      // use any to bypass missing TS schema for user_profiles
      console.log("Checking user profile:", user?.id);
      let data = null;
      let error = null;
      
      try {
        const response = await (supabase as any)
          .from('user_profiles')
          .select('*') // Select all fields to see the schema
          .eq('user_id', user.id)
          .maybeSingle();
        
        data = response?.data || null;
        error = response?.error || null;
      } catch (e) {
        console.error("Error fetching user profile:", e);
        error = e;
      }
      console.log("Profile data:", data, "Error:", error);
      // handle missing, error, or incomplete profile: stop loading and redirect
      if (!data || error || !data.onboarding_complete) {
        setProfile({ onboarding_complete: false });
        setProfileLoading(false);
        navigate('/onboarding', { replace: true });
        return;
      }
      // fully onboarded: set profile and stop loading
      setProfile({ onboarding_complete: data.onboarding_complete });
      setProfileLoading(false);
    }
    checkProfile();
  }, [authLoading, user, navigate]);

  const isLoading = authLoading || profileLoading;

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!profile) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // Safety check for undefined onboarding_complete property
  const isOnboardingComplete = profile && typeof profile.onboarding_complete === 'boolean' 
    ? profile.onboarding_complete 
    : false;

  if (isOnboardingComplete && location.pathname === '/onboarding') return <Navigate to="/dashboard" replace />;

  // Authenticated and onboarding complete (or on the onboarding page itself), render the requested route content
  return <Outlet />;
};

export default ProtectedRoute;