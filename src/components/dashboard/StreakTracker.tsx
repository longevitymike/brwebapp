
import { Calendar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakTrackerProps {
  streak: number;
}

const StreakTracker = ({ streak }: StreakTrackerProps) => {
  return (
    <div className="card bg-primary-gradient text-white">
      <div className="flex items-center mb-2">
        <Calendar className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Your Streak</h3>
      </div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center my-2 cursor-help">
            <div className="text-4xl font-bold">{streak}</div>
            <div className="ml-2 text-sm font-medium leading-tight">
              consecutive<br />days
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your current workout streak. Keep going!</p>
        </TooltipContent>
      </Tooltip>
      
      <div className="mt-2 text-sm opacity-90">
        {streak > 0
          ? "Keep it going! Consistency builds strength."
          : "Start your streak today!"}
      </div>
    </div>
  );
};

export default StreakTracker;
