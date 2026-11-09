'use client';

import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * SmoothScrollProvider — Cinematic Lenis inertia scrolling provider.
 * Calibrated for ultra-premium agency-grade feel:
 * - Exponential decay curve (1.2s duration)
 * - 60-120fps sync via requestAnimationFrame
 * - Strict accessibility compliance: disabled when prefers-reduced-motion is active
 */
export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom exponential ease-out
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Keep native touch behavior on mobile for optimal UX
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
