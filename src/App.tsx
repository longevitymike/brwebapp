import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; 
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import TooltipProviderWrapper from "./components/providers/TooltipProvider";
import PageWrapper from "./components/PageWrapper"; 

import Layout from "./components/layout/Layout";
import AthleteDashboard from "./pages/AthleteDashboard";
import WorkoutPage from "./pages/WorkoutPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import BadgesPage from "./pages/BadgesPage";
import Login from "./pages/Login";
import OnboardingFlow from "./components/onboarding/OnboardingFlow"; 
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ParentDashboard from "./pages/ParentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <TooltipProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />
                {/* Default redirect to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<OnboardingFlow />} />
                  <Route path="/dashboard" element={
                    <WorkoutProvider>
                      <PageWrapper>
                        <Layout />
                      </PageWrapper>
                    </WorkoutProvider>
                  }>
                    <Route index element={<AthleteDashboard />} />
                    <Route path="workout/:id" element={<WorkoutPage />} />
                    <Route path="progress" element={<ProgressPage />} />
                    <Route path="badges" element={<BadgesPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="parent-dashboard" element={<ParentDashboard />} />
                  </Route>
                </Route>
                {/* Fallback to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProviderWrapper>
  </React.StrictMode>
);

export default App;
