
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '@/contexts/WorkoutContext';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  ArrowLeft, 
  Clock, 
  MessageCircle,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const WorkoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, completeWorkout, workoutLogs } = useWorkout();
  
  const [workout, setWorkout] = useState(workouts.find(w => w.id === id));
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [openSteps, setOpenSteps] = useState<string[]>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Check if workout exists
  useEffect(() => {
    if (!workout) {
      toast.error("Workout not found");
      navigate('/');
      return;
    }
    
    // Check if already completed
    const isAlreadyCompleted = workoutLogs.some(log => log.workoutId === workout.id);
    if (isAlreadyCompleted) {
      setCompleted(true);
    }
    
    // Open the first step by default
    if (workout.steps.length > 0) {
      setOpenSteps([workout.steps[0].title]);
    }
  }, [workout, workoutLogs, navigate]);
  
  // Timer logic
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
      
      // Show completion message
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleStep = (title: string) => {
    if (openSteps.includes(title)) {
      setOpenSteps(openSteps.filter(step => step !== title));
    } else {
      setOpenSteps([...openSteps, title]);
    }
  };
  
  const handleAskTrainer = () => {
    toast.info("Ask a Trainer feature coming soon!", {
      description: "In a future update, you'll be able to get live advice from a qualified trainer.",
      duration: 5000,
    });
  };
  
  const getStepTypeColor = (type: string | undefined) => {
    switch(type) {
      case 'release':
        return 'bg-green-500';
      case 'restore':
        return 'bg-blue-500';
      case 're-engineer':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (!workout) return null;
  
  return (
    <div className="pb-8 md:pb-0">
      <div className="mb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
          Phase {workout.phase === 'foundation' ? '1' : workout.phase === 'progression' ? '2' : '3'} · 
          Workout {workout.day} of {workouts.filter(w => w.phase === workout.phase).length}
        </div>
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
        
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 mb-6 relative">
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <div className="text-primary">Loading video...</div>
            </div>
          )}
          <iframe 
            ref={videoRef}
            src={workout.videoUrl}
            className="w-full h-full" 
            title={workout.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setVideoLoaded(true)}
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
            <div 
              key={index} 
              className="border border-gray-100 rounded-xl overflow-hidden"
            >
              <div 
                className="bg-gray-50 p-4 cursor-pointer flex items-center justify-between"
                onClick={() => toggleStep(step.title)}
              >
                <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full mr-3 ${getStepTypeColor(step.type)}`} />
                  <div className="font-bold">{step.title}</div>
                </div>
                {openSteps.includes(step.title) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {openSteps.includes(step.title) && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4">
                    {step.gifUrl && (
                      <div className="md:w-1/3">
                        <img 
                          src={step.gifUrl} 
                          alt={step.title} 
                          className="rounded-lg w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    <div className={step.gifUrl ? "md:w-2/3" : "w-full"}>
                      <div className="text-sm text-muted-foreground mb-2">{step.description}</div>
                      <div className="text-xs font-medium text-gray-500 mt-3">
                        {step.type === 'release' && '🟢 Release: Gentle movements to prepare your body'}
                        {step.type === 'restore' && '🔵 Restore: Build strength and stability'}
                        {step.type === 're-engineer' && '🔴 Re-engineer: Create new movement patterns'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleAskTrainer}
            className="flex items-center justify-center py-3 rounded-xl border border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask a Trainer
          </button>
          
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
      
      <div className="fixed bottom-20 md:bottom-6 right-6 z-10">
        <div className="bg-white rounded-full shadow-lg p-2 border border-gray-100">
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            onClick={() => {
              toast.info("Progress tracking feature coming soon!", {
                description: "You'll be able to track your progress through each workout step.",
              });
            }}
          >
            <Clock className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;
