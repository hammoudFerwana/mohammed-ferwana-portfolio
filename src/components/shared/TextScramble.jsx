'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテ0101XYZ_#@&%<>/*-+=';

/**
 * TextScramble — Cybernetic decoding text reveal effect.
 * Cycles through random glyphs before resolving into deterministic characters.
 */
export default function TextScramble({
  text,
  speed = 30,
  delay = 0,
  triggerOnView = true,
  className = '',
  as: Component = 'span',
}) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const animatingRef = useRef(false);

  const scramble = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        animatingRef.current = false;
      }

      iteration += 1 / 2.5;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    let timeoutId;
    if (triggerOnView && isInView) {
      timeoutId = setTimeout(() => {
        scramble();
      }, delay);
    }
    return () => clearTimeout(timeoutId);
  }, [isInView, triggerOnView, delay, scramble]);

  return (
    <Component
      ref={ref}
      className={className}
      onMouseEnter={() => {
        if (!animatingRef.current) scramble();
      }}
    >
      {displayText}
    </Component>
  );
}
