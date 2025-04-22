import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AthleteDashboard from "@/components/AthleteDashboard";
import ParentDashboard from "@/components/ParentDashboard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<null | { role: string; onboarding_complete: boolean }>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user) {
      supabase
        .from("user_profiles")
        .select("role, onboarding_complete")
        .eq("user_id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            navigate("/onboarding", { replace: true });
          } else if (!data.onboarding_complete) {
            navigate("/onboarding", { replace: true });
          } else {
            setProfile(data);
            setLoadingProfile(false);
          }
        });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || loadingProfile) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return null; // or a spinner
  }

  return profile.role === "parent" ? <ParentDashboard /> : <AthleteDashboard />;
}
