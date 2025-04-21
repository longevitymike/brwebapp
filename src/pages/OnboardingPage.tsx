import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@config/supabaseClient';
import { useAuth } from '@config/useAuth'; // Assuming this is the Supabase hook
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Assuming shadcn/ui radio group
import { Label } from "@/components/ui/label"; // Assuming shadcn/ui label
import clsx from 'clsx';
import AnimatedGradientBackground from '@/components/effects/AnimatedGradientBackground';
import FancyButton from '@/components/ui/FancyButton';
import { motion } from 'framer-motion'; // Import motion

// Define the structure for user answers collected during onboarding
type UserAnswers = {
  name: string;
  ageBracket: string;
  favoriteSport: string;
  primaryGoal: string;
  weeklyCommitment: string;
  learningStyle: string;
};

// Define the sequence of onboarding steps
const steps = [
  'welcome',
  'name',
  'age',
  'sport',
  'goal',
  'days',
  'style',
  'coach', // Final step before completion page
];

// Options for selection steps
const ageOptions = ["Under 18", "18-24", "25-34", "35-44", "45+"];
const sportOptions = ["Running", "Basketball", "Soccer", "Tennis", "Gymnastics", "Dance", "Martial Arts", "Other"];
const goalOptions = ["Improve Performance", "Prevent Injuries", "Increase Speed/Agility", "Better Balance", "General Foot Health"];
const daysOptions = ["1-2 days/week", "3-4 days/week", "5+ days/week"];
const styleOptions = ["Visual (Videos)", "Structured (Step-by-step)", "Quick & Efficient", "Data-Driven (Track Progress)"];

