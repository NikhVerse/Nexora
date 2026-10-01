import React from 'react';
import { Moon, Sun, ArrowLeft, PanelLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  currentPage: 'home' | 'research' | 'history' | 'settings';
  onNavigate: (page: 'home' | 'research' | 'history' | 'settings') => void;
  researchTitle?: string;
  onBackToHome?: () => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  researchTitle,
  onBackToHome,
  isCollapsed,
  onToggleSidebar,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left Logo / Back / Toggle */}
        <div className="flex items-center gap-2.5">
          {isCollapsed && onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title="Expand sidebar (Ctrl+B)"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mr-1"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          {currentPage === 'research' && onBackToHome ? (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-xs tracking-tighter shadow-2xs">
              N
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              Nexora
            </span>
          </button>

          {researchTitle && currentPage === 'research' && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-sm font-medium">
                {researchTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center / Right Minimal Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              currentPage === 'home'
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            Research
          </button>

          <button
            type="button"
            onClick={() => onNavigate('history')}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              currentPage === 'history'
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            History
          </button>

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              currentPage === 'settings'
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            Settings
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors ml-1"
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
