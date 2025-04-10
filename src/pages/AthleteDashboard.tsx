
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import WorkoutCard from '@/components/dashboard/WorkoutCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import StreakTracker from '@/components/dashboard/StreakTracker';
import BadgeCarousel from '@/components/dashboard/BadgeCarousel';
import { useIsMobile } from '@/hooks/use-mobile';

const AthleteDashboard = () => {
  const { user } = useAuth();
  const { 
    getNextWorkout, 
    currentStreak, 
    getUnlockedBadges,
    getCompletedWorkouts,
    getTotalWorkouts,
    isLoading 
  } = useWorkout();
  
  const isMobile = useIsMobile();
  const nextWorkout = getNextWorkout();
  const unlockedBadges = getUnlockedBadges();
  const firstName = user?.name?.split(' ')[0] || 'Athlete';
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-lg">Loading your workouts...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-2">
        <div className="mr-3">
          <img
            src={user?.avatar || 'https://i.pravatar.cc/150?img=11'}
            alt="Profile"
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full`}
          />
        </div>
        <div>
          {isMobile ? (
            <h1 className="text-2xl font-bold">
              Hey <span className="heading-gradient">{firstName}!</span>
            </h1>
          ) : (
            <h1 className="text-2xl font-bold">
              Welcome back, <span className="heading-gradient">{firstName}</span>
            </h1>
          )}
          <p className="text-muted-foreground text-sm">
            {isMobile ? "Ready to train?" : "Keep up the great progress!"}
          </p>
        </div>
      </div>
      
      <div className="space-y-5">
        {nextWorkout ? (
          <>
            <h2 className="text-xl font-semibold mb-3">Today's Workout</h2>
            <WorkoutCard workout={nextWorkout} />
          </>
        ) : (
          <div className="card text-center py-10">
            <h3 className="text-xl font-semibold mb-2">All Done! 🎉</h3>
            <p className="text-muted-foreground">
              You've completed all available workouts.
              Check back soon for more exercises!
            </p>
          </div>
        )}
        
        <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
          <ProgressBar completed={getCompletedWorkouts()} total={getTotalWorkouts()} />
          <StreakTracker streak={currentStreak} />
        </div>
        
        {unlockedBadges.length > 0 && (
          <BadgeCarousel badges={unlockedBadges} title="Your Badges" />
        )}
      </div>
    </div>
  );
};

export default AthleteDashboard;
