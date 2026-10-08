'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ambientSoundscape, AMBIENT_PRESETS } from '@/lib/ambientSoundscape';
import { soundFx } from '@/lib/soundFx';
import { cn } from '@/lib/utils';

export default function AmbientSoundDeck() {
  const [isOpen, setIsOpen] = useState(false);
  const [engineState, setEngineState] = useState(ambientSoundscape.getState());
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Sync state with ambient soundscape singleton
  useEffect(() => {
    const unsubscribe = ambientSoundscape.subscribe((state) => {
      setEngineState({ ...state });
    });

    // Listen to scroll to modulate acoustic filter cutoff dynamically
    const handleScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollMax > 0 ? window.scrollY / scrollMax : 0;
      ambientSoundscape.setScrollDepth(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Keyboard shortcut 'b' or 'B' to toggle ambient audio
    const handleKeyDown = (e) => {
      if (
        (e.key === 'b' || e.key === 'B') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !['INPUT', 'TEXTAREA'].includes(e.target.tagName) &&
        !e.target.isContentEditable
      ) {
        ambientSoundscape.toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activePreset = AMBIENT_PRESETS[engineState.currentPreset] || AMBIENT_PRESETS.deep_space;

  // Real-time Waveform Ribbon / Spectrum Analyser Canvas
  useEffect(() => {
    if (!isOpen || !engineState.isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = engineState.analyser;
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const renderWave = () => {
      animFrameRef.current = requestAnimationFrame(renderWave);

      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
      }

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Render glowing audio waveform ribbon
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = activePreset.color;
      ctx.shadowColor = activePreset.color;
      ctx.shadowBlur = 10;

      const sliceWidth = width / (bufferLength - 1);
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 0 to 2
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, engineState.isPlaying, engineState.analyser, activePreset]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    soundFx.playClick();
    ambientSoundscape.toggle();
  };

  const handleSelectPreset = (presetId) => {
    soundFx.playClick();
    ambientSoundscape.setPreset(presetId);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    ambientSoundscape.setVolume(val);
  };

  return (
    <aside aria-label="Generative Ambient Soundscape Controller" className="fixed bottom-5 left-5 z-40 select-none">
      {/* 1. Collapsed Ambient Pill */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative flex items-center gap-3 px-3.5 py-2.5 rounded-full border shadow-2xl backdrop-blur-2xl transition-all duration-300',
          engineState.isPlaying
            ? 'bg-bg-secondary/90 border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
            : 'bg-bg-primary/80 border-border-default hover:border-border-strong hover:bg-bg-secondary/90'
        )}
      >
        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent shrink-0',
            engineState.isPlaying
              ? 'bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
              : 'bg-bg-tertiary text-text-muted hover:text-text-primary hover:bg-bg-tertiary/80'
          )}
          title={engineState.isPlaying ? 'Pause Ambient Soundscape (Shortcut: B)' : 'Play Generative Ambient Soundscape (Shortcut: B)'}
          aria-label={engineState.isPlaying ? 'Pause generative ambient soundscape' : 'Play generative ambient soundscape'}
        >
          {engineState.isPlaying ? (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Live Audio Equalizer Bars or Idle State */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setIsOpen((prev) => !prev);
          }}
          className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-accent rounded-md py-0.5"
          title="Open Soundscape Control Deck"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {/* Animated Equalizer Waves */}
          <div className="flex items-end gap-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <span
              className={cn(
                'w-0.5 rounded-full transition-all duration-200',
                engineState.isPlaying ? 'bg-accent animate-pulse' : 'bg-text-muted/40 h-1.5'
              )}
              style={{
                height: engineState.isPlaying ? '14px' : '4px',
                animationDuration: '0.6s',
              }}
            />
            <span
              className={cn(
                'w-0.5 rounded-full transition-all duration-200',
                engineState.isPlaying ? 'bg-accent-secondary animate-pulse' : 'bg-text-muted/40 h-2.5'
              )}
              style={{
                height: engineState.isPlaying ? '10px' : '6px',
                animationDuration: '0.9s',
                animationDelay: '0.15s',
              }}
            />
            <span
              className={cn(
                'w-0.5 rounded-full transition-all duration-200',
                engineState.isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-text-muted/40 h-1'
              )}
              style={{
                height: engineState.isPlaying ? '16px' : '3px',
                animationDuration: '0.75s',
                animationDelay: '0.3s',
              }}
            />
          </div>

          {/* Preset Label & Subtext */}
          <div className="flex flex-col pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-primary tracking-tight">
                {engineState.isPlaying ? activePreset.name : 'Ambient Deck'}
              </span>
              {engineState.isPlaying && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: activePreset.color }}
                />
              )}
            </div>
            <span className="text-[10px] font-mono text-text-muted leading-tight">
              {engineState.isPlaying ? activePreset.tag : 'Procedural Soundscape'}
            </span>
          </div>

          {/* Deck Expand / Collapse Chevron */}
          <svg
            className={cn(
              'w-3.5 h-3.5 text-text-muted hover:text-text-primary transition-transform duration-200 ml-1',
              isOpen && 'rotate-180'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </motion.div>

      {/* 2. Expanded Cyber-Deck Modal Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 left-0 w-[330px] sm:w-[360px] p-4 rounded-3xl bg-bg-secondary/95 border border-border-default/90 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl z-50 flex flex-col gap-4 text-text-primary"
            role="dialog"
            aria-label="Generative Soundscape Audio Mixer"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="font-semibold text-text-primary uppercase tracking-wider text-[11px]">
                  Generative Soundscape
                </span>
                <span className="text-text-muted text-[10px]">· 0 MB Pure Synth</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setIsOpen(false);
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                title="Close Deck"
                aria-label="Close soundscape deck"
              >
                ✕
              </button>
            </div>

            {/* Realtime Waveform Ribbon Canvas */}
            <div className="relative h-14 rounded-2xl bg-bg-tertiary/60 border border-border-subtle overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={320}
                height={56}
                className="w-full h-full block"
              />
              {!engineState.isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-text-muted bg-bg-primary/40 backdrop-blur-xs">
                  <span>Press Play to Synthesize Audio Waves</span>
                </div>
              )}
            </div>

            {/* Soundscape Preset Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span>ACOUSTIC PRESETS:</span>
                <span className="text-accent text-[10px]">Pure Web Audio API</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {Object.values(AMBIENT_PRESETS).map((preset) => {
                  const isSelected = engineState.currentPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-2xl border text-left transition-all duration-200 group',
                        isSelected
                          ? 'bg-bg-tertiary border-accent/60 shadow-sm'
                          : 'bg-bg-primary/50 border-border-subtle hover:border-border-default hover:bg-bg-tertiary/40'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-110"
                          style={{ backgroundColor: preset.color }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-text-primary truncate">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-text-muted truncate">
                            {preset.subtitle}
                          </div>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full border border-border-subtle shrink-0">
                        {preset.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control Slider */}
            <div className="space-y-1.5 pt-1 border-t border-border-subtle">
              <div className="flex items-center justify-between font-mono text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>Volume Level:</span>
                </span>
                <span className="text-text-primary font-semibold">
                  {Math.round(engineState.volume * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={engineState.volume}
                onChange={handleVolumeChange}
                className="w-full accent-accent h-1.5 bg-bg-tertiary rounded-lg appearance-none cursor-pointer"
                aria-label="Soundscape Volume Level"
              />
            </div>

            {/* Footer Features Info */}
            <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1">
              <span className="flex items-center gap-1">
                <span className="text-accent">✦</span>
                <span>Scroll-Adaptive Filter Sweep</span>
              </span>
              <span className="bg-bg-tertiary px-2 py-0.5 rounded-full border border-border-subtle">
                Key: &apos;B&apos;
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
