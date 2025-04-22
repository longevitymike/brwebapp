
import { useNavigate } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Workout } from '@/contexts/WorkoutContext';
import ProgressBar from '@/components/dashboard/ProgressBar';

interface WorkoutCardProps {
  workout: Workout;
  completed?: number;
  total?: number;
  videos?: string[];
}

const WorkoutCard = ({ workout, completed, total, videos }: WorkoutCardProps) => {
  const navigate = useNavigate();
  
  // Safety check - only navigate if workout and workout.id exist
  const handleStartWorkout = () => {
    if (workout && workout.id) {
      navigate(`/workout/${workout.id}`);
    } else {
      console.error("Cannot navigate: workout or workout.id is undefined");
    }
  };
  
  return (
    <div className="card animate-slide-in">
      {/* Progress Bar */}
      {typeof completed === 'number' && typeof total === 'number' && (
        <div className="mb-3">
          <ProgressBar current={completed} total={total} />
        </div>
      )}
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
      {/* Exercise Videos */}
      {Array.isArray(videos) && videos.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Exercise Videos</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {videos.map((videoUrl, idx) => {
              if (!videoUrl) return null;
              return (
                <div key={idx} className="aspect-video rounded-lg shadow-md overflow-hidden">
                  <video
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
