
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import WorkoutCard from '@/components/dashboard/WorkoutCard';
import BadgeCarousel from '@/components/dashboard/BadgeCarousel';
import StreakTracker from '@/components/dashboard/StreakTracker';
import ProgressBar from '@/components/dashboard/ProgressBar';
import ProgramTimeline from '@/components/dashboard/ProgramTimeline';
import { Play, Award, TrendingUp, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AthleteDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    getNextWorkout, 
    progressPercentage, 
    currentStreak,
    getCompletedWorkouts,
    getTotalWorkouts,
    getUnlockedBadges
  } = useWorkout();
  
  const isMobile = useIsMobile();
  const nextWorkout = getNextWorkout();
  const unlockedBadges = getUnlockedBadges();
  const recentBadges = unlockedBadges.slice(0, 5);
  
  const completedWorkouts = getCompletedWorkouts();
  const totalWorkouts = getTotalWorkouts();
  
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Hey{user?.name ? `, ${user.name}` : ''} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentStreak > 0 ? (
              <>You're on a <span className="text-primary font-medium">{currentStreak}-day streak</span>!</>
            ) : (
              "Ready to start your barefoot journey?"
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Card className="bg-white flex items-center gap-2 p-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Progress</div>
              <div className="text-sm font-medium">{completedWorkouts}/{totalWorkouts} workouts</div>
            </div>
          </Card>
          
          <Card className="bg-white flex items-center gap-2 p-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Badges</div>
              <div className="text-sm font-medium">{unlockedBadges.length} earned</div>
            </div>
          </Card>
        </div>
      </header>
      
      <ProgramTimeline />
      
      {nextWorkout && (
        <Card className="bg-primary-gradient text-white rounded-2xl shadow-workout-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium bg-white/20 rounded-full px-3 py-1">
                Next up
              </div>
              <div className="text-sm">
                {nextWorkout.duration} min
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{nextWorkout.title}</h2>
            <p className="text-white/80 mb-4">{nextWorkout.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
                {nextWorkout.focus}
              </div>
              
              <button
                onClick={() => navigate(`/workout/${nextWorkout.id}`)}
                className="flex items-center bg-white text-primary font-semibold rounded-full px-5 py-2 hover:bg-opacity-90 transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
        <Card className={`${isMobile ? 'col-span-1' : 'col-span-2'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Weekly Progress</h3>
              <button 
                onClick={() => navigate('/progress')}
                className="text-sm text-primary font-medium"
              >
                View all
              </button>
            </div>
            <ProgressBar 
              percent={progressPercentage} 
              label={`${progressPercentage}% Complete`}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Streak</h3>
              <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs">
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="mt-3">
              <StreakTracker />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {recentBadges.length > 0 && (
        <BadgeCarousel badges={recentBadges} title="Recent Badges" />
      )}
    </div>
  );
};

export default AthleteDashboard;
