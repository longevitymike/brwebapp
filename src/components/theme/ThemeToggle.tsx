
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
