'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * CounterTicker — Smooth odometer / rolling number counter.
 * Animates numerical metrics dynamically when scrolled into view using spring physics.
 */
export default function CounterTicker({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  // Motion value starting at 0
  const motionVal = useMotionValue(0);

  // Smooth spring physics for rolling up
  const springVal = useSpring(motionVal, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (isInView) {
      motionVal.set(typeof value === 'number' ? value : parseFloat(value) || 0);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      setDisplayValue(latest.toFixed(decimals));
    });
    return () => unsubscribe();
  }, [springVal, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
