
import React, { useState, useEffect } from "react";
import { BadgeCard } from "@/components/badges/BadgeCard";
import MascotCelebration from "@/components/effects/MascotCelebration";
import RewardCelebration from "@/components/effects/RewardCelebration";
import { Badge, BadgeCategory, allBadges } from "@/data/badges";
import { useWorkout } from "@/contexts/WorkoutContext";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";

const BadgesPage: React.FC = () => {
  const { getUnlockedBadges } = useWorkout();
  const [justUnlocked, setJustUnlocked] = useState<string | null>("Flex Master");
  const [showCelebration, setShowCelebration] = useState(true);
  const [categories, setCategories] = useState<BadgeCategory[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  
  useEffect(() => {
    // Get unique categories
    const uniqueCategories = Array.from(
      new Set(allBadges.map((badge) => badge.category))
    );
    setCategories(uniqueCategories as BadgeCategory[]);
    
    // Map the badges with unlocked status from the workout context
    const unlockedBadges = getUnlockedBadges();
    const unlockedNames = unlockedBadges.map(badge => badge.title);
    
    const mappedBadges = allBadges.map(badge => ({
      ...badge,
      unlocked: unlockedNames.includes(badge.name),
      dateEarned: unlockedNames.includes(badge.name) ? 
        new Date().toISOString().split('T')[0] : undefined
    }));
    
    setUserBadges(mappedBadges);
    
    // Auto-hide celebration after 5 seconds
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [getUnlockedBadges, showCelebration]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🏆 Your Badges</h1>
      
      {categories.map((category) => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{category}</CardTitle>
              <UIBadge variant="secondary">
                {userBadges.filter(b => b.category === category && b.unlocked).length} / 
                {userBadges.filter(b => b.category === category).length}
              </UIBadge>
            </div>
            <CardDescription>
              {getCategoryDescription(category)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {userBadges
                .filter((badge) => badge.category === category)
                .map((badge) => {
                  const isJustUnlocked = badge.name === justUnlocked;
                  return (
                    <div 
                      key={badge.name} 
                      className={isJustUnlocked ? "animate-badge-unlock" : ""}
                    >
                      <BadgeCard {...badge} />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <RewardCelebration show={showCelebration} />
    </div>
  );
};

const getCategoryDescription = (category: BadgeCategory): string => {
  switch(category) {
    case "Milestone":
      return "Achievements for reaching important progress points";
    case "Mobility":
      return "Awarded for completing flexibility and mobility workouts";
    case "Streak":
      return "Recognizes consistent daily workout habits";
    case "Coordination":
      return "Mastery of coordination and agility exercises";
    case "Strength":
      return "Achievements in building foot and leg strength";
    case "Balance":
      return "Recognition for mastering balance challenges";
    case "Phases":
      return "Completion of training program phases";
    case "Weekly":
      return "Weekly workout completion achievements";
    case "Consistency":
      return "Long-term consistency in your training";
    default:
      return "";
  }
};

export default BadgesPage;
