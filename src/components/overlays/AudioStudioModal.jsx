'use client';

import { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';
import { cn } from '@/lib/utils';

export default function AudioStudioModal() {
  const {
    isAudioHubOpen,
    closeAudioHub,
    isMuted,
    toggleMute,
    isAmbientPlaying,
    ambientPreset,
    ambientVolume,
    ambientPresets,
    toggleAmbient,
    setAmbientPreset,
    setAmbientVolume,
    analyser,
    playHover,
    playClick,
    playTerminalKey,
    playTerminalEnter,
    playFlip,
    playModalOpen,
    playCrystalChime,
  } = useAudio();

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isAudioHubOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAudioHub();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAudioHubOpen, closeAudioHub]);

  // Prevent body scroll when open
  useEffect(() => {
    if (!isAudioHubOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAudioHubOpen]);

  // Live Canvas Waveform & Spectrum Visualizer
  useEffect(() => {
    if (!isAudioHubOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    let phase = 0;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (analyser && isAmbientPlaying) {
        analyser.getByteTimeDomainData(dataArray);

        // Draw Ambient Waveform Ribbon
        ctx.lineWidth = 2.5;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(0.5, '#06b6d4');
        gradient.addColorStop(1, '#10b981');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Glow pass
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#8b5cf6';
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Subtle dormant idle sine wave
        phase += 0.04;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isMuted ? 'rgba(115, 115, 115, 0.3)' : 'rgba(139, 92, 246, 0.4)';

        ctx.beginPath();
        for (let x = 0; x < width; x += 3) {
          const y = height / 2 + Math.sin(x * 0.025 + phase) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAudioHubOpen, analyser, isAmbientPlaying, isMuted]);

  if (!isAudioHubOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md transition-opacity duration-300"
      onClick={closeAudioHub}
      role="dialog"
      aria-modal="true"
      aria-label="Acoustic Engineering & Focus Soundscape Studio"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-bg-secondary border border-border-strong shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-bg-primary/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5v14M7 9v6M22 8v8M2 11v2" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-text-primary flex items-center gap-2">
                Acoustic Engineering Studio
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                  Web Audio API
                </span>
              </h2>
              <p className="text-[11px] text-text-muted font-mono">
                Pure procedural synthesis · Zero audio downloads (0 MB)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAudioHub}
            aria-label="Close Audio Studio"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary border border-transparent hover:border-border-default transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Real-time Oscilloscope / Visualizer Ribbon */}
          <div className="relative rounded-xl bg-bg-primary/90 border border-border-default p-3 overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isAmbientPlaying
                      ? 'bg-functional-success animate-pulse'
                      : isMuted
                      ? 'bg-text-muted/40'
                      : 'bg-accent'
                  )}
                />
                <span>SPECTRUM ANALYSER</span>
              </div>
              <span className="text-[10px] text-text-muted uppercase">
                {isAmbientPlaying
                  ? `${ambientPresets[ambientPreset]?.name} · LIVE`
                  : isMuted
                  ? 'MUTED'
                  : 'TACTILE SFX ARMED'}
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={560}
              height={64}
              className="w-full h-16 rounded bg-bg-secondary/40 block"
            />
          </div>

          {/* Section 1: Generative Focus Soundscape (Ambient Presets) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono">
                  Generative Focus Soundscapes
                </h3>
                <p className="text-[11px] text-text-secondary">
                  Continuous procedural soundscapes for deep software engineering focus.
                </p>
              </div>

              {/* Master Ambient Play/Pause Button */}
              <button
                type="button"
                onClick={toggleAmbient}
                onMouseEnter={playHover}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-all shadow-sm',
                  isAmbientPlaying
                    ? 'bg-functional-success text-black hover:bg-functional-success/90 shadow-[0_0_14px_rgba(34,197,94,0.35)]'
                    : 'bg-accent text-white hover:bg-accent-hover shadow-[0_0_14px_rgba(139,92,246,0.25)]'
                )}
              >
                {isAmbientPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    <span>Pause Soundscape</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Start Soundscape</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {Object.values(ambientPresets).map((preset) => {
                const isSelected = ambientPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setAmbientPreset(preset.id);
                      if (!isAmbientPlaying) toggleAmbient();
                    }}
                    onMouseEnter={playHover}
                    className={cn(
                      'text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-2.5 relative group',
                      isSelected
                        ? 'bg-accent/10 border-accent/50 shadow-[0_0_16px_rgba(139,92,246,0.15)] ring-1 ring-accent/30'
                        : 'bg-bg-primary/50 border-border-default hover:border-border-strong hover:bg-bg-primary/80'
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-bg-secondary border border-border-default text-text-muted">
                        {preset.tag}
                      </span>
                      {isSelected && isAmbientPlaying && (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-1 bg-accent rounded-full animate-[soundWave_0.6s_ease-in-out_infinite] h-2" />
                          <span className="w-1 bg-accent rounded-full animate-[soundWave_0.6s_ease-in-out_0.2s_infinite] h-3" />
                          <span className="w-1 bg-accent rounded-full animate-[soundWave_0.6s_ease-in-out_0.4s_infinite] h-1.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ambient Volume Slider */}
            <div className="flex items-center gap-4 pt-2 bg-bg-primary/40 px-3.5 py-2.5 rounded-xl border border-border-subtle">
              <span className="text-[11px] font-mono text-text-muted shrink-0">
                Ambient Volume
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                aria-label="Ambient volume"
                className="w-full accent-accent cursor-pointer"
              />
              <span className="font-mono text-xs text-text-primary shrink-0 w-10 text-right">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Section 2: Tactile Interface Sound Effects */}
          <div className="space-y-3 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
                  Tactile UI Sound Effects (SFX)
                  <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-default text-text-muted">
                    Press M
                  </kbd>
                </h3>
                <p className="text-[11px] text-text-secondary">
                  Micro-haptic acoustic feedback for buttons, navigation, and modals.
                </p>
              </div>

              {/* Master SFX Mute Switch */}
              <button
                type="button"
                onClick={toggleMute}
                onMouseEnter={playHover}
                className={cn(
                  'px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all border',
                  isMuted
                    ? 'bg-bg-tertiary border-border-default text-text-muted hover:text-text-primary'
                    : 'bg-accent/15 border-accent/40 text-accent hover:bg-accent/25'
                )}
              >
                {isMuted ? 'Tactile SFX: Muted' : 'Tactile SFX: Active'}
              </button>
            </div>

            {/* Audition Sound Lab */}
            <div className="bg-bg-primary/50 rounded-xl border border-border-default p-3 space-y-2">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
                Audition Sound FX Synthesizers
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={playHover}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  Tick (Hover)
                </button>
                <button
                  type="button"
                  onClick={playClick}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  Click (Press)
                </button>
                <button
                  type="button"
                  onClick={playTerminalKey}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  CLI Key
                </button>
                <button
                  type="button"
                  onClick={playTerminalEnter}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  CLI Enter
                </button>
                <button
                  type="button"
                  onClick={playFlip}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  3D Card Flip
                </button>
                <button
                  type="button"
                  onClick={playModalOpen}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary hover:bg-bg-tertiary border border-border-default text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  Modal Sweep
                </button>
                <button
                  type="button"
                  onClick={() => playCrystalChime(1.2)}
                  className="px-2.5 py-1 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-[11px] font-mono text-accent transition-colors"
                >
                  Crystal Chime ✨
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-bg-primary/70 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-muted">
          <span>Preferences saved automatically in localStorage</span>
          <kbd className="px-2 py-0.5 rounded bg-bg-tertiary border border-border-default text-text-muted">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