// The Onboarding Page component
export default function OnboardingPage() {
  const [step, setStep] = useState(steps[0]); // Start at the first step
  const [answers, setAnswers] = useState<UserAnswers>({
    name: '',
    ageBracket: '',
    favoriteSport: '',
    primaryGoal: '',
    weeklyCommitment: '',
    learningStyle: '',
  });

  const { user } = useAuth(); // Get user info from the Supabase auth hook
  const navigate = useNavigate();

  // Function to proceed to the next step or finish onboarding
  const next = async () => {
    const currentIndex = steps.indexOf(step);

    // If the current step is the final one ('done') and user exists
    if (step === 'done' && user) {
      console.log("Attempting to update profile for user:", user.id, "with answers:", answers);
      const { error } = await supabase
        .from('profiles') // Target the 'profiles' table
        .update({ // Update these fields
          name: answers.name,
          age_bracket: answers.ageBracket,
          favorite_sport: answers.favoriteSport,
          primary_goal: answers.primaryGoal,
          weekly_commitment: answers.weeklyCommitment,
          learning_style: answers.learningStyle,
          onboarding_complete: true, // Mark onboarding as complete
        })
        .eq('id', user.id); // Where the profile ID matches the authenticated user's ID

      if (!error) {
        console.log("Profile updated successfully. Navigating to dashboard.");
        // Use replace to prevent going back to onboarding
        navigate('/', { replace: true }); // Navigate to the main dashboard on success
      } else {
        // Log any error during the Supabase update
        console.error('Supabase error updating profile:', error.message);
        // TODO: Optionally show an error message to the user
      }
      return; // Stop further processing after attempting update
    }

    // If not the 'done' step, move to the next step in the sequence
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  // Function to update the answers state when input changes
  const handleRadioChange = (key: keyof UserAnswers, value: string) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [key]: value }));
  };

  const handleInputChange = (key: keyof UserAnswers, value: string) => {
     setAnswers(prevAnswers => ({ ...prevAnswers, [key]: value }));
  };

  // Helper to check if the current step's answer is provided (for disabling Next button)
  const isStepComplete = (): boolean => {
    switch (step) {
      case 'name': return !!answers.name;
      case 'age': return !!answers.ageBracket;
      case 'sport': return !!answers.favoriteSport;
      case 'goal': return !!answers.primaryGoal;
      case 'days': return !!answers.weeklyCommitment;
      case 'style': return !!answers.learningStyle;
      case 'coach': return true; // Coach step might just be informational
      case 'welcome': return true;
      // No 'done' check needed
      default: return false;
    }
  };

  // Generic function to render radio group steps
  const renderRadioStep = (
    stepKey: keyof UserAnswers,
    title: string,
    options: string[]
  ) => (
    <div className="space-y-4 text-left">
      <Label className="block text-xl font-semibold text-gray-700 text-center mb-4">{title}</Label>
      <RadioGroup
        value={answers[stepKey]}
        onValueChange={(value) => handleRadioChange(stepKey, value)}
        className="grid grid-cols-1 gap-2" // Adjusted grid layout
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
            <RadioGroupItem value={option} id={`${stepKey}-${option}`} />
            <Label htmlFor={`${stepKey}-${option}`} className="font-normal flex-1 cursor-pointer">{option}</Label>
          </div>
        ))}
      </RadioGroup>
      {/* Replace standard button with motion button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          "relative w-full bg-gradient-to-r from-[#007FFF] to-[#00C6FF] text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 outline-none",
          !isStepComplete() && "opacity-50 cursor-not-allowed" // Apply disabled styles conditionally
        )}
        onClick={next}
        disabled={!isStepComplete()}
      >
        <span className="z-10 relative">Next →</span>
        {/* Optional pulse effect for enabled state */}
        {!isStepComplete() ? null : <div className="absolute inset-0 bg-white/10 blur-xl rounded-full animate-pulse"></div>}
      </motion.button>
    </div>
  );


  // Render the appropriate content based on the current step
  return (
    // Add the wrapper for the background
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedGradientBackground />
      {/* Make the main content container relative and centered */}
      <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Apply glassmorphic styles to the inner card */}
        <div className="w-full max-w-md space-y-6 text-center bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-xl">

        {/* Welcome Step */}
        {/* Welcome Step */}
        {step === 'welcome' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Champ 👟</h1>
            <p className="text-gray-600 mt-2 mb-6">Let's get you moving. Time to personalize your journey!</p>

            <button
              onClick={next}
              className="bg-gradient-to-r from-[#007FFF] to-[#00C6FF] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse"
            >
              Let's Go →
            </button>

            {/* Static Progress Bar for Welcome Step */}
            <div className="w-full mt-6">
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '12.5%' }}></div> {/* Static width for step 1 */}
              </div>
              <p className="text-sm text-gray-500 mt-2">Step 1 of {steps.length}</p>
            </div>

            <img
              // Assuming the mascot images are directly in public/mascot/
              // If they are in public/mascot/wolf_wave.png etc., adjust src accordingly
              src="/mascot/wolf_wave.png"
              alt="Waving Wolf Mascot"
              className="w-20 h-20 mx-auto mt-6 animate-bounce"
            />
          </>
        )}

        {/* Name Step */}
        {step === 'name' && (
          <div className="space-y-4">
            <Label htmlFor="nameInput" className="block text-xl font-semibold text-gray-700">What should we call you?</Label>
            <input
              id="nameInput"
              type="text"
              value={answers.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Replace standard button with motion button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                "relative w-full mt-6 bg-gradient-to-r from-[#007FFF] to-[#00C6FF] text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 outline-none",
                 !isStepComplete() && "opacity-50 cursor-not-allowed"
              )}
              onClick={next}
              disabled={!isStepComplete()}
            >
              <span className="z-10 relative">Next →</span>
              {!isStepComplete() ? null : <div className="absolute inset-0 bg-white/10 blur-xl rounded-full animate-pulse"></div>}
            </motion.button>
          </div>
        )}

        {/* Age Step */}
        {step === 'age' && renderRadioStep('ageBracket', 'Which age group are you in?', ageOptions)}

        {/* Sport Step */}
        {step === 'sport' && renderRadioStep('favoriteSport', 'What\'s your primary sport or activity?', sportOptions)}

        {/* Goal Step */}
        {step === 'goal' && renderRadioStep('primaryGoal', 'What\'s your main goal with Barefoot?', goalOptions)}

        {/* Days Step */}
        {step === 'days' && renderRadioStep('weeklyCommitment', 'How many days per week can you commit?', daysOptions)}

        {/* Style Step */}
        {step === 'style' && renderRadioStep('learningStyle', 'What\'s your preferred learning style?', styleOptions)}

        {/* Coach Step (Informational Placeholder) */}
        {step === 'coach' && (
           <div className="space-y-4">
             <h2 className="text-xl font-semibold text-gray-700">Meet Your Program</h2>
             <img src="/mascot.png" alt="Mascot" className="mx-auto h-24 w-24 my-4"/> {/* Assuming mascot in public */}
             <p className="text-gray-600">Based on your answers, we'll tailor a program just for you. Ready to start?</p>
             <FancyButton
               className="w-full mt-6"
               onClick={() => navigate('/onboarding/complete')} // Navigate to completion page
             >
               I'm Ready 🚀
             </FancyButton>
           </div>
       )}

        {/* 'done' step is removed as it's now a separate page */}

        {/* Dynamic Progress Indicator (Show only for steps *after* welcome) */}
        {step !== 'welcome' && (
          <div className="pt-4">
             <div className="w-full bg-gray-200 rounded-full h-1.5">
               <div
                 className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                 // Calculate progress based on the index in the steps array
                 style={{ width: `${((steps.indexOf(step)) / (steps.length - 1)) * 100}%` }}
               ></div>
             </div>
            <p className="text-sm text-gray-500 mt-2">
              {/* Display current step number (index + 1) and total steps */}
              Step {steps.indexOf(step) + 1} of {steps.length}
            </p>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}