
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/contexts/WorkoutContext';

interface BadgeCarouselProps {
  badges: Badge[];
  title: string;
}

const BadgeCarousel = ({ badges, title }: BadgeCarouselProps) => {
  const navigate = useNavigate();
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Animate the first badge that was just unlocked
    const recentlyUnlocked = badges.findIndex(badge => 
      badge.unlocked && 
      new Date(badge.unlockedAt!).getTime() > Date.now() - 60000
    );
    
    if (recentlyUnlocked !== -1) {
      setAnimatedIndex(recentlyUnlocked);
    }
  }, [badges]);
  
  if (badges.length === 0) {
    return null;
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button 
          onClick={() => navigate('/badges')}
          className="flex items-center text-sm text-primary font-medium"
        >
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {badges.map((badge, index) => (
          <div 
            key={badge.id}
            className={`badge-card flex-shrink-0 w-20 h-24 ${index === animatedIndex ? 'animate-badge-unlock' : ''}`}
          >
            <div className="text-3xl mb-2">{badge.emoji}</div>
            <div className="text-xs font-medium">{badge.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeCarousel;
