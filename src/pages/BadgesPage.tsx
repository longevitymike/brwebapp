
import { useState } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Badge } from '@/contexts/WorkoutContext';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BadgesPage = () => {
  const { getUnlockedBadges, getLockedBadges } = useWorkout();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const unlockedBadges = getUnlockedBadges();
  const lockedBadges = getLockedBadges();
  
  // Filter badges by tier
  const filterBadges = (badges: Badge[]) => {
    if (activeFilter === 'all') return badges;
    return badges.filter(badge => badge.tier === activeFilter);
  };
  
  const filteredUnlockedBadges = filterBadges(unlockedBadges);
  const filteredLockedBadges = filterBadges(lockedBadges);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Your Badges</h1>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'bronze', 'silver', 'gold'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter 
                ? 'bg-primary-gradient text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      
      {filteredUnlockedBadges.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Unlocked Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredUnlockedBadges.map(badge => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BadgeCard 
                  badge={badge} 
                  unlocked={true} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        activeFilter !== 'all' ? (
          <div className="card text-center py-10">
            <p className="text-lg mb-2">No {activeFilter} badges unlocked yet</p>
            <p className="text-muted-foreground">Keep training to earn more badges!</p>
          </div>
        ) : (
          <div className="card text-center py-10">
            <p className="text-lg mb-2">No badges unlocked yet</p>
            <p className="text-muted-foreground">Complete workouts to earn badges!</p>
          </div>
        )
      )}
      
      {filteredLockedBadges.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Badges to Earn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredLockedBadges.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                unlocked={false} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
}

const getBadgeTierColor = (tier: string | undefined) => {
  switch(tier) {
    case 'bronze':
      return 'from-amber-600 to-amber-700';
    case 'silver':
      return 'from-slate-300 to-slate-400';
    case 'gold':
      return 'from-yellow-400 to-yellow-600';
    default:
      return 'from-blue-500 to-blue-600';
  }
};

const BadgeCard = ({ badge, unlocked }: BadgeCardProps) => {
  const tierGradient = getBadgeTierColor(badge.tier);
  
  return (
    <div 
      className={`card flex flex-col items-center justify-center py-6 transition-all ${
        !unlocked 
          ? 'badge-locked hover:opacity-70' 
          : 'hover:shadow-lg hover:scale-[1.03]'
      }`}
    >
      <div className="relative">
        <div className={`
          w-16 h-16 rounded-full 
          flex items-center justify-center 
          mb-4
          bg-gradient-to-br ${tierGradient}
          ${unlocked ? 'animate-badge-unlock shadow-lg' : 'opacity-25'}
        `}>
          <div className="text-4xl">{unlocked ? badge.emoji : '?'}</div>
        </div>
        
        {badge.tier && (
          <div className={`
            absolute -bottom-1 -right-1 
            w-6 h-6 rounded-full 
            flex items-center justify-center 
            text-xs font-bold text-white
            bg-gradient-to-br ${tierGradient}
            border-2 border-white
          `}>
            {badge.tier === 'bronze' ? 'B' : badge.tier === 'silver' ? 'S' : 'G'}
          </div>
        )}
      </div>
      
      <h3 className="font-semibold mb-1">{badge.title}</h3>
      <p className="text-xs text-center text-muted-foreground">{badge.description}</p>
      
      {unlocked && badge.unlockedAt && (
        <div className="mt-3 text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full">
          {new Date(badge.unlockedAt).toLocaleDateString()}
        </div>
      )}
      
      {!unlocked && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="mt-3 text-xs text-primary flex items-center">
                <Info className="w-3 h-3 mr-1" /> How to unlock
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {badge.condition.type === 'streak' && `Maintain a streak of ${badge.condition.value} days`}
                {badge.condition.type === 'count' && `Complete ${badge.condition.value} workouts`}
                {badge.condition.type === 'specific' && `Complete the required workouts`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default BadgesPage;
