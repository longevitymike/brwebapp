
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && window.localStorage;
  
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage, default to 'light' if not found or not in browser
    if (!isBrowser) return 'light';
    
    try {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as Theme) || 'light'; // Default to 'light', ignore OS preference
    } catch (error) {
      console.error("Error reading theme from localStorage:", error);
      return 'light';
    }
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isBrowser) return;
    
    try {
      // Update localStorage when theme changes
      localStorage.setItem('theme', theme);
      
      // Update the document class for Tailwind dark mode
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  }, [theme, isDark, isBrowser]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
