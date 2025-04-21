import { useState } from 'react'; // Add useState import
import { Player } from '@lottiefiles/react-lottie-player';
import clsx from 'clsx';
import Modal from '@/components/AnimatedModal'; // Assuming this path is correct
import { useMilestoneEffect } from '@/hooks/useMilestoneEffect';

type Props = {
  streakCount?: number; // Make prop optional with default
  variant?: 'default' | 'compact';
};

const STREAK_MILESTONES = [7, 14, 30]; // Define milestones

export default function StreakProgressCard({ streakCount = 0, variant = 'default' }: Props) {
  const [showModal, setShowModal] = useState(false);
  const isMilestone = STREAK_MILESTONES.includes(streakCount);
  const progressWidth = Math.min((streakCount / 7) * 100, 100); // Assuming 7 is the milestone for width calculation

  // Use the hook to trigger sound and modal
  useMilestoneEffect(streakCount, streakCount, () => {
    if (isMilestone) {
        console.log(`Triggering modal for ${streakCount}-day milestone.`);
        setShowModal(true);
    }
  });

  return (
    <>
      <div
        className={clsx(
          'flex items-center rounded-xl p-4 shadow-md transition-all',
          variant === 'default' ? 'bg-gradient-to-r from-blue-100 to-white' : 'bg-white',
          variant === 'compact' && 'py-2 px-3 gap-3',
          isMilestone && 'ring-2 ring-blue-400 animate-pulse shadow-blue-400/50'
        )}
      >
        {/* Use Player for .lottie file from public */}
        <div className="w-14 h-14">
           <Player
              autoplay
              loop
              src="/animations/flame.lottie" // Use path from public folder
              style={{ width: '100%', height: '100%' }}
            />
        </div>

        <div>
          <p className={clsx('text-sm font-semibold text-gray-600', variant === 'compact' && 'text-xs')}>
            Your Streak
          </p>
          <p className={clsx('text-xl font-bold text-blue-600', variant === 'compact' && 'text-lg')}>
            {streakCount} day{streakCount !== 1 && 's'}
          </p>
          {isMilestone && (
            <p className="text-xs font-medium text-blue-500">🔥 Milestone reached!</p>
          )}
           {/* Optional: Add progress bar back if needed */}
           <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
             <div
               className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
               style={{ width: `${progressWidth}%` }}
             ></div>
           </div>
        </div>
      </div>

      {/* Add the Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center space-y-4 p-4"> {/* Added padding */}
          <h2 className="text-xl font-bold">🔥 {streakCount}-Day Streak!</h2>
          <p>You've reached an official milestone. Keep it going!</p>
          {/* Optional: Add a Lottie animation inside the modal */}
          {/* <div className="w-32 h-32 mx-auto">
             <Player autoplay loop src="/animations/celebrate.lottie" />
          </div> */}
        </div>
      </Modal>
    </>
  );
}