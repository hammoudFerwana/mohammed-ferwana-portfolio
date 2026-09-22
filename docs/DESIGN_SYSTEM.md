# Design System

> Visual design tokens, typography, color palette, spacing, animation, and component styles for Mohammed Ferwana's engineering portfolio.

---

## 1. Design Philosophy

The visual system follows these principles:

| Principle | Meaning |
|-----------|---------|
| **Sophisticated** | Premium feel, not flashy |
| **Technical** | Engineering-flavored, not corporate |
| **Editorial** | Large typography, generous whitespace |
| **Restrained** | Every animation has purpose |
| **Dark** | Deep surfaces, high contrast |

**Think:** Linear.dev + Stripe documentation + premium engineering product
**NOT:** Gaming site / hacker terminal / cyberpunk / neon overload

---

## 2. Color Palette

### Foundation

```css
/* Background Surfaces */
--color-bg-primary:       #0a0a0f;      /* Deepest background */
--color-bg-secondary:     #111118;      /* Cards, elevated surfaces */
--color-bg-tertiary:      #1a1a24;      /* Hover states, subtle elevation */
--color-bg-elevated:      #22222e;      /* Modals, command palette */

/* Borders */
--color-border-subtle:    rgba(255, 255, 255, 0.06);  /* Hairline borders */
--color-border-default:   rgba(255, 255, 255, 0.10);  /* Default borders */
--color-border-strong:    rgba(255, 255, 255, 0.15);  /* Emphasis borders */

/* Text */
--color-text-primary:     #f5f5f7;      /* Primary text (off-white) */
--color-text-secondary:   #a1a1aa;      /* Secondary text (zinc-400) */
--color-text-tertiary:    #71717a;      /* Tertiary text (zinc-500) */
--color-text-muted:       #52525b;      /* Muted text (zinc-600) */
```

### Accent — Purple / Indigo

```css
/* Primary Accent */
--color-accent-primary:   #8b5cf6;      /* Purple-500 — CTAs, links */
--color-accent-hover:     #7c3aed;      /* Purple-600 — Hover state */
--color-accent-subtle:    rgba(139, 92, 246, 0.10);  /* Purple glow bg */
--color-accent-border:    rgba(139, 92, 246, 0.25);  /* Purple border */

/* Secondary Accent (for contrast) */
--color-accent-secondary: #6366f1;      /* Indigo-500 — Subtle variation */
```

### Functional Colors

```css
--color-success:          #22c55e;      /* Green-500 */
--color-error:            #ef4444;      /* Red-500 */
--color-warning:          #f59e0b;      /* Amber-500 */
--color-info:             #3b82f6;      /* Blue-500 */
```

### Usage Rules

> [!IMPORTANT]
> - The accent color is used **sparingly** — CTAs, active states, hover highlights, key headings
> - The site is NOT purple. It's dark with purple accents.
> - Never use accent color for large surfaces or backgrounds
> - Maintain high contrast ratios: text on dark backgrounds ≥ 4.5:1

---

## 3. Typography

### Font Stack

```css
/* Primary — Display & Body */
--font-sans: 'Geist', system-ui, -apple-system, sans-serif;

/* Monospace — Technical elements, code, metadata */
--font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Level | Size (Desktop) | Size (Mobile) | Weight | Tracking | Usage |
|-------|---------------|---------------|--------|----------|-------|
| **Display** | 72px / 4.5rem | 40px / 2.5rem | 700 | -0.04em | Hero name |
| **H1** | 56px / 3.5rem | 32px / 2rem | 700 | -0.03em | Page titles |
| **H2** | 40px / 2.5rem | 28px / 1.75rem | 600 | -0.02em | Section headings |
| **H3** | 28px / 1.75rem | 22px / 1.375rem | 600 | -0.01em | Subsection headings |
| **H4** | 20px / 1.25rem | 18px / 1.125rem | 600 | 0 | Card titles |
| **Body Large** | 18px / 1.125rem | 16px / 1rem | 400 | 0 | Hero description |
| **Body** | 16px / 1rem | 15px / 0.9375rem | 400 | 0 | Paragraph text |
| **Body Small** | 14px / 0.875rem | 13px / 0.8125rem | 400 | 0 | Captions, meta |
| **Label** | 12px / 0.75rem | 11px / 0.6875rem | 500 | 0.08em | Tags, badges, eyebrows |
| **Mono** | 14px / 0.875rem | 13px / 0.8125rem | 400 | 0 | Code, technical metadata |

### Typography Rules

- Maximum line width for body text: `65ch`
- Line height for body: `1.6`
- Line height for headings: `1.1` (Display) to `1.3` (H3+)
- Never use ALL CAPS for body text
- Use UPPERCASE only for labels/badges with letter-spacing

---

## 4. Spacing System

### Base Unit: 4px

```css
--space-1:    4px;    /* 0.25rem */
--space-2:    8px;    /* 0.5rem */
--space-3:    12px;   /* 0.75rem */
--space-4:    16px;   /* 1rem */
--space-5:    20px;   /* 1.25rem */
--space-6:    24px;   /* 1.5rem */
--space-8:    32px;   /* 2rem */
--space-10:   40px;   /* 2.5rem */
--space-12:   48px;   /* 3rem */
--space-16:   64px;   /* 4rem */
--space-20:   80px;   /* 5rem */
--space-24:   96px;   /* 6rem */
--space-32:   128px;  /* 8rem */
```

### Section Spacing

| Element | Desktop | Mobile |
|---------|---------|--------|
| Section padding (vertical) | `96px` (py-24) — `128px` (py-32) | `64px` (py-16) — `80px` (py-20) |
| Container max-width | `1280px` (max-w-7xl) | Full width with `px-5` |
| Container padding (horizontal) | `32px` (px-8) | `20px` (px-5) |
| Component gap (vertical) | `48px` — `64px` | `32px` — `48px` |
| Card internal padding | `24px` — `32px` | `20px` — `24px` |

---

## 5. Border & Surface System

### Border Radius

```css
--radius-sm:    6px;     /* Small elements, badges */
--radius-md:    8px;     /* Cards, inputs */
--radius-lg:    12px;    /* Large cards, modals */
--radius-xl:    16px;    /* Major containers */
--radius-2xl:   24px;    /* Hero elements */
--radius-full:  9999px;  /* Pills, circular */
```

### Shadows (Dark Theme)

```css
/* Subtle elevation */
--shadow-sm:    0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md:    0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg:    0 8px 24px rgba(0, 0, 0, 0.5);

