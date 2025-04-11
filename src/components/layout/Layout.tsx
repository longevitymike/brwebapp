
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import ThemeToggle from "../theme/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-glow text-2xl font-semibold">
          Loading Barefoot Reset...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login (this could be done with a protected route component)
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 mx-auto max-w-4xl">
        {/* Theme toggle in header */}
        <div className="flex justify-end pt-4">
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>
        <main className="pt-4 pb-20 md:pt-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <Navbar />
    </div>
  );
};

export default Layout;
