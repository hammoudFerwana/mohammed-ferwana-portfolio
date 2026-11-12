'use client';

import { LazyMotion, domMax } from 'motion/react';

/**
 * MotionProvider — Provides LazyMotion features across the app.
 * Uses domMax because CareerTimeline, HowIThink, and ProjectsExplorer use layout / layoutId.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
