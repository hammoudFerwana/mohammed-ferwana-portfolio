'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { scrollReveal } from '@/lib/animations';

/**
 * RevealOnScroll: fades content in when it enters the viewport.
 *
 * Always renders the same motion.div on server and client. Swapping to a plain
 * <div> for reduced motion left the server-rendered `opacity: 0` style in the DOM
 * after hydration, so reduced-motion visitors saw blank sections.
 * With reduced motion, the element starts in its visible state instead.
 */
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  variant = scrollReveal,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  const customVariant = delay > 0 ? {
    ...variant,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible?.transition,
        delay,
      },
    },
  } : variant;

  return (
    <motion.div
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={customVariant}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
