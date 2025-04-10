
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import WorkoutCard from '@/components/dashboard/WorkoutCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import StreakTracker from '@/components/dashboard/StreakTracker';
import BadgeCarousel from '@/components/dashboard/BadgeCarousel';
import WorkoutTimeline from '@/components/dashboard/WorkoutTimeline';

const AthleteDashboard = () => {
  const { user } = useAuth();
  const { 
    workouts,
    getNextWorkout, 
    currentStreak, 
    getUnlockedBadges,
    getCompletedWorkouts,
    getTotalWorkouts,
    isLoading 
  } = useWorkout();
  
  const nextWorkout = getNextWorkout();
  const unlockedBadges = getUnlockedBadges();
  
  // Group workouts by week (as phases)
  const workoutsByPhase = workouts.reduce((acc, workout) => {
    const phaseKey = `Week ${workout.week}`;
    if (!acc[phaseKey]) {
      acc[phaseKey] = [];
    }
    acc[phaseKey].push(workout);
    return acc;
  }, {} as Record<string, typeof workouts>);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-lg">Loading your workouts...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="mr-2">
          <img
            src={user?.avatar || 'https://i.pravatar.cc/150?img=11'}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, <span className="heading-gradient">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground">Keep up the great progress!</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {nextWorkout ? (
          <>
            <h2 className="text-xl font-semibold">Today's Workout</h2>
            <WorkoutCard workout={nextWorkout} />
          </>
        ) : (
          <div className="card text-center py-12">
            <h3 className="text-xl font-semibold mb-2">All Done! 🎉</h3>
            <p className="text-muted-foreground">
              You've completed all available workouts.
              Check back soon for more exercises!
            </p>
          </div>
        )}
        
        {/* Workout Timeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Program</h2>
          <div className="space-y-2">
            {Object.entries(workoutsByPhase).map(([phase, phaseWorkouts]) => (
              <WorkoutTimeline 
                key={phase}
                phase={phase}
                workouts={phaseWorkouts}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
