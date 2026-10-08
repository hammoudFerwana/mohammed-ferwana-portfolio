'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAudio } from '@/context/AudioContext';

export default function InteractivePortraitCard() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const { playFlip, playClick, playSuccess, playHover } = useAudio();

  // 3D physics state with requestAnimationFrame interpolation
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Target and current rotation & glare coordinates
  const stateRef = useRef({
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    targetGlareOpacity: 0,
    rafId: null,
  });

  // Back-side interactive ping state
  const [pingStatus, setPingStatus] = useState({
    active: false,
    latency: 14,
    timestamp: 'ONLINE',
  });

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Animation loop with smooth spring damping
  useEffect(() => {
    if (reducedMotion) return;

    let isRunning = true;
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const state = stateRef.current;

    const tick = () => {
      if (!isRunning) return;

      // Spring-like smooth interpolation (0.12 factor gives weighty physical feeling)
      state.currentRotX = lerp(state.currentRotX, state.targetRotX, 0.12);
      state.currentRotY = lerp(state.currentRotY, state.targetRotY, 0.12);
      state.glareOpacity = lerp(state.glareOpacity, state.targetGlareOpacity, 0.15);

      if (cardRef.current) {
        // Base tilt + flip rotation
        const flipAngle = isFlipped ? 180 : 0;
        cardRef.current.style.transform = `perspective(1100px) rotateX(${state.currentRotX.toFixed(2)}deg) rotateY(${(state.currentRotY + flipAngle).toFixed(2)}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`;
      }

      const glareEl = cardRef.current?.querySelector('.specular-glare');
      if (glareEl) {
        glareEl.style.background = `radial-gradient(circle 260px at ${state.glareX}% ${state.glareY}%, rgba(255, 255, 255, 0.22) 0%, rgba(139, 92, 246, 0.16) 35%, transparent 70%)`;
        glareEl.style.opacity = state.glareOpacity.toFixed(3);
      }

      state.rafId = requestAnimationFrame(tick);
    };

    state.rafId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
    };
  }, [reducedMotion, isFlipped, isHovered]);

  // Mouse Move Event Listener
  const handleMouseMove = useCallback((e) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Calculate rotation (-14deg to +14deg max)
    const rotX = (0.5 - y) * 20;
    const rotY = (x - 0.5) * 20;

    const s = stateRef.current;
    s.targetRotX = rotX;
    s.targetRotY = rotY;
    s.glareX = Math.round(x * 100);
    s.glareY = Math.round(y * 100);
    s.targetGlareOpacity = 0.95;
  }, [reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    stateRef.current.targetGlareOpacity = 0.95;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const s = stateRef.current;
    s.targetRotX = 0;
    s.targetRotY = 0;
    s.targetGlareOpacity = 0;
  }, []);

  // Ping kernel simulation
  const handlePingKernel = (e) => {
    e.stopPropagation();
    playClick();
    setPingStatus((prev) => ({ ...prev, active: true }));
    setTimeout(() => {
      const randomLatency = Math.floor(Math.random() * 8) + 11; // 11ms - 18ms
      playSuccess();
      setPingStatus({
        active: false,
        latency: randomLatency,
        timestamp: 'ACK_OK',
      });
    }, 400);
  };

  const toggleFlip = (e) => {
    e.stopPropagation();
    playFlip();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm select-none"
      style={{ perspective: '1100px' }}
    >
      {/* Dynamic Ambient Glow Field Behind Card */}
      <div
        className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-accent/35 via-accent-secondary/25 to-cyan-500/20 blur-xl opacity-60 transition-opacity duration-700 pointer-events-none group-hover:opacity-100"
        style={{
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.4s ease, opacity 0.4s ease',
        }}
        aria-hidden="true"
      />

      {/* 3D Card Shell */}
      <div
        ref={cardRef}
        className="relative w-full aspect-square rounded-2xl shadow-2xl transition-shadow duration-500 cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transition: reducedMotion ? 'transform 0.3s ease' : 'box-shadow 0.5s ease',
        }}
        onClick={toggleFlip}
        role="region"
        aria-label="Interactive 3D Engineering Identity Card of Mohammed Ferwana"
      >
        {/* ========================================================
            FRONT FACE (Tactile Portrait & Glass HUD)
            ======================================================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-bg-secondary border border-border-strong backdrop-blur-md"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          {/* Base Portrait Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/portrait.jpg"
              alt="Mohammed Ferwana - Backend Engineer"
              width={480}
              height={480}
              priority
              className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-95"
            />
          </div>

          {/* Cinematic Vignette Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent opacity-80 pointer-events-none"
            aria-hidden="true"
          />

          {/* Specular Light Reflection (Follows Cursor) */}
          <div
            className="specular-glare absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: 0,
              mixBlendMode: 'screen',
            }}
            aria-hidden="true"
          />

          {/* Micro Tactical Brackets (Depth Layer 1: translateZ 25px) */}
          <div
            className="absolute inset-3 pointer-events-none border border-white/5 rounded-xl transition-all duration-300"
            style={{
              transform: 'translateZ(25px)',
            }}
            aria-hidden="true"
          >
            {/* Top-Left Bracket */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent/70 rounded-tl" />
            {/* Top-Right Bracket */}
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent/70 rounded-tr" />
            {/* Bottom-Left Bracket */}
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent/70 rounded-bl" />
            {/* Bottom-Right Bracket */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent/70 rounded-br" />
          </div>

          {/* Top Status Bar & Flip Button (Depth Layer 2: translateZ 38px) */}
          <div
            className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-auto"
            style={{ transform: 'translateZ(38px)' }}
          >
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-primary/80 backdrop-blur-md border border-border-default shadow-sm text-[10px] font-mono text-text-secondary tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-functional-success animate-pulse-ring shrink-0" />
              <span className="font-semibold text-text-primary">SYS_ACTIVE</span>
            </div>

            {/* Flip / Inspect Specs Action Pill */}
            <button
              onClick={toggleFlip}
              type="button"
              className="group/btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-primary/85 hover:bg-accent/20 backdrop-blur-md border border-border-default hover:border-accent/40 text-[10px] font-mono text-text-secondary hover:text-accent transition-all duration-200 shadow-sm"
              title="Click to inspect Mohammed's Architectural DNA"
              aria-label="Inspect Technical Specs"
            >
              <svg
                className="w-3 h-3 group-hover/btn:rotate-180 transition-transform duration-500 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>SPECS</span>
            </button>
          </div>

          {/* Bottom Identity & Origin Pill (Depth Layer 3: translateZ 46px) */}
          <div
            className="absolute bottom-3.5 left-3.5 right-3.5 z-20"
            style={{ transform: 'translateZ(46px)' }}
          >
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-bg-primary/90 backdrop-blur-md border border-border-default shadow-lg text-xs font-mono">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary font-bold tracking-tight">Mohammed Ferwana</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <span className="text-[10px] text-text-muted">Senior Backend Engineer</span>
              </div>
              <div className="text-right">
                <span className="text-accent font-medium text-[11px] block">Gaza, Palestine</span>
                <span className="text-[9px] text-text-muted tracking-wide">UTC+3 · Remote/Hybrid</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            BACK FACE (Architectural Kernel & Tech Specs HUD)
            ======================================================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-bg-secondary/95 border border-accent/30 p-5 flex flex-col justify-between backdrop-blur-xl shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Subtle Grid Blueprint Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
            aria-hidden="true"
          />

          {/* Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="font-bold text-text-primary tracking-wider uppercase">ARCH_KERNEL_SPECS</span>
            </div>
            <button
              onClick={toggleFlip}
              type="button"
              className="inline-flex items-center gap-1 text-[10px] font-mono text-accent hover:text-accent-hover bg-accent/10 px-2 py-0.5 rounded border border-accent/20 transition-colors"
              aria-label="Return to portrait"
            >
              <span>↩ PORTRAIT</span>
            </button>
          </div>

          {/* System Metrics Bento */}
          <div className="relative z-10 space-y-2.5 my-auto font-mono text-xs">
            {/* Metric 1 */}
            <div className="p-2.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle hover:border-accent/30 transition-colors">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">CORE PARADIGM</div>
              <div className="text-text-primary font-medium text-[11px] flex items-center justify-between">
                <span>Event-Driven & Deterministic</span>
                <span className="text-functional-success text-[10px]">VERIFIED</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-2.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle hover:border-accent/30 transition-colors">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">CONCURRENCY & SAFETY</div>
              <div className="text-text-primary font-medium text-[11px] flex items-center justify-between">
                <span>Guarded FSM · Zero Collisions</span>
                <span className="text-accent text-[10px]">MUTEX/LOCKS</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-2.5 rounded-lg bg-bg-tertiary/70 border border-border-subtle hover:border-accent/30 transition-colors">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">PRODUCTION STACK</div>
              <div className="text-text-primary font-medium text-[11px]">
                Node.js · Go · Express · MongoDB · Redis · Docker
              </div>
            </div>
          </div>

          {/* Interactive Heartbeat Ping Simulator */}
          <div className="relative z-10 pt-2 border-t border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[10px] text-text-muted">
              <span>LATENCY:</span>
              <span className="text-functional-success font-semibold">
                {pingStatus.latency}ms
              </span>
              <span className="text-[9px] text-text-secondary">({pingStatus.timestamp})</span>
            </div>

            <button
              onClick={handlePingKernel}
              disabled={pingStatus.active}
              type="button"
              className="px-2.5 py-1 rounded bg-bg-elevated hover:bg-accent/20 border border-border-default hover:border-accent/40 text-[10px] font-mono text-text-primary transition-all active:scale-95"
            >
              {pingStatus.active ? 'PINGING...' : '⚡ PING CORE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
