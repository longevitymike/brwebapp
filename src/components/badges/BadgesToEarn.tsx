
import React from 'react';

export default function BadgesToEarn() {
  const badges = [
    { name: "Flex Master", requirement: "Complete all flexibility workouts" },
    { name: "Balance Master", requirement: "Finish 3 balance-focused workouts" },
    { name: "Week Champion", requirement: "Complete all workouts in a week" },
    { name: "Barefoot Warrior", requirement: "7-day streak" }
  ];
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🎖 Badges to Earn</h2>
      <ul className="space-y-2">
        {badges.map((badge, idx) => (
          <li key={idx} className="bg-white/10 p-3 rounded shadow">
            <strong>{badge.name}</strong><br />
            <span className="text-sm">{badge.requirement}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
