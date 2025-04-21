
import React from 'react';

export default function Notifications() {
  return (
    <div className="space-y-2"> {/* Removed comment, added spacing */}
      {/* Use flex for better alignment */}
      <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200">
        <span className="text-lg">✅</span>
        <span>You unlocked a badge!</span>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50 border border-blue-200">
        <span className="text-lg">📅</span>
        <span>Don't forget today's workout</span>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-md bg-purple-50 border border-purple-200">
        <span className="text-lg">📈</span>
        <span>Weekly Progress Report is available</span>
      </div>
    </div>
  );
}
