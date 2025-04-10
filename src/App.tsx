
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import TooltipProviderWrapper from "./components/providers/TooltipProvider";

import Layout from "./components/layout/Layout";
import AthleteDashboard from "./pages/AthleteDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import WorkoutPage from "./pages/WorkoutPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import BadgesPage from "./pages/BadgesPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <TooltipProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WorkoutProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<Layout />}>
                  <Route index element={<AthleteDashboard />} />
                  <Route path="workout/:id" element={<WorkoutPage />} />
                  <Route path="progress" element={<ProgressPage />} />
                  <Route path="badges" element={<BadgesPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="parent-dashboard" element={<ParentDashboard />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WorkoutProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProviderWrapper>
  </React.StrictMode>
);

export default App;
