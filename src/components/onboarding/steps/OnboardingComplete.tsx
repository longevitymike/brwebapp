import React from 'react';
import Confetti from 'react-confetti';
import WolfMascot from '@/components/mascot/WolfMascot'; // Use existing mascot
import FancyButton from '@/components/ui/FancyButton'; // Use existing button
import useWindowSize from '@/hooks/useWindowSize'; // Assuming a hook for window size

interface OnboardingCompleteProps {
  onFinish: () => void; // Function to call when finishing
}

export default function OnboardingComplete({ onFinish }: OnboardingCompleteProps) {
  const { width, height } = useWindowSize(); // Use hook for window dimensions

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white overflow-hidden">
      {/* Only render confetti if window size is determined */}
      {width > 0 && height > 0 && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      )}

      {/* Mascot positioned relative to this container now */}
      <div className="absolute bottom-4 right-4 z-20">
         <WolfMascot pose="celebrate" />
      </div>

      <div className="relative z-10 flex flex-col items-center"> {/* Content wrapper */}
        <h1 className="text-3xl sm:text-4xl font-bold mt-6 text-[#007FFF]">You’re all set, Champ 🎉</h1>
        <p className="text-gray-600 mt-2 text-lg">Let’s unlock your first session together.</p>

        {/* Added dashboard information */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-blue-800 font-medium">Your athlete dashboard is ready!</p>
          <p className="text-blue-600 text-sm mt-1">Track your progress, access workouts, and more.</p>
        </div>

        {/* Use FancyButton and call onFinish */}
        <FancyButton onClick={onFinish} className="mt-6">
          Go to Dashboard 🚀
        </FancyButton>
      </div>
    </div>
  );
}