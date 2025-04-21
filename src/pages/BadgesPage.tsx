import React, { useState, useEffect } from "react";
import { BadgeCard } from "@/components/badges/BadgeCard"; // Assuming BadgeCard expects 'unlocked' prop
import MascotCelebration from "@/components/effects/MascotCelebration";
import RewardCelebration from "@/components/effects/RewardCelebration";
import { Badge, allBadges } from "@/data/badges.tsx"; // Use .tsx extension
import { useWorkout } from "@/contexts/WorkoutContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";

// Define BadgeCategory locally as it's not exported from badges.tsx
type BadgeCategory = string;

// Define a type for the state which includes unlock status
interface UserBadge extends Badge {
  unlocked: boolean;
  dateEarned?: string;
}

// Define props for BadgeCard if not already defined elsewhere
// Assuming BadgeCard needs these props based on usage below
interface BadgeCardProps extends UserBadge {}

const BadgesPage: React.FC = () => {
  const { getUnlockedBadges } = useWorkout();
  // Example state, adjust as needed
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [categories, setCategories] = useState<BadgeCategory[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]); // Use UserBadge type

  useEffect(() => {
    // Get unique categories
    const uniqueCategories = Array.from(
      new Set(allBadges.map((badge) => badge.category))
    );
    setCategories(uniqueCategories as BadgeCategory[]); // Cast is okay if category is always string

    // Map the badges with unlocked status from the workout context
    const unlockedWorkoutBadges = getUnlockedBadges(); // Assuming this returns Badge[] from WorkoutContext
    const unlockedNames = unlockedWorkoutBadges.map(badge => badge.title); // Assuming title is unique identifier? Might need ID.

    // Map to the UserBadge type, ensuring 'unlocked' is included
    const mappedBadges: UserBadge[] = allBadges.map(badge => {
      const isUnlocked = unlockedNames.includes(badge.name); // Match by name
      return {
        ...badge,
        unlocked: isUnlocked,
        // Example date logic, adjust if WorkoutContext provides unlock date
        dateEarned: isUnlocked ? new Date().toISOString().split('T')[0] : undefined
      };
    });

    setUserBadges(mappedBadges);

    // Example: Trigger celebration if a specific badge was just unlocked
    // This logic might need refinement based on how 'justUnlocked' is determined
    if (justUnlocked && mappedBadges.find(b => b.name === justUnlocked)?.unlocked) {
        setShowCelebration(true);
    }


    // Auto-hide celebration after 5 seconds
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
        setJustUnlocked(null); // Reset just unlocked badge
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [getUnlockedBadges, showCelebration, justUnlocked]); // Added justUnlocked dependency

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
                      {/* Ensure BadgeCard accepts UserBadge props */}
                      <BadgeCard {...badge} />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Render celebrations based on showCelebration state */}
      <RewardCelebration show={showCelebration} />
      {/* <MascotCelebration show={showCelebration} /> */} {/* Uncomment if needed */}
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
