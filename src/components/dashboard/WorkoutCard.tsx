
import { useNavigate } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Workout } from '@/contexts/WorkoutContext';

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const navigate = useNavigate();
  
  const handleStartWorkout = () => {
    navigate(`/workout/${workout.id}`);
  };
  
  return (
    <div className="card animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-primary-gradient text-white p-2 rounded-lg">
          <span className="font-semibold">Week {workout.week} • Day {workout.day}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          <span>{workout.duration} min</span>
        </div>
      </div>
      
      <h3 className="text-xl md:text-2xl font-semibold mb-2">{workout.title}</h3>
      <p className="text-muted-foreground mb-4">{workout.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="inline-block px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium">
          {workout.focus}
        </span>
        <button 
          className="btn-primary flex items-center"
          onClick={handleStartWorkout}
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;
