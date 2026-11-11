'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function InteractivePortraitCard() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  // 3D physics state with requestAnimationFrame interpolation
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
        cardRef.current.style.transform = `perspective(1100px) rotateX(${state.currentRotX.toFixed(2)}deg) rotateY(${state.currentRotY.toFixed(2)}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`;
      }

      const glareEl = cardRef.current?.querySelector('.specular-glare');
      if (glareEl) {
        glareEl.style.background = `radial-gradient(circle 260px at ${state.glareX}% ${state.glareY}%, color-mix(in oklab, var(--hz-ink) 22%, transparent) 0%, color-mix(in oklab, var(--hz-violet) 16%, transparent) 35%, transparent 70%)`;
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
  }, [reducedMotion, isHovered]);

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
        className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-accent/35 via-accent-secondary/25 to-sea/20 blur-xl opacity-60 transition-opacity duration-700 pointer-events-none group-hover:opacity-100"
        style={{
          transform: 'translateZ(-50px)',
        }}
        aria-hidden="true"
      />

      {/* Main Card Shell */}
      <div
        ref={cardRef}
        className="relative w-full aspect-square rounded-2xl shadow-2xl transition-shadow duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transition: reducedMotion ? 'transform 0.3s ease' : 'box-shadow 0.5s ease',
        }}
        role="region"
        aria-label="Engineering Identity Card of Mohammed Ferwana"
      >
        {/* ========================================================
            FRONT FACE (Tactile Portrait & Glass HUD)
            ======================================================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-bg-secondary border border-border-strong backdrop-blur-md"
          style={{
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
            className="absolute inset-0 bg-linear-to-t from-bg-primary via-bg-primary/20 to-transparent opacity-80 pointer-events-none"
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
            className="absolute inset-3 pointer-events-none border border-border-subtle rounded-xl transition-all duration-300"
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
                <span className="text-[10px] text-text-muted">Backend Engineer</span>
              </div>
              <div className="text-right">
                <span className="text-accent font-medium text-[11px] block">Gaza, Palestine</span>
                <span className="text-[9px] text-text-muted tracking-wide">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
