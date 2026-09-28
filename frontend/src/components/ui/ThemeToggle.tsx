import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-stone-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-darkbg-input transition-colors shadow-xs"
      aria-label="Toggle light / dark theme"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-stone-600" />
      )}
    </button>
  );
};
