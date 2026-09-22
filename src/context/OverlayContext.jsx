'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OverlayContext = createContext({
  isCommandPaletteOpen: false,
  openCommandPalette: () => {},
  closeCommandPalette: () => {},
  toggleCommandPalette: () => {},
  isTerminalOpen: false,
  openTerminal: () => {},
  closeTerminal: () => {},
  toggleTerminal: () => {},
});

export function OverlayProvider({ children }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  const toggleCommandPalette = () => setIsCommandPaletteOpen((prev) => !prev);

  const openTerminal = () => setIsTerminalOpen(true);
  const closeTerminal = () => setIsTerminalOpen(false);
  const toggleTerminal = () => setIsTerminalOpen((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Mini terminal: Ctrl+Shift+T or backtick (`) when not typing in input/textarea
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') ||
        (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName))
      ) {
        e.preventDefault();
        toggleTerminal();
        return;
      }

      // Escape closes both
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (isTerminalOpen) setIsTerminalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, isTerminalOpen]);

  return (
    <OverlayContext.Provider
      value={{
        isCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        toggleCommandPalette,
        isTerminalOpen,
        openTerminal,
        closeTerminal,
        toggleTerminal,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
