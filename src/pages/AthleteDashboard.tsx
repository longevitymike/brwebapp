import React from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Use Supabase auth hook
import { useWorkout } from '@/contexts/WorkoutContext'; // Use our workout context
import WorkoutCard from '@/components/dashboard/WorkoutCard';
import ProgressBar from '@/components/dashboard/ProgressBar';
import DayTracker from '@/components/dashboard/StreakTracker';
// Removed Workout type import as it's handled by context now

export default function AthleteDashboard() {
  const { user } = useAuth();
  const {
    isLoading: workoutLoading,
    getNextWorkout,
    getCompletedWorkouts,
    getTotalWorkouts,
    currentStreak,
  } = useWorkout();

  // Attempt to get user's name, fallback to email if name isn't set in metadata
  // Supabase stores custom fields like name often in user_metadata
  const userName = user?.user_metadata?.name || 
                  (user?.email ? user.email.split('@')[0] : 'Athlete');

  // Safe access with null checks and defaults
  const nextWorkout = workoutLoading ? null : getNextWorkout();
  const completedWorkouts = workoutLoading ? 0 : getCompletedWorkouts() || 0;
  const totalWorkouts = workoutLoading ? 42 : getTotalWorkouts() || 42; // Default to 42 if undefined

  // Display loading state if context is still loading data
  if (workoutLoading) {
    // TODO: Replace with a proper loading spinner component
    return <div className="p-4 md:p-6 text-center">Loading dashboard data...</div>;
  }

  return (
    <section className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, <span className="text-primary">{userName}</span>!
        </h1>
        <p className="text-muted-foreground">Keep up the great progress!</p>
      </div>

      {/* Today's Workout */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Today's Workout</h2>
        {nextWorkout ? (
          <WorkoutCard 
            workout={nextWorkout} 
            videos={[
              "https://www.w3schools.com/html/mov_bbb.mp4",
              "https://www.w3schools.com/html/mov_bbb.mp4",
              "https://www.w3schools.com/html/mov_bbb.mp4",
              "https://www.w3schools.com/html/mov_bbb.mp4"
            ]}
          />
        ) : (
          <div className="card text-center p-6">
            <p className="text-muted-foreground">🎉 You've completed all available workouts! Well done!</p>
            {/* Optionally add a link to view history or badges */}
          </div>
        )}
      </div>

      {/* Progress & Streak Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <ProgressBar current={completedWorkouts} total={42} />
        <DayTracker completedDays={completedWorkouts} />
      </div>



      {/* Optional: Add other sections like Badges or Workout History later */}
      {/* Example: <RecentBadges /> */}
      {/* Example: <WorkoutHistoryPreview /> */}

    </section>
  );
}
