import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use react-router-dom hook
import Confetti from 'react-confetti';
import WolfMascot from '@/components/mascot/WolfMascot'; // Corrected path
import FancyButton from '@/components/ui/FancyButton'; // Corrected path
import { supabase } from '@/integrations/supabase/client'; // Updated correct path
import { useAuth } from '@/contexts/AuthContext'; // Updated to correct path

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from our hook
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Perform onboarding completion on button click
  const handleComplete = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_complete: true })
      .eq('id', user.id);
    if (error) {
      console.error("OnboardingComplete: Error marking onboarding complete:", error);
      return;
    }
    console.log("OnboardingComplete: Onboarding marked complete successfully.");
    navigate('/', { replace: true });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white overflow-hidden">
      {/* Only render confetti if window size is determined */}
      {windowSize.width > 0 && windowSize.height > 0 && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />
      )}

      {/* Mascot positioned relative to this container now */}
      <div className="absolute bottom-4 right-4 z-20">
         <WolfMascot pose="celebrate" />
      </div>


      <div className="relative z-10 flex flex-col items-center"> {/* Content wrapper */}
        <h1 className="text-3xl sm:text-4xl font-bold mt-6 text-[#007FFF]">You’re all set, Champ 🎉</h1>
        <p className="text-gray-600 mt-2 text-lg">Let’s unlock your first session together.</p>

        <FancyButton onClick={handleComplete} className="mt-6"> {/* Navigate to athlete dashboard (mounted at root path) */}
          Start Now 🚀
        </FancyButton>
      </div>
    </div>
  );
}