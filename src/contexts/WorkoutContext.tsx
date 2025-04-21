
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@config/useAuth'; // Use Supabase auth hook
import { supabase } from '@config/supabaseClient'; // Import supabase client

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
  steps: {
    title: string;
    description: string;
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
}

// Create the context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Mock data
const mockWorkouts: Workout[] = [
  {
    id: 'w1',
    title: 'Week 1, Day 1 – Foundation & Balance',
    description: 'Begin your barefoot journey with foundational exercises.',
    duration: 20,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 1,
    focus: 'Foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of gentle movements to prepare your feet and ankles.'
      },
      {
        title: 'Main Workout',
        description: '10 minutes of foundation exercises, focusing on proper foot alignment.'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of stretches to enhance flexibility and recovery.'
      }
    ]
  },
  {
    id: 'w2',
    title: 'Week 1, Day 2 – Strength & Mobility',
    description: 'Focus on building strength in your feet and improving ankle mobility.',
    duration: 25,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 2,
    focus: 'Strength',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of dynamic foot and ankle movements.'
      },
      {
        title: 'Main Workout',
        description: '15 minutes of strength exercises for your feet and calves.'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of recovery stretches.'
      }
    ]
  },
  {
    id: 'w3',
    title: 'Week 1, Day 3 – Speed & Agility',
    description: 'Enhance your foot speed and agility with dynamic movements.',
    duration: 30,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 3,
    focus: 'Speed',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of dynamic foot movements.'
      },
      {
        title: 'Main Workout',
        description: '20 minutes of speed and agility drills.'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of recovery exercises.'
      }
    ]
  },
  {
    id: 'w4',
    title: 'Week 1, Day 4 – Endurance & Balance',
    description: 'Build endurance in your feet and legs while improving balance.',
    duration: 35,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 4,
    focus: 'Endurance',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of gentle movements.'
      },
      {
        title: 'Main Workout',
        description: '25 minutes of endurance and balance exercises.'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of stretching and recovery.'
      }
    ]
  },
  {
    id: 'w5',
    title: 'Week 1, Day 5 – Recovery & Flexibility',
    description: 'Focus on recovery and enhancing flexibility in your feet and ankles.',
    duration: 20,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 1,
    day: 5,
    focus: 'Recovery',
    steps: [
      {
        title: 'Warm-up',
        description: '3 minutes of gentle movements.'
      },
      {
        title: 'Main Workout',
        description: '12 minutes of flexibility exercises.'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of deep stretches and relaxation.'
      }
    ]
  },
  {
    id: 'w6',
    title: 'Week 2, Day 1 – Advanced Foundation',
    description: 'Build upon foundation exercises with more advanced movements.',
    duration: 25,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    week: 2,
    day: 1,
    focus: 'Foundation',
    steps: [
      {
        title: 'Warm-up',
        description: '5 minutes of preparation exercises.'
      },
      {
        title: 'Main Workout',
        description: '15 minutes of advanced foundation work.'
      },
      {
        title: 'Cooldown',
        description: '5 minutes of recovery stretches.'
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
    }
  },
  {
    id: 'b2',
    title: 'Consistent Athlete',
    description: 'Complete 3 days in a row',
    emoji: '🔥',
    condition: {
      type: 'streak',
      value: 3
    }
  },
  {
    id: 'b3',
    title: 'Week Champion',
    description: 'Complete all workouts in a week',
    emoji: '🏆',
    condition: {
      type: 'specific',
      value: 'week1'
    }
  },
  {
    id: 'b4',
    title: 'Balance Master',
    description: 'Complete 5 workouts',
    emoji: '⚖️',
    condition: {
      type: 'count',
      value: 5
    }
  },
  {
    id: 'b5',
    title: 'Barefoot Warrior',
    description: 'Reach a 7-day streak',
    emoji: '⚔️',
    condition: {
      type: 'streak',
      value: 7
    }
  },
  {
    id: 'b6',
    title: 'Flex Master',
    description: 'Complete all flexibility workouts',
    emoji: '🧘',
    condition: {
      type: 'specific',
      value: 'flexibility'
    }
  }
];

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]); // Initialize as empty
  const [badges, setBadges] = useState<Badge[]>([]); // Initialize as empty, remove mockBadges usage
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [badgeUnlocks, setBadgeUnlocks] = useState<BadgeUnlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log("WorkoutContext: Fetching initial data...");

      // Fetch workout definitions
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts') // Assuming table name is 'workouts'
        .select('*')
        .order('week', { ascending: true }) // Optional: order them
        .order('day', { ascending: true });

      if (workoutError) {
        console.error("Error fetching workouts:", workoutError);
        toast.error("Failed to load workout program.");
      } else {
        console.log("WorkoutContext: Fetched workouts:", workoutData);
        // TODO: Validate workoutData structure against Workout type if needed
        setWorkouts(workoutData || []);
      }

      // Fetch badge definitions
      const { data: badgeData, error: badgeError } = await supabase
        .from('badges') // Assuming table name is 'badges'
        .select('*');

      if (badgeError) {
        console.error("Error fetching badges:", badgeError);
        toast.error("Failed to load badges.");
        // Keep existing badges state or set to empty? For now, keep empty if fetch fails.
      } else {
        console.log("WorkoutContext: Fetched badges:", badgeData);
        // TODO: Validate badgeData structure against Badge type if needed
        setBadges(badgeData || []);
      }

      // Fetch user-specific data only if user is logged in
      if (user) {
        console.log("WorkoutContext: User found, fetching logs and unlocks for", user.id);
        // Fetch workout logs
        const { data: logData, error: logError } = await supabase
          .from('workout_logs') // Assuming table name
          .select('*')
          .eq('user_id', user.id); // Filter by user ID

        if (logError) {
          console.error("Error fetching workout logs:", logError);
          toast.error("Failed to load workout history.");
        } else {
          console.log("WorkoutContext: Fetched logs:", logData);
          setWorkoutLogs(logData || []);
        }

        // Fetch badge unlocks
        const { data: unlockData, error: unlockError } = await supabase
          .from('badge_unlocks') // Assuming table name
          .select('*')
          .eq('user_id', user.id); // Filter by user ID

        if (unlockError) {
          console.error("Error fetching badge unlocks:", unlockError);
          toast.error("Failed to load badge progress.");
        } else {
          console.log("WorkoutContext: Fetched unlocks:", unlockData);
          const fetchedUnlocks = unlockData || [];
          setBadgeUnlocks(fetchedUnlocks);

          // Update badge status based on fetched unlocks AND fetched badge definitions
          const unlockedBadgeIds = fetchedUnlocks.map(unlock => unlock.badgeId);
          // Use the freshly fetched badge definitions (badgeData) if available, otherwise current state
          const currentBadgeDefs = badgeData || badges;
          setBadges(currentBadgeDefs.map(badge => ({
              ...badge,
              unlocked: unlockedBadgeIds.includes(badge.id),
              unlockedAt: unlockedBadgeIds.includes(badge.id)
                ? fetchedUnlocks.find(unlock => unlock.badgeId === badge.id)?.unlockedAt
                : undefined
            }))
          );
        }
      } else {
         console.log("WorkoutContext: No user found, skipping user-specific data fetch.");
         // Reset user-specific state if necessary when user logs out
         setWorkoutLogs([]);
         setBadgeUnlocks([]);
         // Reset badges based on fetched definitions if available, otherwise empty
         setBadges((badgeData || []).map(b => ({ ...b, unlocked: false, unlockedAt: undefined })));
      }

      setIsLoading(false);
      console.log("WorkoutContext: Initial data fetch complete.");
    };

    fetchData();

    // TODO: Add Supabase real-time listeners for logs/unlocks if needed

  }, [user]); // Re-run fetch when user state changes (login/logout)

  // Remove localStorage saving functions
  // const saveWorkoutLogs = (logs: WorkoutLog[]) => { ... };
  // const saveBadgeUnlocks = (unlocks: BadgeUnlock[]) => { ... };

  const calculateStreak = (): number => {
    if (!user || workoutLogs.length === 0) return 0;
    
    const userLogs = workoutLogs.filter(log => log.userId === user.id);
    if (userLogs.length === 0) return 0;
    
    // Sort logs by date
    const sortedLogs = [...userLogs].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    // Check if there's a log from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const mostRecent = new Date(sortedLogs[0].completedAt);
    mostRecent.setHours(0, 0, 0, 0);
    
    // If most recent log is not from today or yesterday, streak is broken
    if ((today.getTime() - mostRecent.getTime()) > 2 * 24 * 60 * 60 * 1000) {
      return 0;
    }
    
    // Count consecutive days
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
  
  const checkBadgeUnlocks = async () => { // Add async keyword
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
        
        // Update badge status
        setBadges(prevBadges => 
          prevBadges.map(b => 
            b.id === badge.id ? { ...b, unlocked: true, unlockedAt: newUnlock.unlockedAt } : b
          )
        );
        
        // Show toast notification
        toast.success(`🎉 Badge Unlocked: ${badge.title}`, {
          description: badge.description,
          duration: 5000,
        });
      }
    });
    
    if (newUnlocks.length > 0) {
      // Optimistically update local state
      setBadgeUnlocks(prevUnlocks => [...prevUnlocks, ...newUnlocks]);

      // Prepare data for Supabase insert (map to match table columns if needed)
      const unlocksToInsert = newUnlocks.map(unlock => ({
        // id might be auto-generated by DB, or use unlock.id if it's UUID
        user_id: unlock.userId,
        badge_id: unlock.badgeId,
        unlocked_at: unlock.unlockedAt
      }));

      // Insert new unlocks into Supabase
      const { error: insertError } = await supabase
        .from('badge_unlocks')
        .insert(unlocksToInsert);

      if (insertError) {
        console.error("Error saving badge unlocks:", insertError);
        toast.error("Failed to save badge progress.");
        // Revert optimistic update on error
        setBadgeUnlocks(prevUnlocks => prevUnlocks.filter(
          unlock => !newUnlocks.some(nu => nu.id === unlock.id) // Assumes newUnlock.id is unique temporarily
        ));
      } else {
        console.log("New badge unlocks saved successfully:", newUnlocks);
      }
    }
  };
  
  const completeWorkout = (workoutId: string) => {
    if (!user) return;
    
    // Check if workout already completed
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
    // Save new log to Supabase (will be implemented in completeWorkout)
    // saveWorkoutLogs(updatedLogs); // Remove localStorage call
    
    toast.success('Workout completed! 💪', {
      description: 'Great job on finishing today\'s exercise.',
      duration: 3000,
    });
    
    // Check for badge unlocks
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
