'use client';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      data-theme-toggle
      onClick={(e) => toggleTheme(e.currentTarget)}
      aria-pressed={isLight}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to Dusk (dark theme)' : 'Switch to Dawn (light theme)'}
      className={cn(
        'min-w-10 min-h-10 w-10 h-10 rounded-full bg-surface hover:bg-raised border border-line hover:border-border-strong text-ink hover:text-violet inline-flex items-center justify-center transition-colors duration-200',
        className
      )}
    >
      <svg
        className="w-[18px] h-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 4v3" />
        <path d="M5.6 7.6l2.1 2.1" />
        <path d="M18.4 7.6l-2.1 2.1" />
        <path d="M7 17a5 5 0 0 1 10 0" />
        <line x1="3" y1="17" x2="21" y2="17" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    </button>
  );
}
