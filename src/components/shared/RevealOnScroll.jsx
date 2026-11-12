'use client';

import { m, useReducedMotion } from 'motion/react';
import { scrollReveal } from '@/lib/animations';

/**
 * RevealOnScroll: fades content in when it enters the viewport.
 *
 * Always renders the same m.div on server and client. Swapping to a plain
 * <div> for reduced motion left the server-rendered `opacity: 0` style in the DOM
 * after hydration, so reduced-motion visitors saw blank sections.
 * When prefers-reduced-motion is active, `animate="visible"` immediately resolves
 * every element (even below the fold) to opacity: 1 without waiting for scroll.
 */
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  variant = scrollReveal,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  const customVariant = prefersReducedMotion
    ? {
        ...variant,
        visible: {
          ...variant.visible,
          transition: { duration: 0 },
        },
      }
    : delay > 0
      ? {
          ...variant,
          visible: {
            ...variant.visible,
            transition: {
              ...variant.visible?.transition,
              delay,
            },
          },
        }
      : variant;

  return (
    <m.div
      data-reveal=""
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={prefersReducedMotion ? 'visible' : undefined}
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={customVariant}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}
