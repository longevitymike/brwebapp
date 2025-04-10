
import { useWorkout } from '@/contexts/WorkoutContext';
import { Badge } from '@/contexts/WorkoutContext';

const BadgesPage = () => {
  const { getUnlockedBadges, getLockedBadges } = useWorkout();
  
  const unlockedBadges = getUnlockedBadges();
  const lockedBadges = getLockedBadges();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Your Badges</h1>
      
      {unlockedBadges.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Unlocked Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {unlockedBadges.map(badge => (
              <BadgeCard 
                key={badge.id} 
                badge={badge} 
                unlocked={true} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-10">
          <p className="text-lg mb-2">No badges unlocked yet</p>
          <p className="text-muted-foreground">Complete workouts to earn badges!</p>
        </div>
      )}
      
      {lockedBadges.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Badges to Earn</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lockedBadges.map(badge => (
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

const BadgeCard = ({ badge, unlocked }: BadgeCardProps) => {
  return (
    <div className={`card flex flex-col items-center justify-center py-6 ${!unlocked && 'badge-locked'}`}>
      <div className="text-5xl mb-4">{unlocked ? badge.emoji : '?'}</div>
      <h3 className="font-semibold mb-1">{badge.title}</h3>
      <p className="text-xs text-center text-muted-foreground">{badge.description}</p>
      {unlocked && badge.unlockedAt && (
        <div className="mt-3 text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full">
          {new Date(badge.unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
