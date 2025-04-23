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
      navigate('/login');
      return;
    }
    
    try {
      // Clean and prepare the data
      const profileData = {
        user_id: user.id,
        email: user.email,
        ...formData,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      };
      
      console.log("Saving profile with data:", profileData);
      
      // Perform the upsert operation with retry logic
      let attempts = 0;
      const maxAttempts = 3;
      let success = false;
      
      while (attempts < maxAttempts && !success) {
        attempts++;
        
        try {
          const { data, error } = await (supabase as any)
            .from('user_profiles')
            .upsert(profileData, {
              onConflict: 'user_id', // Ensure we handle conflicts properly
              returning: 'minimal' // Don't need returning data
            });
          
          console.log(`Attempt ${attempts} - Upsert result:`, data, "Error:", error);
          
          if (error) {
            if (attempts < maxAttempts) {
              console.log(`Retrying after error (attempt ${attempts}/${maxAttempts})...`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
              continue;
            }
            throw error;
          }
          
          success = true;
        } catch (innerError) {
          console.error(`Attempt ${attempts} - Error:`, innerError);
          if (attempts >= maxAttempts) throw innerError;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
      
      if (success) {
        console.log("OnboardingFlow: Profile saved successfully, redirecting to dashboard.");
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been saved successfully!',
          duration: 3000
        });
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Failed to save profile after multiple attempts');
      }
    } catch (e: any) {
      console.error('Error saving onboarding data:', e);
      toast({
        title: 'Profile Update Failed',
        description: e.message || 'Unexpected error. Please try again.',
        variant: 'destructive',
        duration: 5000
      });
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