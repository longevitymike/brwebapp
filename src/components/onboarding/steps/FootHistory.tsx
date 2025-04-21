import { useState } from 'react';
import { motion } from 'framer-motion';

const historyOptions = ["No previous issues", "Plantar Fasciitis", "Achilles Tendonitis", "Ankle Sprains", "Bunions", "Other"];

interface FootHistoryProps {
  onNext: (value: string) => void; // Assuming single selection for simplicity
}

export default function FootHistory({ onNext }: FootHistoryProps) {
  const [selected, setSelected] = useState<string | null>(null);


  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Any previous foot or ankle issues?</h2>
      <p className="text-sm text-gray-500 mb-4">(Select the most relevant, if any)</p>
      <div className="space-y-2 mb-4">
        {historyOptions.map((opt) => (
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
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full mt-6 bg-gradient-to-r from-[#007FFF] to-[#00C6FF] text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 outline-none ${
          !selected ? "opacity-50 cursor-not-allowed" : "" // Enable even if 'No previous issues' is selected
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