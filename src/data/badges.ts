
import React from "react";
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
  Bolt,
  Star,
  Lock,
} from "lucide-react";

export type BadgeTier = "bronze" | "silver" | "gold";
export type BadgeCategory = "Milestone" | "Mobility" | "Streak" | "Coordination" | "Strength" | "Balance" | "Phases" | "Weekly" | "Consistency";

export interface Badge {
  name: string;
  description: string;
  icon: JSX.Element;
  tier: BadgeTier;
  category: BadgeCategory;
  unlocked?: boolean;
  dateEarned?: string;
}

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
    icon: <Bolt />,
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
