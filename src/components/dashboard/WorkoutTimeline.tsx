
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lock, CheckCircle } from 'lucide-react';

interface WorkoutData {
  id: string;
  title: string;
  week: number;
  day: number;
  focus: string;
  duration: number;
}

interface WorkoutTimelineProps {
  phase: string;
  workouts: WorkoutData[];
}

const WorkoutTimeline = ({ phase, workouts }: WorkoutTimelineProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Fetch completed workout IDs from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchCompletedWorkouts = async () => {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('workout_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching completed workouts:', error);
        return;
      }
      
      if (data) {
        setCompletedIds(data.map(item => item.workout_id));
      }
    };
    
    fetchCompletedWorkouts();
  }, [user]);

  const handleSelectWorkout = (workout: WorkoutData, isLocked: boolean) => {
    if (isLocked) return;
    navigate(`/workout/${workout.id}`);
  };

  const getWorkoutStatus = (workout: WorkoutData, index: number) => {
    const isCompleted = completedIds.includes(workout.id);
    // First workout is unlocked by default, otherwise previous workout must be completed
    const isPreviousCompleted = index === 0 || completedIds.includes(workouts[index - 1]?.id);
    
    return {
      completed: isCompleted,
      locked: !isCompleted && !isPreviousCompleted
    };
  };

  return (
    <div className="w-full py-4">
      <h2 className="text-xl font-semibold mb-3">{phase}</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 pr-4">
          {workouts.map((workout, index) => {
            const { completed, locked } = getWorkoutStatus(workout, index);
            return (
              <div
                key={workout.id}
                onClick={() => handleSelectWorkout(workout, locked)}
                className={`
                  min-w-[200px] p-4 rounded-xl cursor-pointer transition-all duration-200
                  ${locked 
                    ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' 
                    : completed
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-white shadow-workout-card hover:shadow-workout-card-hover'}
                `}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium bg-gray-100 py-1 px-2 rounded-md">
                    Week {workout.week} • Day {workout.day}
                  </span>
                  <div className="flex items-center">
                    {completed && <CheckCircle className="w-4 h-4 text-primary" />}
                    {locked && <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
                <h3 className="font-medium mb-1 line-clamp-1">{workout.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{workout.focus}</p>
                <div className="text-xs text-muted-foreground">
                  {workout.duration} minutes
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkoutTimeline;
