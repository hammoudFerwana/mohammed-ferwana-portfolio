'use client';

import { useAudio } from '@/context/AudioContext';
import { cn } from '@/lib/utils';

export default function AudioWaveToggle({ className }) {
  const { isMuted, toggleMute, playHover } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMute}
      onMouseEnter={playHover}
      aria-label={isMuted ? 'Enable tactile sound effects (Press M)' : 'Mute tactile sound effects (Press M)'}
      title={isMuted ? 'Tactile Sound: OFF (Press M to enable)' : 'Tactile Sound: ON (Press M to mute)'}
      className={cn(
        'group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent font-mono text-[11px]',
        isMuted
          ? 'bg-bg-secondary hover:bg-bg-tertiary border border-border-default hover:border-border-strong text-text-muted hover:text-text-secondary'
          : 'bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 text-accent shadow-[0_0_12px_rgba(139,92,246,0.25)]',
        className
      )}
    >
      {/* Waveform Bars or Muted Speaker */}
      <div className="flex items-center gap-0.5 h-3.5 w-3.5 justify-center" aria-hidden="true">
        {isMuted ? (
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
            <span className="w-[2px] bg-accent rounded-full animate-[soundWave_0.8s_ease-in-out_infinite] h-2" />
            <span className="w-[2px] bg-accent rounded-full animate-[soundWave_0.8s_ease-in-out_0.2s_infinite] h-3" />
            <span className="w-[2px] bg-accent rounded-full animate-[soundWave_0.8s_ease-in-out_0.4s_infinite] h-1.5" />
          </div>
        )}
      </div>

      {/* Label Text */}
      <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider font-semibold">
        {isMuted ? 'SFX' : 'SFX'}
      </span>

      {/* Mini Status Dot */}
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full transition-colors',
          isMuted ? 'bg-text-muted/40' : 'bg-functional-success shadow-[0_0_6px_rgba(34,197,94,0.6)]'
        )}
      />
    </button>
  );
}
