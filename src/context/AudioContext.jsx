'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundFx } from '@/lib/soundFx';
import { ambientSoundscape, AMBIENT_PRESETS } from '@/lib/ambientSoundscape';

const AudioContext = createContext({
  // Tactile SFX
  isMuted: true,
  toggleMute: () => {},
  setMuted: () => {},
  playHover: () => {},
  playClick: () => {},
  playSwitch: () => {},
  playModalOpen: () => {},
  playModalClose: () => {},
  playTerminalKey: () => {},
  playTerminalEnter: () => {},
  playFlip: () => {},
  playSuccess: () => {},
  playWarning: () => {},
  playPacketHop: () => {},
  playCrystalChime: () => {},

  // Ambient Soundscape
  isAmbientPlaying: false,
  ambientPreset: 'deep_space',
  ambientVolume: 0.55,
  ambientPresets: AMBIENT_PRESETS,
  toggleAmbient: () => {},
  playAmbient: () => {},
  pauseAmbient: () => {},
  setAmbientPreset: () => {},
  setAmbientVolume: () => {},
  analyser: null,

  // Audio Hub UI Modal/Drawer
  isAudioHubOpen: false,
  openAudioHub: () => {},
  closeAudioHub: () => {},
  toggleAudioHub: () => {},
});

export function AudioProvider({ children }) {
  // SFX state
  const [isMuted, setIsMutedState] = useState(soundFx.isMuted());

  // Ambient Soundscape state
  const [ambientState, setAmbientState] = useState(() => ambientSoundscape.getState());
  const [isAudioHubOpen, setIsAudioHubOpen] = useState(false);

  useEffect(() => {
    // 1. Sync SFX state
    setIsMutedState(soundFx.isMuted());
    const unsubSfx = soundFx.subscribe((muted) => {
      setIsMutedState(muted);
    });

    // 2. Sync Ambient Soundscape state
    const unsubAmbient = ambientSoundscape.subscribe((state) => {
      setAmbientState(state);
    });

    // 3. Scroll Modulation for Ambient Filters
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      ambientSoundscape.setScrollDepth(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 4. Keyboard Shortcuts: 'm' / 'M' for SFX, 'a' / 'A' with Alt/Option or global Hub toggle
    const handleKeyDown = (e) => {
      if (
        ['INPUT', 'TEXTAREA'].includes(e.target?.tagName) ||
        e.target?.isContentEditable
      ) {
        return;
      }

      if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        soundFx.toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubSfx();
      unsubAmbient();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // SFX Actions
  const toggleMute = useCallback(() => soundFx.toggleMute(), []);
  const setMuted = useCallback((val) => soundFx.setMuted(val), []);
  const playHover = useCallback(() => soundFx.playHover(), []);
  const playClick = useCallback(() => soundFx.playClick(), []);
  const playSwitch = useCallback((isOn) => soundFx.playSwitch(isOn), []);
  const playModalOpen = useCallback(() => soundFx.playModalOpen(), []);
  const playModalClose = useCallback(() => soundFx.playModalClose(), []);
  const playTerminalKey = useCallback(() => soundFx.playTerminalKey(), []);
  const playTerminalEnter = useCallback(() => soundFx.playTerminalEnter(), []);
  const playFlip = useCallback(() => soundFx.playFlip(), []);
  const playSuccess = useCallback(() => soundFx.playSuccess(), []);
  const playWarning = useCallback(() => soundFx.playWarning(), []);
  const playPacketHop = useCallback((step) => soundFx.playPacketHop(step), []);
  const playCrystalChime = useCallback((p) => soundFx.playCrystalChime(p), []);

  // Ambient Soundscape Actions
  const toggleAmbient = useCallback(() => ambientSoundscape.toggle(), []);
  const playAmbient = useCallback(() => ambientSoundscape.play(), []);
  const pauseAmbient = useCallback(() => ambientSoundscape.pause(), []);
  const setAmbientPreset = useCallback((id) => ambientSoundscape.setPreset(id), []);
  const setAmbientVolume = useCallback((v) => ambientSoundscape.setVolume(v), []);

  // Audio Hub UI Actions
  const openAudioHub = useCallback(() => setIsAudioHubOpen(true), []);
  const closeAudioHub = useCallback(() => setIsAudioHubOpen(false), []);
  const toggleAudioHub = useCallback(() => setIsAudioHubOpen((prev) => !prev), []);

  return (
    <AudioContext.Provider
      value={{
        // SFX
        isMuted,
        toggleMute,
        setMuted,
        playHover,
        playClick,
        playSwitch,
        playModalOpen,
        playModalClose,
        playTerminalKey,
        playTerminalEnter,
        playFlip,
        playSuccess,
        playWarning,
        playPacketHop,
        playCrystalChime,

        // Ambient Soundscape
        isAmbientPlaying: ambientState.isPlaying,
        ambientPreset: ambientState.currentPreset,
        ambientVolume: ambientState.volume,
        ambientPresets: AMBIENT_PRESETS,
        toggleAmbient,
        playAmbient,
        pauseAmbient,
        setAmbientPreset,
        setAmbientVolume,
        analyser: ambientState.analyser,

        // Hub UI
        isAudioHubOpen,
        openAudioHub,
        closeAudioHub,
        toggleAudioHub,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
