'use client';

import { useRef, useCallback } from 'react';

/**
 * SpotlightCard — Dynamic radial gradient cursor glow card container.
 *
 * Micro-interaction container with zero per-frame JavaScript cost:
 * updates CSS custom properties (--mx, --my) directly on the element ref
 * on pointer move for mouse devices, driving a pure CSS pseudo-element gradient.
 *
 * Gated with zero state and effect hooks to preserve minimal client footprint.
 *
 * @param {React.ElementType} as — Root element tag (default: 'div')
 * @param {string} className — Additional CSS class names
 * @param {React.ReactNode} children — Card content
 */
export default function SpotlightCard({
  as: Component = 'div',
  className,
  children,
  ...props
}) {
  const containerRef = useRef(null);

  const handlePointerMove = useCallback((e) => {
    if (e.pointerType !== 'mouse') return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);

    // 3D Perspective Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -3.5;
    const tiltY = ((x - centerX) / centerX) * 3.5;
    el.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }, []);

  const combinedClassName = className
    ? `spotlight-card ${className}`
    : 'spotlight-card';

  return (
    <Component
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={combinedClassName}
      {...props}
    >
      {children}
    </Component>
  );
}
