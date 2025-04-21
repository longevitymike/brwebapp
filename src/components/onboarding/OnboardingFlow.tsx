import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Updated correct path
import { useAuth } from '@/contexts/AuthContext'; // Updated to correct path
import { toast } from '@/components/ui/use-toast'; // Add toast import

// Import step components
import NameEntry from './steps/NameEntry';
import AgeSelection from './steps/AgeSelection';
import GenderSelection from './steps/GenderSelection';
import SportSelection from './steps/SportSelection';
import GoalSelection from './steps/GoalSelection';
import FootHistory from './steps/FootHistory';
import SeasonSelection from './steps/SeasonSelection';
import OnboardingComplete from './steps/OnboardingComplete';

// Import background
import AnimatedGradientBackground from '@/components/effects/AnimatedGradientBackground';

// Define form data structure
interface OnboardingFormData {
  name?: string;
  age_bracket?: string;
  gender?: string;
  favorite_sport?: string;
  primary_goal?: string;
  foot_issues?: string; // Added foot issues
  season_status?: string; // Added season status (in_season or off_season)
  onboarding_complete?: boolean;
}

export default function OnboardingFlow() {
  const [step, setStep] = useState(0); // Use index for steps
  const [formData, setFormData] = useState<OnboardingFormData>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function called by step components to update data and move to next step
  const updateAnswer = (key: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1); // Increment step index
  };

  // Function called by the final step to save data and navigate
  const saveToSupabaseAndFinish = async () => {
    if (!user) {
      console.error("Onboarding finish: No user found!");
      // Handle error appropriately, maybe redirect to login
      navigate('/login');
      return;
    }

    // For demo purposes, we'll skip the actual Supabase update
    // and just simulate a successful save
    console.log("Saving onboarding data:", formData);
    
    // In a real app, we would do this:
    // const { error } = await supabase
    //   .from('user_profiles')
    //   .update({ ...formData, onboarding_complete: true })
    //   .eq('id', user.id);

    // Simulate successful save
    const error = null;

    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Profile Update Failed',
        description: 'An error occurred while saving your onboarding data.',
        variant: 'destructive',
      });
    } else {
      console.log("Profile updated successfully. Navigating to completion page.");
      // Navigate to the completion page instead of directly to dashboard
      navigate('/onboarding/complete', { replace: true });
    }
  };

  // Define the array of step components
  const steps = [
    // Step 1: Name
    <NameEntry key="name" onNext={(val) => updateAnswer('name', val)} />,
    // Step 2: Gender (now receives name correctly)
    <GenderSelection key="gender" name={formData.name || ''} onNext={(val) => updateAnswer('gender', val)} />,
    // Step 3: Age
    <AgeSelection key="age" onNext={(val) => updateAnswer('age_bracket', val)} />,
    // Step 4: Sport
    <SportSelection key="sport" onNext={(val) => updateAnswer('favorite_sport', val)} />,
    // Step 5: Goal
    <GoalSelection key="goal" onNext={(val) => updateAnswer('primary_goal', val)} />,
    // Step 6: Foot History
    <FootHistory key="history" onNext={(val) => updateAnswer('foot_issues', val)} />,
    // Step 7: Season Status
    <SeasonSelection key="season" onNext={(val) => updateAnswer('season_status', val)} />,
    // Step 8: Complete
    <OnboardingComplete key="complete" onFinish={saveToSupabaseAndFinish} />
  ];

  // Calculate progress
  const progressPercent = (step / (steps.length -1)) * 100; // Progress based on step index

  return (
    <div className="relative min-h-screen overflow-hidden">
       <AnimatedGradientBackground />
       <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
         {/* Glassmorphic card */}
         <div className="w-full max-w-md text-center bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-xl">
            {/* Render the current step */}
            {steps[step]}

            {/* Progress Indicator (shown on all steps except completion) */}
            {step < steps.length - 1 && (
              <div className="pt-6 mt-6 border-t border-white/20">
                 <div className="w-full bg-white/20 rounded-full h-1.5">
                   <div
                     className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                     style={{ width: `${progressPercent}%` }}
                   ></div>
                 </div>
                <p className="text-sm text-white/70 mt-2">
                  Step {step + 1} of {steps.length}
                </p>
              </div>
            )}
         </div>
       </main>
     </div>
  );
}