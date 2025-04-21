import React from 'react'; // Import React for JSX
import {
  Footprints,
  StretchHorizontal,
  Flame,
  Trophy,
  Timer,
  Zap,
  Dumbbell,
  Medal,
  Swords,
  Star,
  Lock,
} from "lucide-react";

import { JSX } from "react";

// Define the Badge type
export type BadgeTier = "bronze" | "silver" | "gold";
export type Badge = {
  name: string;
  description: string;
  icon: JSX.Element; // Use JSX.Element for type safety
  tier: BadgeTier;
  category: string;
};

// Define the list of badges with the correct type
export const allBadges: Badge[] = [
  {
    name: "First Step",
    description: "Complete your first workout",
    icon: <Footprints />,
    tier: "bronze",
    category: "Milestone",
  },
  {
    name: "Flex Master",
    description: "Complete all flexibility workouts",
    icon: <StretchHorizontal />,
    tier: "silver",
    category: "Mobility",
  },
  {
    name: "Streak King",
    description: "Reach a 14-day streak",
    icon: <Flame />,
    tier: "gold",
    category: "Streak",
  },
  {
    name: "Completionist",
    description: "Complete all 30 days of the program",
    icon: <Trophy />,
    tier: "gold",
    category: "Milestone",
  },
  {
    name: "7-Day Beast",
    description: "Complete 7 days in a row",
    icon: <Timer />,
    tier: "silver",
    category: "Streak",
  },
  {
    name: "Hop Hero",
    description: "Complete all 'Hop' workouts",
    icon: <Zap />,
    tier: "silver",
    category: "Coordination",
  },
  {
    name: "Foot Commander",
    description: "Earn all 'Foot Strength' workouts",
    icon: <Dumbbell />,
    tier: "gold",
    category: "Strength",
  },
  {
    name: "Balance Master",
    description: "Master all balance challenges",
    icon: <Medal />,
    tier: "silver",
    category: "Balance",
  },
  {
    name: "Movement Warrior",
    description: "Complete all Phase 1",
    icon: <Swords />,
    tier: "bronze",
    category: "Phases",
  },
  {
    name: "Mastery Unlocked",
    description: "Complete final workout",
    icon: <Zap />,
    tier: "gold",
    category: "Milestone",
  },
  {
    name: "Week Champion",
    description: "Complete all workouts in a week",
    icon: <Star />,
    tier: "silver",
    category: "Weekly",
  },
  {
    name: "Consistency Champ",
    description: "Workout 3x per week for 4 weeks",
    icon: <Lock />,
    tier: "gold",
    category: "Consistency",
  },
];