"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoginCard from "@/components/LoginCard";
import AnimatedGradientBackground from "@/components/effects/AnimatedGradientBackground";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedGradientBackground />
      <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <LoginCard />
      </main>
    </div>
  );
}
