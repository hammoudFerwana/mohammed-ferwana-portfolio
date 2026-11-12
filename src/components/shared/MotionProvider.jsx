'use client';

import { LazyMotion, MotionConfig, domMax } from 'motion/react';

/**
 * MotionProvider — Provides LazyMotion features and global reduced-motion policy across the app.
 * Uses domMax because CareerTimeline, HowIThink, and ProjectsExplorer use layout / layoutId.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
