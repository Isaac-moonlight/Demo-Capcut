import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Basculer entre thème sombre et thème clair"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
        theme === 'dark'
          ? 'bg-[#161b26] border-stone-800 text-amber-400 hover:border-amber-500/50 hover:bg-[#1e2433]'
          : 'bg-[#f5ede1] border-stone-300 text-amber-600 hover:border-amber-600/50 hover:bg-[#ebdcc8]'
      } ${className}`}
      title={theme === 'dark' ? 'Passer en mode Lin / Champagne (Clair)' : 'Passer en mode Obsidienne (Sombre)'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
