'use client';

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

const THEME_STORAGE_KEY = 'hz-theme';
const THEME_EVENT = 'hz-theme-change';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function getThemeSnapshot() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function getServerThemeSnapshot() {
  return 'dark';
}

function subscribeTheme(onStoreChange) {
  if (typeof window === 'undefined') return () => {};

  const handleThemeEvent = () => onStoreChange();
  window.addEventListener(THEME_EVENT, handleThemeEvent);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        onStoreChange();
        break;
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const handleMediaChange = (e) => {
    if (readStoredTheme()) return;
    document.documentElement.dataset.theme = e.matches ? 'light' : 'dark';
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  mediaQuery.addEventListener('change', handleMediaChange);

  return () => {
    window.removeEventListener(THEME_EVENT, handleThemeEvent);
    observer.disconnect();
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}

function resolveOrigin(triggerEl) {
  let target = triggerEl;
  if (!target && typeof document !== 'undefined') {
    const candidates = document.querySelectorAll('[data-theme-toggle]');
    for (const el of candidates) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        target = el;
        break;
      }
    }
  }

  if (target && typeof target.getBoundingClientRect === 'function') {
    const rect = target.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  }

  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const toggleTheme = useCallback((triggerEl = null) => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const currentTheme = getThemeSnapshot();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors in restricted environments
    }

    const applyNextTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      window.dispatchEvent(new Event(THEME_EVENT));
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition !== 'function' || prefersReducedMotion) {
      applyNextTheme();
      return;
    }

    const { x, y } = resolveOrigin(triggerEl);
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        applyNextTheme();
      });
    });

    transition.ready
      .then(() => {
        const easeOut =
          getComputedStyle(document.documentElement)
            .getPropertyValue('--ease-out')
            .trim() || 'cubic-bezier(0.22, 1, 0.36, 1)';

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: easeOut,
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
