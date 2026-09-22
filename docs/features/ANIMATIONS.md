# Animation System

> Motion design principles, animation variants, and performance guidelines.

---

## Philosophy

Animation communicates hierarchy and interaction, not decoration.

| ✅ Good Animation | ❌ Bad Animation |
|-------------------|-----------------|
| Subtle page transitions | Constant floating elements |
| Scroll reveal on entry | Excessive bouncing |
| Hover state feedback | Endless animations |
| Architecture node highlighting | Distracting backgrounds |
| Command palette opening | Slow transitions |
| Intentional micro-interactions | Animation for animation's sake |

**The site should feel: engineered, intentional, restrained.**

---

## Animation Categories

### 1. Page Transitions

```javascript
// Fade transition between routes
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
```

### 2. Scroll Reveal

Default entrance for all sections and content blocks:

```javascript
const scrollReveal = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
```

Triggered by `IntersectionObserver` via Framer Motion's `whileInView`.

### 3. Stagger Children

For lists, grids, and grouped elements:

```javascript
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 4. Hover & Press

```javascript
// Button press feedback
const buttonMotion = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

// Card hover
const cardMotion = {
  whileHover: {
    y: -4,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 5. Overlay / Modal

```javascript
// Backdrop
const backdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Modal/Palette content
const modalVariant = {
  hidden: { opacity: 0, y: -20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 6. Hero Section

```javascript
// Name reveal
const nameReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
};

// System status dots pulse
const pulseAnimation = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};
```

---

## Reduced Motion

```javascript
import { useReducedMotion } from 'framer-motion';

const prefersReducedMotion = useReducedMotion();

// When true:
// - All scroll reveals: instant (no animation)
// - Hover effects: remain (they're interaction feedback)
// - Page transitions: instant opacity change
// - Pulse animations: disabled
// - Stagger: disabled (all appear at once)
```

Every animated component must check `prefersReducedMotion` and provide an instant fallback.

---

## Performance Rules

| Rule | Why |
|------|-----|
| Only animate `transform` and `opacity` | GPU-accelerated, no layout reflow |
| Never animate `top`, `left`, `width`, `height` | Triggers expensive layout recalculation |
| Use `will-change: transform` sparingly | Reserves GPU memory; don't overuse |
| `backdrop-blur` only on fixed/sticky elements | Continuous blur on scrolling content kills FPS |
| Use `IntersectionObserver` for scroll triggers | Not `window.addEventListener('scroll')` |
| Clean up effects on unmount | Prevent memory leaks |
| Memoize animation components | Prevent unnecessary re-renders |

---

## CSS Custom Easing Curves

```css
/* Add to globals.css */
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
}
```

**Never use:** `linear`, `ease`, `ease-in`, `ease-in-out` (too mechanical for premium feel).

---

## Implementation: RevealOnScroll Wrapper

Reusable wrapper component for scroll-triggered reveals:

```jsx
// components/shared/RevealOnScroll.jsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

export default function RevealOnScroll({ children, delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
```
