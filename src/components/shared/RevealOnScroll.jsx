'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { scrollReveal } from '@/lib/animations';

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  variant = scrollReveal,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

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
      initial="hidden"
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
