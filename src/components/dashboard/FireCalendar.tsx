import clsx from 'clsx';
import { Flame } from 'lucide-react';
import React from 'react'; // Import React for JSX

type Props = {
  streakDays: number[]; // Array of day numbers that are part of the streak
  totalDays?: number; // Total days in the calendar view (e.g., 30)
  milestoneDays?: number[]; // Days that are considered milestones
};

export default function FireCalendar({
  streakDays,
  totalDays = 30,
  milestoneDays = [7, 14, 21, 30], // Default milestones
}: Props) {
  // Create an array representing the days to display
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-2 text-xs">
      {days.map((day) => {
        const isStreak = streakDays.includes(day);
        const isMilestone = milestoneDays.includes(day);

        return (
          <div
            key={day}
            className={clsx(
              'aspect-square rounded-lg flex items-center justify-center font-semibold transition-all relative',
              isStreak
                ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg scale-105' // Style for streak days
                : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400' // Style for non-streak days
            )}
            title={isStreak ? `Day ${day} (Streak!)` : `Day ${day}`} // Add tooltip for clarity
          >
            {/* Add milestone indicator */}
            {isMilestone && isStreak ? ( // Show flame only if it's a milestone AND part of the streak
              <div className="absolute -top-1 -right-1" title="Milestone Day!">
                <Flame className="h-4 w-4 text-yellow-400 fill-yellow-300" />
              </div>
            ) : null}
            {day}
          </div>
        );
      })}
    </div>
  );
}