/* Accent glow (for hover states) */
--shadow-accent: 0 0 30px rgba(139, 92, 246, 0.15);

/* Inner highlight (for elevated surfaces) */
--shadow-inner: inset 0 1px 0 rgba(255, 255, 255, 0.05);
```

### Surface Layering

```
Layer 0 — Page background          #0a0a0f
Layer 1 — Cards, sections          #111118 + border-subtle
Layer 2 — Elevated (hover/active)  #1a1a24 + border-default
Layer 3 — Modals, overlays         #22222e + border-strong + shadow-lg
Layer 4 — Command palette          #22222e + backdrop-blur-xl
```

---

## 6. Animation Tokens

### Timing

```css
--duration-fast:     150ms;   /* Hover states, micro-interactions */
--duration-normal:   300ms;   /* Transitions, reveals */
--duration-slow:     500ms;   /* Page transitions, scroll reveals */
--duration-slower:   800ms;   /* Complex entrance animations */
```

### Easing

```css
/* Custom cubic-bezier curves — NO linear or ease-in-out */
--ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);        /* Primary exit curve */
--ease-out-quart:    cubic-bezier(0.25, 1, 0.5, 1);        /* Smooth deceleration */
--ease-in-out-sine:  cubic-bezier(0.37, 0, 0.63, 1);       /* Gentle in-out */
--ease-spring:       cubic-bezier(0.32, 0.72, 0, 1);       /* Spring-like feel */
```

### Framer Motion Variants (reusable)

```javascript
// Scroll reveal (default for all sections)
const revealVariant = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

// Stagger children
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

// Button press
const buttonPress = {
  whileTap: { scale: 0.98 },
  whileHover: { y: -1 }
};
```

### Animation Rules

> [!WARNING]
> - **Only animate** `transform` and `opacity` (GPU-accelerated)
> - **Never animate** `top`, `left`, `width`, `height` (triggers layout reflow)
> - **Respect** `prefers-reduced-motion` — disable all motion when user prefers
> - **No** `window.addEventListener('scroll')` — use IntersectionObserver or Framer Motion hooks
> - **`backdrop-blur`** only on fixed/sticky elements (navbar, overlays)
> - Animation should feel **engineered and restrained**, not playful

---

## 7. Component Patterns

### Button Styles

```
Primary:    Purple bg → white text → hover: darker purple + scale(0.98)
Secondary:  Transparent → border-default → hover: bg-tertiary
Ghost:      Transparent → no border → hover: bg-tertiary
Link:       Purple text → hover: underline offset animation
```

### Card Pattern

```
Container:  bg-secondary + border-subtle + radius-lg + shadow-inner
Hover:      bg-tertiary + border-default + subtle y-translate(-2px)
Active:     accent-border + shadow-accent
```

### Badge / Tag Pattern

```
Style:      bg-accent-subtle + accent-border + text-accent + radius-full
Size:       px-3 py-1 text-label uppercase tracking-wide
```

### Section Heading Pattern

```
Eyebrow:    Label text (uppercase, tracking, text-accent, mono font)
Heading:    H2 (text-primary, tracking-tight)
Description: Body (text-secondary, max-w-[65ch])
```

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Mobile-First Approach

All styles start mobile and scale up:
- Base: Single column, `px-5`
- `md:` Two columns, `px-8`
- `lg:` Full layout, `max-w-7xl mx-auto`

---

## 9. Tailwind Configuration

```javascript
// tailwind.config.js — key customizations
{
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#111118',
          tertiary: '#1a1a24',
          elevated: '#22222e',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          subtle: 'rgba(139, 92, 246, 0.10)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
}
```

---

## 10. Accessibility Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| Focus ring | `ring-2 ring-accent ring-offset-2 ring-offset-bg-primary` | Visible focus states |
| Focus visible only | `focus-visible:` prefix | Only on keyboard navigation |
| Min touch target | `44px × 44px` | Mobile tap targets |
| Contrast ratio (text) | ≥ 4.5:1 | WCAG AA compliance |
| Contrast ratio (large text) | ≥ 3:1 | WCAG AA compliance |
