'use client';

import { useAudio } from '@/context/AudioContext';
import { cn } from '@/lib/utils';

export default function AudioWaveToggle({ className }) {
  const {
    isMuted,
    toggleMute,
    isAmbientPlaying,
    ambientPreset,
    ambientPresets,
    openAudioHub,
    playHover,
  } = useAudio();

  const handleToggleMute = (e) => {
    e.stopPropagation();
    toggleMute();
  };

  const handleOpenStudio = () => {
    openAudioHub();
  };

  return (
    <div className={cn('relative inline-flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={handleOpenStudio}
        onMouseEnter={playHover}
        aria-label={
          isAmbientPlaying
            ? `Ambient Soundscape: ${ambientPresets[ambientPreset]?.name} is active (Click for Studio)`
            : isMuted
            ? 'Tactile Audio Muted (Click to open Audio Studio, Press M to toggle)'
            : 'Tactile Audio Active (Click to open Audio Studio, Press M to toggle)'
        }
        title={
          isAmbientPlaying
            ? `Ambient: ${ambientPresets[ambientPreset]?.name} · Click for Audio Studio`
            : isMuted
            ? 'Audio: OFF (Click for Studio or press M)'
            : 'Audio: ON (Click for Studio or press M)'
        }
        className={cn(
          'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent font-mono text-[11px] select-none',
          isAmbientPlaying
            ? 'bg-functional-success/15 hover:bg-functional-success/25 border border-functional-success/40 text-functional-success shadow-[0_0_12px_rgba(34,197,94,0.25)]'
            : isMuted
            ? 'bg-bg-secondary hover:bg-bg-tertiary border border-border-default hover:border-border-strong text-text-muted hover:text-text-secondary'
            : 'bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 text-accent shadow-[0_0_12px_rgba(139,92,246,0.25)]'
        )}
      >
        {/* Quick Speaker / Mute icon */}
        <span
          role="button"
          tabIndex={0}
          onClick={handleToggleMute}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleMute(e);
            }
          }}
          aria-label={isMuted ? 'Unmute Audio (Press M)' : 'Mute Audio (Press M)'}
          className="flex items-center justify-center p-0.5 rounded-full hover:scale-110 active:scale-95 transition-transform"
        >
          {isMuted && !isAmbientPlaying ? (
            <svg
              className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <div className="flex items-end gap-[2px] h-3">
              <span
                className={cn(
                  'w-[2px] rounded-full animate-[soundWave_0.8s_ease-in-out_infinite] h-2',
                  isAmbientPlaying ? 'bg-functional-success' : 'bg-accent'
                )}
              />
              <span
                className={cn(
                  'w-[2px] rounded-full animate-[soundWave_0.8s_ease-in-out_0.2s_infinite] h-3',
                  isAmbientPlaying ? 'bg-functional-success' : 'bg-accent'
                )}
              />
              <span
                className={cn(
                  'w-[2px] rounded-full animate-[soundWave_0.8s_ease-in-out_0.4s_infinite] h-1.5',
                  isAmbientPlaying ? 'bg-functional-success' : 'bg-accent'
                )}
              />
            </div>
          )}
        </span>

        {/* Text Label */}
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider font-semibold">
          {isAmbientPlaying ? 'FLOW' : isMuted ? 'SFX' : 'SFX'}
        </span>

        {/* Equalizer / Studio Sliders Icon */}
        <svg
          className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </button>
    </div>
  );
}
