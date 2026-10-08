'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAudio } from '@/context/AudioContext';

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
  const { playModalOpen, playModalClose } = useAudio();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const openCommandPalette = useCallback(() => {
    playModalOpen();
    setIsCommandPaletteOpen(true);
  }, [playModalOpen]);

  const closeCommandPalette = useCallback(() => {
    playModalClose();
    setIsCommandPaletteOpen(false);
  }, [playModalClose]);

  const toggleCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen((prev) => {
      if (!prev) playModalOpen();
      else playModalClose();
      return !prev;
    });
  }, [playModalOpen, playModalClose]);

  const openTerminal = useCallback(() => {
    playModalOpen();
    setIsTerminalOpen(true);
  }, [playModalOpen]);

  const closeTerminal = useCallback(() => {
    playModalClose();
    setIsTerminalOpen(false);
  }, [playModalClose]);

  const toggleTerminal = useCallback(() => {
    setIsTerminalOpen((prev) => {
      if (!prev) playModalOpen();
      else playModalClose();
      return !prev;
    });
  }, [playModalOpen, playModalClose]);

  const openResumeModal = useCallback(() => {
    playModalOpen();
    setIsResumeModalOpen(true);
  }, [playModalOpen]);

  const closeResumeModal = useCallback(() => {
    playModalClose();
    setIsResumeModalOpen(false);
  }, [playModalClose]);

  const toggleResumeModal = useCallback(() => {
    setIsResumeModalOpen((prev) => {
      if (!prev) playModalOpen();
      else playModalClose();
      return !prev;
    });
  }, [playModalOpen, playModalClose]);

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
        let closedAny = false;
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          closedAny = true;
        }
        if (isTerminalOpen) {
          setIsTerminalOpen(false);
          closedAny = true;
        }
        if (isResumeModalOpen) {
          setIsResumeModalOpen(false);
          closedAny = true;
        }
        if (closedAny) {
          playModalClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-resume-modal', handleOpenResumeEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isCommandPaletteOpen,
    isTerminalOpen,
    isResumeModalOpen,
    toggleCommandPalette,
    toggleTerminal,
    playModalClose,
  ]);

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
