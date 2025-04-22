
interface ProgressBarProps {
  current: number;
  total: number;
}

import { motion } from "framer-motion";

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold">Program Progress</h3>
      </div>
      <div className="mt-2 text-2xl font-bold text-primary">
        {current} / {total} workouts completed
      </div>
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden mt-2">
        <motion.div
          className="h-full bg-gradient-to-r from-[#007FFF] to-[#00D9FF]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
