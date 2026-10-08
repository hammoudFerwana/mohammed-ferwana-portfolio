'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { soundFx } from '@/lib/soundFx';

/**
 * Magnetic — Premium spring-physics magnetic wrapper.
 * Emil Kowalski design engineering pattern:
 * Pulls elements smoothly towards cursor on hover using Framer Motion springs.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  springConfig = { stiffness: 200, damping: 15, mass: 0.1 },
  className = '',
  as = 'div',
}) {
  const ref = useRef(null);
  const [canHover, setCanHover] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanHover(hasFinePointer && !prefersReducedMotion);
  }, []);

  const handleMouseMove = (e) => {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    rawX.set(distanceX * strength);
    rawY.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const Component = motion[as] || motion.div;

  if (!canHover) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => soundFx.playHover()}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </Component>
  );
}
