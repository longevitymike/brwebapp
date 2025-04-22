"use client";

import LoginCard from "@/components/LoginCard";
import AnimatedGradientBackground from "@/components/effects/AnimatedGradientBackground";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated blue gradient background */}
      <AnimatedGradientBackground />
      <LoginCard />
    </div>
  );
}
