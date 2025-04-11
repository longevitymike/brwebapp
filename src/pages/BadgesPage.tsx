
import React from "react";
import { BadgeCard } from "@/components/badges/BadgeCard";
import {
  Footprints,
  StretchHorizontal,
  Flame,
  Trophy,
} from "lucide-react";

const badges = [
  {
    name: "First Step",
    description: "Complete your first workout",
    icon: <Footprints />,
    unlocked: true,
    dateEarned: "2025-04-11",
    tier: "bronze",
  },
  {
    name: "Flex Master",
    description: "Complete all flexibility workouts",
    icon: <StretchHorizontal />,
    unlocked: true,
    dateEarned: "2025-04-11",
    tier: "silver",
  },
  {
    name: "Streak King",
    description: "Reach a 14-day streak",
    icon: <Flame />,
    unlocked: false,
    tier: "gold",
  },
  {
    name: "Completionist",
    description: "Complete all 30 days of the program",
    icon: <Trophy />,
    unlocked: false,
    tier: "gold",
  },
];

const BadgesPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🏆 Your Badges</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <BadgeCard key={badge.name} {...badge} />
        ))}
      </div>
    </div>
  );
};

export default BadgesPage;
