
import React from 'react';
import { Calendar } from 'lucide-react';

interface DayTrackerProps {
  completedDays: number;
}

const TOTAL_DAYS = 42; // 6 weeks

const DayTracker = ({ completedDays }: DayTrackerProps) => {
  const percentage = Math.round((completedDays / TOTAL_DAYS) * 100);
  return (
    <div className="card bg-primary-gradient text-white">
      <div className="flex items-center mb-2">
        <Calendar className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Day Tracker</h3>
      </div>
      <div className="mb-2 flex flex-col items-center">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[...Array(TOTAL_DAYS)].map((_, i) => (
            <div
              key={i}
              className={
                `w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ` +
                (i < completedDays ? 'bg-white text-primary' : 'border border-white text-white opacity-60')
              }
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="text-sm text-white text-center">
          <span className="font-bold">{completedDays}</span> of <span className="font-bold">{TOTAL_DAYS}</span> days completed
        </div>
      </div>
      <div className="mt-2 text-sm opacity-90 text-center">
        {completedDays === TOTAL_DAYS
          ? "Congratulations! You've completed the 6-week program!"
          : `Keep going! ${TOTAL_DAYS - completedDays} days left.`}
      </div>
    </div>
  );
};

export default DayTracker;
