import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Play, Pause, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useConfettiTrigger } from '@/components/effects/useConfettiTrigger';
import MascotCelebration from '@/components/effects/MascotCelebration';

const WorkoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, completeWorkout, workoutLogs } = useWorkout();
  
  const [workout, setWorkout] = useState(workouts.find(w => w.id === id));
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useConfettiTrigger(showConfetti);
  
  useEffect(() => {
    if (!workout) {
      toast.error("Workout not found");
      navigate('/');
      return;
    }
    
    const isAlreadyCompleted = workoutLogs.some(log => log.workoutId === workout.id);
    if (isAlreadyCompleted) {
      setCompleted(true);
    }
  }, [workout, workoutLogs, navigate]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerRunning) {
      interval = window.setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);
  
  const toggleTimer = () => {
    setTimerRunning(prev => !prev);
  };
  
  const resetTimer = () => {
    setElapsed(0);
    setTimerRunning(false);
  };
  
  const handleCompleteWorkout = () => {
    if (workout) {
      completeWorkout(workout.id);
      setCompleted(true);
      resetTimer();
      
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/');
      }, 3000);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!workout) return null;
  
  return (
    <div className="pb-8 md:pb-0">
      <MascotCelebration show={showConfetti} />
      
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-workout-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-primary-gradient text-white py-1 px-3 rounded-lg text-sm font-medium">
            Week {workout.week} • Day {workout.day}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{workout.duration} min</span>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">{workout.title}</h1>
        
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 mb-6">
          <iframe 
            src={workout.videoUrl}
            className="w-full h-full" 
            title={workout.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Timer</div>
            <div className="text-2xl font-bold">{formatTime(elapsed)}</div>
            <div className="mt-2">
              <button 
                onClick={toggleTimer}
                className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Focus</div>
            <div className="text-lg font-bold">{workout.focus}</div>
            <div className="text-xs text-gray-500 mt-1">Targeted Training</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {workout.steps.map((step, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <div className="font-bold mb-1">{step.title}</div>
              <div className="text-sm text-muted-foreground">{step.description}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleCompleteWorkout}
            disabled={completed}
            className={`w-full py-3 rounded-xl flex items-center justify-center font-semibold ${
              completed 
              ? 'bg-green-500 text-white cursor-not-allowed' 
              : 'btn-primary'
            }`}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {completed ? 'Workout Completed!' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
