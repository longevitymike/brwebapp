-- Seed user profile for onboarding
-- Run this in Supabase SQL editor or via psql

INSERT INTO public.user_profiles (id, onboarding_complete)
SELECT id, false
FROM auth.users
WHERE email = 'mike@dcap.fund'
ON CONFLICT (id) DO UPDATE SET onboarding_complete = false;
