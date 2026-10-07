'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * KineticCursor — Luxury magnetic cursor with spring physics & interactive targeting.
 *
 * Designed to elevate UX with responsive haptic visual feedback:
 * - Ultra-smooth requestAnimationFrame interpolation (60-120fps)
 * - Dynamic target scaling on interactive elements (links, buttons, inputs)
 * - Hardware accelerated with transform only (zero layout shifts)
 * - Zero footprint on touch/mobile devices or when prefers-reduced-motion is active
 */
export default function KineticCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Check for fine pointer (mouse/trackpad) and reduced motion preference
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering an interactive element
      const target = e.target;
      if (target) {
        const isInteractive = Boolean(
          target.closest('a, button, input, select, textarea, [role="button"], [data-cursor-target]')
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Render loop with lerp (linear interpolation) for spring lag
    const render = () => {
      // Ring follows mouse with smooth damping factor
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(139,92,246,0.8)]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
        }}
      />

      {/* Kinetic Fluid Ambient Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center"
        style={{
          width: isHoveringInteractive ? '48px' : isClicking ? '26px' : '34px',
          height: isHoveringInteractive ? '48px' : isClicking ? '26px' : '34px',
          borderColor: isHoveringInteractive
            ? 'rgba(168, 85, 247, 0.5)'
            : 'rgba(255, 255, 255, 0.2)',
          backgroundColor: isHoveringInteractive
            ? 'rgba(139, 92, 246, 0.12)'
            : isClicking
            ? 'rgba(139, 92, 246, 0.25)'
            : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: isHoveringInteractive ? 'blur(1px)' : 'none',
          boxShadow: isHoveringInteractive
            ? '0 0 20px rgba(139, 92, 246, 0.25)'
            : 'none',
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform, width, height, background-color',
        }}
      />
    </div>
  );
}
