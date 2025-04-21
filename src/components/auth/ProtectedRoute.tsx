import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@config/useAuth';
import { supabase } from '@config/supabaseClient';
// import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Optional: Add a proper loading spinner

interface Profile {
  onboarding_complete: boolean;
  // Add other profile fields if needed later
}

const ProtectedRoute: React.FC = () => {
  // Dev mode bypass for protected routes
  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log('ProtectedRoute: Bypassing auth in development');
    return <Outlet />;
  }

  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Reset profile state when auth state changes before fetching
    setProfile(null);
    setProfileLoading(true);
    setProfileError(null);

    if (!authLoading && user) {
      console.log('ProtectedRoute: User authenticated, fetching profile...');
      supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') { // PGRST116: row not found, expected for new users
            console.error('ProtectedRoute: Error fetching profile:', error);
            setProfileError('Could not load user profile.');
          } else if (data) {
            console.log('ProtectedRoute: Fetched profile:', data);
            setProfile(data as Profile);
          } else {
             console.log('ProtectedRoute: Profile not found (new user?), assuming onboarding needed.');
             // Treat profile not found as onboarding incomplete
             setProfile({ onboarding_complete: false });
          }
          setProfileLoading(false);
        });
    } else if (!authLoading && !user) {
      // No user, no need to load profile
      console.log('ProtectedRoute: No user authenticated.');
      setProfileLoading(false);
    }
  }, [user, authLoading, location]); // Add location to dependencies

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    console.log('ProtectedRoute: Loading auth or profile...');
    // return <LoadingSpinner />; // Placeholder for a loading UI
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (profileError) {
      console.log('ProtectedRoute: Profile error state.');
      // Handle profile error state, maybe show an error message or redirect
      return <div className="flex justify-center items-center h-screen">Error loading profile: {profileError}</div>;
  }

  if (!user) {
    // Not authenticated, redirect to login, saving the intended destination
    console.log('ProtectedRoute: Redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is authenticated but profile hasn't loaded yet (edge case)
  if (!profile) {
      console.log('ProtectedRoute: User authenticated but profile not loaded yet (should be loading state).');
      // This state should ideally be covered by isLoading, but as a fallback:
      return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
  }

  // TEMPORARY BYPASS FOR DASHBOARD TESTING
  // if (!profile.onboarding_complete) {
  //   // Authenticated but onboarding not complete
  //   // If already on onboarding page, allow rendering, otherwise redirect
  //   if (location.pathname !== '/onboarding') {
  //       console.log('ProtectedRoute: Onboarding incomplete, redirecting to /onboarding');
  //       return <Navigate to="/onboarding" replace />;
  //   }
  //    console.log('ProtectedRoute: Onboarding incomplete, but already on /onboarding page.');
  // }

  // If onboarding IS complete, but user tries to access /onboarding, redirect them away
  if (profile.onboarding_complete && location.pathname === '/onboarding') {
      console.log('ProtectedRoute: Onboarding complete, redirecting from /onboarding to /');
      return <Navigate to="/" replace />;
  }


  // Authenticated and onboarding complete (or on the onboarding page itself), render the requested route content
  console.log('ProtectedRoute: Access granted, rendering Outlet.');
  return <Outlet />;
};

export default ProtectedRoute;