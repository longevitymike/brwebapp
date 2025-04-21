import { useState, useEffect } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Trophy } from 'lucide-react';
import DayTracker from '@/components/dashboard/StreakTracker';
import RewardCelebration from '@/components/effects/RewardCelebration';
import FireCalendar from '@/components/dashboard/FireCalendar'; // Import FireCalendar
const ProgressPage = () => {
  const { 
    workoutLogs, 
    workouts,
    currentStreak,
    progressPercentage,
    getCompletedWorkouts,
    getTotalWorkouts
  } = useWorkout();
  
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Check for milestone achievements
  useEffect(() => {
    const completedCount = getCompletedWorkouts();
    
    // Celebrate milestone achievements (every 5 workouts)
    if (completedCount > 0 && completedCount % 5 === 0 && !sessionStorage.getItem(`celebrated-${completedCount}`)) {
      setShowCelebration(true);
      sessionStorage.setItem(`celebrated-${completedCount}`, 'true');
      
      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  }, [getCompletedWorkouts]);
  
  // Generate weekly data
  const generateWeeklyData = () => {
    const weeks: Record<number, number> = {};
    
    // Count completed workouts by week
    workouts.forEach(workout => {
      if (!weeks[workout.week]) {
        weeks[workout.week] = 0;
      }
      
      const isCompleted = workoutLogs.some(log => log.workoutId === workout.id);
      if (isCompleted) {
        weeks[workout.week]++;
      }
    });
    
    // Count total workouts by week
    const weekTotals: Record<number, number> = {};
    workouts.forEach(workout => {
      if (!weekTotals[workout.week]) {
        weekTotals[workout.week] = 0;
      }
      weekTotals[workout.week]++;
    });
    
    // Format data for chart
    return Object.keys(weeks).map(weekNum => {
      const week = Number(weekNum);
      return {
        name: `Week ${week}`,
        completed: weeks[week],
        total: weekTotals[week]
      };
    });
  };
  
  const weeklyData = generateWeeklyData();
  
  return (
    <div className="space-y-6">
      <RewardCelebration show={showCelebration} />
      
      <h1 className="text-3xl font-serif font-bold">Your Progress</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center mb-3">
            <Trophy className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Progress Overview</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Program Completion</div>
              <div className="flex items-end">
                <span className="text-3xl font-bold">{progressPercentage}%</span>
                <span className="text-muted-foreground ml-2 text-sm">completed</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-primary-gradient rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Workouts</div>
              <div className="flex items-center">
                <span className="text-3xl font-bold">{getCompletedWorkouts()}</span>
                <span className="text-muted-foreground ml-2">/ {getTotalWorkouts()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DayTracker completedDays={getCompletedWorkouts()} />
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="completed" name="Completed" fill="#007FFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
