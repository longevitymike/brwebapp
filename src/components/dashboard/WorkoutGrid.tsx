import WorkoutCard from './WorkoutCard'; // Corrected import path
import React from 'react';
import { Workout } from '@/contexts/WorkoutContext'; // Import Workout type

// Mock data using the Workout type - replace with actual data source
// Note: 'locked' and step progress aren't part of the Workout type,
// this might need adjustment based on how locking/progress is handled.
const workouts: Workout[] = [
  {
    id: 'w1', // Use IDs consistent with WorkoutContext mock data if possible
    title: 'Week 1, Day 1 – Foundation & Balance',
    description: 'Begin your barefoot journey.',
    duration: 8, // Duration as number
    videoUrl: 'https://example.com/video1', // Placeholder
    week: 1,
    day: 1,
    focus: 'Foundation',
    steps: [{title: 'Step 1', description: '...'}], // Add mock steps if needed by WorkoutCard
    // locked: false, // 'locked' is not in Workout type
  },
  {
    id: 'w2',
    title: 'Week 1, Day 2 – Strength & Mobility',
    description: 'Build strength.',
    duration: 10,
    videoUrl: 'https://example.com/video2',
    week: 1,
    day: 2,
    focus: 'Strength',
    steps: [],
    // locked: false,
  },
  {
    id: 'w3',
    title: 'Week 1, Day 3 – Speed & Agility',
    description: 'Enhance speed.',
    duration: 12,
    videoUrl: 'https://example.com/video3',
    week: 1,
    day: 3,
    focus: 'Speed',
    steps: [],
    // locked: true, // 'locked' is not in Workout type
  },
   {
    id: 'w4',
    title: 'Week 1, Day 4 – Endurance & Balance',
    description: 'Build endurance.',
    duration: 15,
    videoUrl: 'https://example.com/video4',
    week: 1,
    day: 4,
    focus: 'Endurance',
    steps: [],
    // locked: true,
  },
];

export default function WorkoutGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {workouts.map((workout) => (
        // Pass the whole workout object as the 'workout' prop
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}