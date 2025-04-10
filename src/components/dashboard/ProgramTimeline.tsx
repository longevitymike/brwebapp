
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight, Circle, CheckCircle, Lock } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Workout } from '@/contexts/WorkoutContext';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PhaseData {
  name: string;
  title: string;
  color: string;
  workouts: Workout[];
  progress: number;
}

const ProgramTimeline: React.FC = () => {
  const navigate = useNavigate();
  const { 
    workouts, 
    workoutLogs, 
    getWorkoutsByPhase,
    getWorkoutProgress
  } = useWorkout();
  
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [activePhase, setActivePhase] = useState<string>('foundation');
  
  useEffect(() => {
    const workoutsByPhase = getWorkoutsByPhase();
    
    // Create phase data
    const phasesData: PhaseData[] = [
      {
        name: 'foundation',
        title: 'Phase 1: Foundation',
        color: '#10B981', // success color from design spec
        workouts: workoutsByPhase['foundation'] || [],
        progress: calculatePhaseProgress('foundation', workoutsByPhase['foundation'] || [])
      },
      {
        name: 'progression',
        title: 'Phase 2: Progression',
        color: '#007fff', // primary color from design spec
        workouts: workoutsByPhase['progression'] || [],
        progress: calculatePhaseProgress('progression', workoutsByPhase['progression'] || [])
      },
      {
        name: 'mastery',
        title: 'Phase 3: Mastery',
        color: '#F59E0B', // warning color from design spec
        workouts: workoutsByPhase['mastery'] || [],
        progress: calculatePhaseProgress('mastery', workoutsByPhase['mastery'] || [])
      }
    ];
    
    setPhases(phasesData);
    
    // Determine active phase
    const foundationComplete = calculatePhaseProgress('foundation', workoutsByPhase['foundation'] || []) === 100;
    const progressionComplete = calculatePhaseProgress('progression', workoutsByPhase['progression'] || []) === 100;
    
    if (progressionComplete) {
      setActivePhase('mastery');
    } else if (foundationComplete) {
      setActivePhase('progression');
    } else {
      setActivePhase('foundation');
    }
  }, [workouts, workoutLogs]);
  
  const calculatePhaseProgress = (phase: string, phaseWorkouts: Workout[]): number => {
    if (phaseWorkouts.length === 0) return 0;
    
    const completedCount = phaseWorkouts.filter(workout => 
      getWorkoutProgress(workout.id) === 100
    ).length;
    
    return Math.round((completedCount / phaseWorkouts.length) * 100);
  };
  
  const isWorkoutCompleted = (workoutId: string): boolean => {
    return getWorkoutProgress(workoutId) === 100;
  };
  
  const isWorkoutLocked = (workout: Workout): boolean => {
    // Logic to determine if workout is locked
    // For simplicity, we'll say workouts are locked if all previous workouts in the phase are not completed
    const phaseWorkouts = phases.find(p => p.name === workout.phase)?.workouts || [];
    const workoutIndex = phaseWorkouts.findIndex(w => w.id === workout.id);
    
    // Workouts in previous phases might need all previous phase workouts completed
    const foundationComplete = phases.find(p => p.name === 'foundation')?.progress === 100;
    const progressionComplete = phases.find(p => p.name === 'progression')?.progress === 100;
    
    if (workout.phase === 'progression' && !foundationComplete) {
      return true;
    }
    
    if (workout.phase === 'mastery' && (!foundationComplete || !progressionComplete)) {
      return true;
    }
    
    // Within a phase, check if all previous workouts are completed
    if (workoutIndex > 0) {
      for (let i = 0; i < workoutIndex; i++) {
        if (!isWorkoutCompleted(phaseWorkouts[i].id)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  const getNextWorkout = (): Workout | null => {
    // Find the first incomplete workout that isn't locked
    for (const phase of phases) {
      for (const workout of phase.workouts) {
        if (!isWorkoutCompleted(workout.id) && !isWorkoutLocked(workout)) {
          return workout;
        }
      }
    }
    return null;
  };
  
  const handleWorkoutClick = (workout: Workout) => {
    if (isWorkoutLocked(workout)) {
      // Show message that workout is locked
      return;
    }
    navigate(`/workout/${workout.id}`);
  };
  
  return (
    <div className="card animate-slide-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Program Timeline</h2>
        <div className="flex gap-2">
          {phases.map((phase) => (
            <button
              key={phase.name}
              onClick={() => setActivePhase(phase.name)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                activePhase === phase.name
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {phase.name.charAt(0).toUpperCase() + phase.name.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {phases.map((phase) => (
        phase.name === activePhase && (
          <div key={phase.name} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium" style={{ color: phase.color }}>
                {phase.title}
              </h3>
              <div className="text-sm text-muted-foreground">
                {Math.round(phase.progress)}% complete
              </div>
            </div>
            
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${phase.progress}%`, backgroundColor: phase.color }}
              />
            </div>
            
            <div className="mt-4">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {phase.workouts.map((workout, index) => {
                    const isCompleted = isWorkoutCompleted(workout.id);
                    const isLocked = isWorkoutLocked(workout);
                    
                    return (
                      <CarouselItem key={workout.id} className="basis-[280px] sm:basis-[320px] md:basis-[350px]">
                        <Card 
                          className={`transition-all ${
                            isLocked 
                              ? 'opacity-60 grayscale'
                              : isCompleted 
                                ? 'border-green-200 shadow-md shadow-green-100'
                                : 'hover:shadow-md hover:border-primary/30'
                          } cursor-pointer`}
                          onClick={() => handleWorkoutClick(workout)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <Badge 
                                variant="outline" 
                                className="bg-gray-50"
                              >
                                Week {workout.week} · Day {workout.day}
                              </Badge>
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-200" />
                              )}
                            </div>
                            
                            <h4 className="font-medium mb-1">{workout.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {workout.description}
                            </p>
                            
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-xs text-muted-foreground">
                                {workout.duration} min · {workout.focus}
                              </div>
                              <button 
                                className={`text-xs flex items-center ${
                                  isLocked ? 'text-gray-400' : 'text-primary'
                                }`}
                              >
                                {isCompleted ? 'Review' : 'Start'} <ChevronRight className="w-3 h-3 ml-1" />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-1" />
                  <CarouselNext className="right-1" />
                </div>
              </Carousel>
            </div>
            
            {/* Next workout preview for current phase */}
            {phase.name === activePhase && getNextWorkout() && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#007fff]/10 to-[#00C6FF]/10 border border-primary/10">
                <div className="text-sm font-medium text-primary mb-1">Coming Up Next</div>
                <div className="font-medium">{getNextWorkout()?.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Focus: {getNextWorkout()?.focus} · {getNextWorkout()?.duration} min
                </div>
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default ProgramTimeline;
