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
  isResumeModalOpen: false,
  openResumeModal: () => {},
  closeResumeModal: () => {},
  toggleResumeModal: () => {},
});

export function OverlayProvider({ children }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const openCommandPalette = () => setIsCommandPaletteOpen(true);
  const closeCommandPalette = () => setIsCommandPaletteOpen(false);
  const toggleCommandPalette = () => setIsCommandPaletteOpen((prev) => !prev);

  const openTerminal = () => setIsTerminalOpen(true);
  const closeTerminal = () => setIsTerminalOpen(false);
  const toggleTerminal = () => setIsTerminalOpen((prev) => !prev);

  const openResumeModal = () => setIsResumeModalOpen(true);
  const closeResumeModal = () => setIsResumeModalOpen(false);
  const toggleResumeModal = () => setIsResumeModalOpen((prev) => !prev);

  useEffect(() => {
    const handleOpenResumeEvent = () => setIsResumeModalOpen(true);
    window.addEventListener('open-resume-modal', handleOpenResumeEvent);

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

      // Escape closes all overlays
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (isTerminalOpen) setIsTerminalOpen(false);
        if (isResumeModalOpen) setIsResumeModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-resume-modal', handleOpenResumeEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCommandPaletteOpen, isTerminalOpen, isResumeModalOpen]);

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
        isResumeModalOpen,
        openResumeModal,
        closeResumeModal,
        toggleResumeModal,
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
