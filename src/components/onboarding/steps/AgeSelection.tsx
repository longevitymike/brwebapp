import { useState } from 'react';
import { motion } from 'framer-motion'; // Assuming motion buttons are desired here too

const ageOptions = ['5–7', '8–11', '12–14', '15–16', 'Parent'];

interface AgeSelectionProps {
  onNext: (value: string) => void;
}

export default function AgeSelection({ onNext }: AgeSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Which age group are you in?</h2>
      <div className="space-y-2 mb-4">
        {ageOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`w-full py-3 px-4 rounded-lg border transition-colors duration-200 ${
              selected === opt
                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {/* Using motion button style from previous feedback */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full mt-6 bg-gradient-to-r from-[#007FFF] to-[#00C6FF] text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 outline-none ${
          !selected ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
      >
        <span className="z-10 relative">Next →</span>
        {selected && <div className="absolute inset-0 bg-white/10 blur-xl rounded-full animate-pulse"></div>}
      </motion.button>
    </div>
  );
}