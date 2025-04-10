import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Types
export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: {
    type: 'streak' | 'count' | 'specific';
    value: number | string;
  };
  unlocked?: boolean;
  unlockedAt?: string;
  tier?: 'bronze' | 'silver' | 'gold';
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  videoUrl: string;
  week: number;
  day: number;
  focus: string;
  phase: 'foundation' | 'progression' | 'mastery'; // Added phase property
  steps: {
    title: string;
    description: string;
    type?: 'release' | 'restore' | 're-engineer'; // Color coding for steps
    gifUrl?: string; // For step previews
  }[];
}

interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  completedAt: string;
}

interface BadgeUnlock {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string;
}

interface WorkoutContextType {
  workouts: Workout[];
  badges: Badge[];
  workoutLogs: WorkoutLog[];
  badgeUnlocks: BadgeUnlock[];
  currentStreak: number;
  progressPercentage: number;
  isLoading: boolean;
  getNextWorkout: () => Workout | null;
  completeWorkout: (workoutId: string) => void;
  getUnlockedBadges: () => Badge[];
  getLockedBadges: () => Badge[];
  getTotalWorkouts: () => number;
  getCompletedWorkouts: () => number;
  getPhaseWorkouts: (phase: string) => Workout[];
  getWorkoutsByPhase: () => { [phase: string]: Workout[] };
  getWorkoutProgress: (workoutId: string) => number; // Added to track step progress
}

