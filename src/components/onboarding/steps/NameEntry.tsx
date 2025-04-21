import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui input

interface NameEntryProps {
  onNext: (value: string) => void;
}

export default function NameEntry({ onNext }: NameEntryProps) {
  const [name, setName] = useState('');

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <Label htmlFor="nameInput" className="block text-xl font-bold mb-4 text-gray-800">Hey there! Let’s get started. What’s the first name of the young athlete who’ll be using the app?</Label>
      <Input
        id="nameInput"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full bg-gradient-to-r from-[#007FFF] to-[#00C6FF] text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-300 outline-none ${
          !name ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => name && onNext(name)}
        disabled={!name}
      >
        <span className="z-10 relative">Next →</span>
        {name && <div className="absolute inset-0 bg-white/10 blur-xl rounded-full animate-pulse"></div>}
      </motion.button>
    </div>
  );
}