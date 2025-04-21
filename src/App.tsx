
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Restored AuthProvider import
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import TooltipProviderWrapper from "./components/providers/TooltipProvider";
import PageWrapper from "./components/PageWrapper"; // Import PageWrapper

import Layout from "./components/layout/Layout";
import AthleteDashboard from "./pages/AthleteDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import WorkoutPage from "./pages/WorkoutPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import BadgesPage from "./pages/BadgesPage";
import Login from "./pages/Login";
// import OnboardingPage from "./pages/OnboardingPage"; // Remove old page import
import OnboardingFlow from "./components/onboarding/OnboardingFlow"; // Import the new flow component
import OnboardingComplete from "./pages/onboarding/complete"; // Import completion page
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <TooltipProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <WorkoutProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  {/* Routes requiring authentication and onboarding check */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/onboarding" element={<OnboardingFlow />} /> {/* Use the new flow component */}
                    <Route path="/onboarding/complete" element={<OnboardingComplete />} /> {/* Add completion route */}
                    <Route path="/" element={<Layout />}>
                      <Route index element={<PageWrapper><AthleteDashboard /></PageWrapper>} />
                      <Route path="workout/:id" element={<PageWrapper><WorkoutPage /></PageWrapper>} />
                      <Route path="progress" element={<PageWrapper><ProgressPage /></PageWrapper>} />
                      <Route path="badges" element={<PageWrapper><BadgesPage /></PageWrapper>} />
                      <Route path="settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
                      <Route path="parent-dashboard" element={<PageWrapper><ParentDashboard /></PageWrapper>} />
                      {/* Add other protected routes inside Layout here */}
                    </Route>
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WorkoutProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProviderWrapper>
  </React.StrictMode>
);

export default App;