// Create the context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Mock data
const mockWorkouts: Workout[] = [
  {
    id: 'w1',
    title: 'Foundation & Balance',
    description: 'Begin your barefoot journey with foundational exercises.',
    duration: 20,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 1,
    focus: 'Foundation',
    phase: 'foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of gentle movements to prepare your feet and ankles.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Workout',
        description: '10 minutes of foundation exercises, focusing on proper foot alignment.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of stretches to enhance flexibility and recovery.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  },
  {
    id: 'w2',
    title: 'Strength & Mobility',
    description: 'Focus on building strength in your feet and improving ankle mobility.',
    duration: 25,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 2,
    focus: 'Strength',
    phase: 'foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of dynamic foot and ankle movements.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Workout',
        description: '15 minutes of strength exercises for your feet and calves.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of recovery stretches.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  },
  {
    id: 'w3',
    title: 'Speed & Agility',
    description: 'Enhance your foot speed and agility with dynamic movements.',
    duration: 30,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 3,
    focus: 'Speed',
    phase: 'foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of dynamic foot movements.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Workout',
        description: '20 minutes of speed and agility drills.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of recovery exercises.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  },
  {
    id: 'w4',
    title: 'Endurance & Balance',
    description: 'Build endurance in your feet and legs while improving balance.',
    duration: 35,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 4,
    focus: 'Endurance',
    phase: 'foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of gentle movements.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Workout',
        description: '25 minutes of endurance and balance exercises.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of stretching and recovery.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  },
  {
    id: 'w5',
    title: 'Recovery & Flexibility',
    description: 'Focus on recovery and enhancing flexibility in your feet and ankles.',
    duration: 20,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 5,
    focus: 'Recovery',
    phase: 'foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '3 minutes of gentle movements.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Workout',
        description: '12 minutes of flexibility exercises.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of deep stretches and relaxation.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  },
  {
    id: 'w6',
    title: 'Advanced Foundation',
    description: 'Build upon foundation exercises with more advanced movements.',
    duration: 25,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 2,
    day: 1,
    focus: 'Foundation',
    phase: 'progression',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of preparation exercises.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Workout',
        description: '15 minutes of advanced foundation work.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of recovery stretches.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  },
  {
    id: 'w7',
    title: 'Mastery Challenge',
    description: 'Test your barefoot skills with advanced exercises.',
    duration: 40,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 3,
    day: 1,
    focus: 'Mastery',
    phase: 'mastery',
    steps: [
      {
        title: 'Warm-up',
        description: '8 minutes of dynamic activation.',
        type: 'release',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Main Challenge',
        description: '25 minutes of mastery exercises and testing.',
        type: 'restore',
        gifUrl: 'https://via.placeholder.com/150'
      },
      {
        title: 'Cooldown',
        description: '7 minutes of advanced recovery techniques.',
        type: 're-engineer',
        gifUrl: 'https://via.placeholder.com/150'
      }
    ]
  }
];

const mockBadges: Badge[] = [
  {
    id: 'b1',
    title: 'First Step',
    description: 'Complete your first workout',
    emoji: '👣',
    condition: {
      type: 'count',
      value: 1
    },
    tier: 'bronze'
  },
  {
    id: 'b2',
    title: 'Consistent Athlete',
    description: 'Complete 3 days in a row',
    emoji: '🔥',
    condition: {
      type: 'streak',
      value: 3
    },
    tier: 'bronze'
  },
  {
    id: 'b3',
    title: 'Week Champion',
    description: 'Complete all workouts in a week',
    emoji: '🏆',
    condition: {
      type: 'specific',
      value: 'week1'
    },
    tier: 'silver'
  },
  {
    id: 'b4',
    title: 'Balance Master',
    description: 'Complete 5 workouts',
    emoji: '⚖️',
    condition: {
      type: 'count',
      value: 5
    },
    tier: 'silver'
  },
  {
    id: 'b5',
    title: 'Barefoot Warrior',
    description: 'Reach a 7-day streak',
    emoji: '⚔️',
    condition: {
      type: 'streak',
      value: 7
    },
    tier: 'silver'
  },
  {
    id: 'b6',
    title: 'Flex Master',
    description: 'Complete all flexibility workouts',
    emoji: '🧘',
    condition: {
      type: 'specific',
      value: 'flexibility'
    },
    tier: 'bronze'
  },
  {
    id: 'b7',
    title: 'Foundation Master',
    description: 'Complete all Phase 1 workouts',
    emoji: '🏗️',
    condition: {
      type: 'specific',
      value: 'foundation'
    },
    tier: 'silver'
  },
  {
    id: 'b8',
    title: 'Foot Commander',
    description: 'Complete all Foot Strength workouts',
    emoji: '👟',
    condition: {
      type: 'specific',
      value: 'strength'
    },
    tier: 'silver'
  },
  {
    id: 'b9',
    title: '7-Day Beast',
    description: 'Maintain a 7-day streak',
    emoji: '🦁',
    condition: {
      type: 'streak',
      value: 7
    },
    tier: 'gold'
  },
  {
    id: 'b10',
    title: 'Bounce Boss',
    description: 'Complete all hop workouts',
    emoji: '🦘',
    condition: {
      type: 'specific',
      value: 'hop'
    },
    tier: 'gold'
  },
  {
    id: 'b11',
    title: 'Mastery Unlocked',
    description: 'Complete the final workout',
    emoji: '🎓',
    condition: {
      type: 'specific',
      value: 'mastery'
    },
    tier: 'gold'
  },
  {
    id: 'b12',
    title: 'No Skip Hero',
    description: 'Complete 10 workouts without skipping a day',
    emoji: '🦸',
    condition: {
      type: 'specific',
      value: 'noskip'
    },
    tier: 'gold'
  },
  {
    id: 'b13',
    title: 'Consistency King',
    description: 'Complete 15 workouts total',
    emoji: '👑',
    condition: {
      type: 'count',
      value: 15
    },
    tier: 'gold'
  }
];

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [badgeUnlocks, setBadgeUnlocks] = useState<BadgeUnlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const savedLogs = localStorage.getItem(`barefoot_workout_logs_${user.id}`);
      const savedBadges = localStorage.getItem(`barefoot_badge_unlocks_${user.id}`);
      
      if (savedLogs) {
        setWorkoutLogs(JSON.parse(savedLogs));
      }
      
      if (savedBadges) {
        setBadgeUnlocks(JSON.parse(savedBadges));
        
        const unlockedBadgeIds = JSON.parse(savedBadges).map((unlock: BadgeUnlock) => unlock.badgeId);
        setBadges(prevBadges => 
          prevBadges.map(badge => ({
            ...badge,
            unlocked: unlockedBadgeIds.includes(badge.id),
            unlockedAt: unlockedBadgeIds.includes(badge.id) ? 
              JSON.parse(savedBadges).find((unlock: BadgeUnlock) => unlock.badgeId === badge.id).unlockedAt : 
              undefined
          }))
        );
      }
    }
    
    setIsLoading(false);
  }, [user]);

  const saveWorkoutLogs = (logs: WorkoutLog[]) => {
    if (user) {
      localStorage.setItem(`barefoot_workout_logs_${user.id}`, JSON.stringify(logs));
    }
  };

  const saveBadgeUnlocks = (unlocks: BadgeUnlock[]) => {
    if (user) {
      localStorage.setItem(`barefoot_badge_unlocks_${user.id}`, JSON.stringify(unlocks));
    }
  };

  const calculateStreak = (): number => {
    if (!user || workoutLogs.length === 0) return 0;
    
    const userLogs = workoutLogs.filter(log => log.userId === user.id);
    if (userLogs.length === 0) return 0;
    
    const sortedLogs = [...userLogs].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mostRecent = new Date(sortedLogs[0].completedAt);
    mostRecent.setHours(0, 0, 0, 0);
    
    if ((today.getTime() - mostRecent.getTime()) > 2 * 24 * 60 * 60 * 1000) {
      return 0;
    }
    
    let streak = 1;
    let currentDate = mostRecent;
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].completedAt);
      logDate.setHours(0, 0, 0, 0);
      
      const dayBefore = new Date(currentDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      
      if (logDate.getTime() === dayBefore.getTime()) {
        streak++;
        currentDate = logDate;
      } else if (logDate.getTime() < dayBefore.getTime()) {
        break;
      }
    }
    
    return streak;
  };
  
  const currentStreak = calculateStreak();
  
  const getNextWorkout = (): Workout | null => {
    if (!user) return null;
    
    const completedWorkoutIds = workoutLogs
      .filter(log => log.userId === user.id)
      .map(log => log.workoutId);
    
    const nextWorkout = workouts.find(workout => !completedWorkoutIds.includes(workout.id));
    return nextWorkout || null;
  };

  const getPhaseWorkouts = (phase: string): Workout[] => {
    return workouts.filter(workout => workout.phase === phase);
  };

  const getWorkoutsByPhase = () => {
    return workouts.reduce((acc, workout) => {
      if (!acc[workout.phase]) {
        acc[workout.phase] = [];
      }
      acc[workout.phase].push(workout);
      return acc;
    }, {} as { [phase: string]: Workout[] });
  };

  const getWorkoutProgress = (workoutId: string): number => {
    const isCompleted = workoutLogs.some(log => 
      log.userId === user?.id && log.workoutId === workoutId
    );
    return isCompleted ? 100 : 0;
  };
  
  const checkBadgeUnlocks = () => {
    if (!user) return;
    
    const userLogs = workoutLogs.filter(log => log.userId === user.id);
    const userUnlocks = badgeUnlocks.filter(unlock => unlock.userId === user.id);
    const unlockedBadgeIds = userUnlocks.map(unlock => unlock.badgeId);
    
    const newUnlocks: BadgeUnlock[] = [];
    
    badges.forEach(badge => {
      if (unlockedBadgeIds.includes(badge.id)) return;
      
      let shouldUnlock = false;
      
      if (badge.condition.type === 'count') {
        shouldUnlock = userLogs.length >= Number(badge.condition.value);
      } else if (badge.condition.type === 'streak') {
        shouldUnlock = currentStreak >= Number(badge.condition.value);
      } else if (badge.condition.type === 'specific') {
        if (badge.condition.value === 'week1') {
          const week1WorkoutIds = workouts
            .filter(workout => workout.week === 1)
            .map(workout => workout.id);
          
          const completedWeek1 = week1WorkoutIds.every(id => 
            userLogs.some(log => log.workoutId === id)
          );
          
          shouldUnlock = completedWeek1;
        } else if (badge.condition.value === 'flexibility') {
          const flexibilityWorkoutIds = workouts
            .filter(workout => workout.focus.toLowerCase().includes('flex'))
            .map(workout => workout.id);
          
          const completedFlexibility = flexibilityWorkoutIds.every(id => 
            userLogs.some(log => log.workoutId === id)
          );
          
          shouldUnlock = completedFlexibility;
        } else if (badge.condition.value === 'foundation') {
          const foundationWorkoutIds = workouts
            .filter(workout => workout.phase === 'foundation')
            .map(workout => workout.id);
          
          const completedFoundation = foundationWorkoutIds.every(id => 
            userLogs.some(log => log.workoutId === id)
          );
          
          shouldUnlock = completedFoundation;
        } else if (badge.condition.value === 'strength') {
          const strengthWorkoutIds = workouts
            .filter(workout => workout.focus.toLowerCase().includes('strength'))
            .map(workout => workout.id);
          
          const completedStrength = strengthWorkoutIds.every(id => 
            userLogs.some(log => log.workoutId === id)
          );
          
          shouldUnlock = completedStrength;
        } else if (badge.condition.value === 'hop') {
          const hopWorkoutIds = workouts
            .filter(workout => {
              const hasHopStep = workout.steps.some(step => 
                step.description.toLowerCase().includes('hop')
              );
              return hasHopStep;
            })
            .map(workout => workout.id);
          
          const completedHop = hopWorkoutIds.length > 0 && hopWorkoutIds.every(id => 
            userLogs.some(log => log.workoutId === id)
          );
          
          shouldUnlock = completedHop;
        } else if (badge.condition.value === 'mastery') {
          const finalWorkoutIds = workouts
            .filter(workout => workout.phase === 'mastery')
            .map(workout => workout.id);
          
          const completedFinal = finalWorkoutIds.length > 0 && userLogs.some(log => 
            finalWorkoutIds.includes(log.workoutId)
          );
          
          shouldUnlock = completedFinal;
        } else if (badge.condition.value === 'noskip') {
          shouldUnlock = userLogs.length >= 10;
        }
      }
      
      if (shouldUnlock) {
        const newUnlock: BadgeUnlock = {
          id: `unlock_${Date.now()}_${badge.id}`,
          userId: user.id,
          badgeId: badge.id,
          unlockedAt: new Date().toISOString()
        };
        
        newUnlocks.push(newUnlock);
        
        setBadges(prevBadges => 
          prevBadges.map(b => 
            b.id === badge.id ? { ...b, unlocked: true, unlockedAt: newUnlock.unlockedAt } : b
          )
        );
        
        toast.success(`🎉 Badge Unlocked: ${badge.title}`, {
          description: badge.description,
          duration: 5000,
        });
      }
    });
    
    if (newUnlocks.length > 0) {
      const updatedUnlocks = [...badgeUnlocks, ...newUnlocks];
      setBadgeUnlocks(updatedUnlocks);
      saveBadgeUnlocks(updatedUnlocks);
    }
  };
  
  const completeWorkout = (workoutId: string) => {
    if (!user) return;
    
    const alreadyCompleted = workoutLogs.some(log => 
      log.userId === user.id && log.workoutId === workoutId
    );
    
    if (alreadyCompleted) {
      toast.error("You've already completed this workout");
      return;
    }
    
    const newLog: WorkoutLog = {
      id: `log_${Date.now()}`,
      userId: user.id,
      workoutId: workoutId,
      completedAt: new Date().toISOString()
    };
    
    const updatedLogs = [...workoutLogs, newLog];
    setWorkoutLogs(updatedLogs);
    saveWorkoutLogs(updatedLogs);
    
    toast.success('Workout completed! 💪', {
      description: 'Great job on finishing today\'s exercise.',
      duration: 3000,
    });
    
    setTimeout(() => checkBadgeUnlocks(), 1000);
  };
  
  const getTotalWorkouts = () => workouts.length;
  
  const getCompletedWorkouts = () => {
    if (!user) return 0;
    return new Set(
      workoutLogs
        .filter(log => log.userId === user.id)
        .map(log => log.workoutId)
    ).size;
  };
  
  const progressPercentage = Math.round((getCompletedWorkouts() / getTotalWorkouts()) * 100);
  
  const getUnlockedBadges = () => {
    return badges.filter(badge => badge.unlocked);
  };
  
  const getLockedBadges = () => {
    return badges.filter(badge => !badge.unlocked);
  };
  
  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        badges,
        workoutLogs,
        badgeUnlocks,
        currentStreak,
        progressPercentage,
        isLoading,
        getNextWorkout,
        completeWorkout,
        getUnlockedBadges,
        getLockedBadges,
        getTotalWorkouts,
        getCompletedWorkouts,
        getPhaseWorkouts,
        getWorkoutsByPhase,
        getWorkoutProgress
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
