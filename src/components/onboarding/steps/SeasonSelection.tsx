import React from 'react';
import { Button } from '@/components/ui/button';
import WolfMascot from '@/components/mascot/WolfMascot';
import { motion } from 'framer-motion';

interface SeasonSelectionProps {
  onNext: (value: string) => void;
}

export default function SeasonSelection({ onNext }: SeasonSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <WolfMascot pose="question" />
      
      <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-2">
        Are you currently in season?
      </h2>
      
      <p className="text-slate-600 mb-8">
        This helps us tailor your training intensity.
      </p>
      
      <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
        <Button 
          onClick={() => onNext('in_season')}
          className="py-6 text-lg bg-blue-500 hover:bg-blue-600"
        >
          Yes, I'm in season
        </Button>
        
        <Button 
          onClick={() => onNext('off_season')}
          className="py-6 text-lg bg-indigo-500 hover:bg-indigo-600"
        >
          No, I'm off season
        </Button>
      </div>
    </motion.div>
  );
}
