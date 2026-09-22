# Accessibility

> WCAG compliance, keyboard navigation, and inclusive design.

---

## Standards

Target: **WCAG 2.1 Level AA**

---

## Semantic HTML

| Element | Usage |
|---------|-------|
| `<header>` | Site header with navbar |
| `<nav>` | Primary navigation, footer navigation |
| `<main>` | Page content (one per page) |
| `<section>` | Distinct content sections |
| `<article>` | Project case studies |
| `<footer>` | Site footer |
| `<h1>` | One per page, primary topic |
| `<h2>`–`<h6>` | Logical hierarchy, no skipping |

---

## Heading Hierarchy Example

```
Home Page:
  h1: Mohammed Ferwana
  h2: What I Build (Engineering Identity)
  h2: How I Think About Systems
  h2: Featured Projects
  h2: Currently Exploring

Case Study Page:
  h1: InsurFlow
  h2: The Problem
  h2: My Role
  h2: The System
  h2: Architecture
  h2: Engineering Decisions
  h2: Trade-offs
  h2: Testing & Reliability
  h2: What I Would Improve
  h2: Links
```

---

## Keyboard Navigation

### Tab Order

All interactive elements must be reachable via Tab key in logical order:

```
Skip-to-content link → Nav links → Page content interactive elements → Footer links
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next interactive element |
| `Shift+Tab` | Move to previous interactive element |
| `Enter` / `Space` | Activate buttons and links |
| `Escape` | Close modals, menus, palettes |
| `Ctrl+K` | Open command palette |
| `↑` / `↓` | Navigate command palette / terminal |

### Skip-to-Content Link

```html
<!-- First element in body, visually hidden until focused -->
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute ...">
  Skip to content
</a>
```

---

## Focus States

All interactive elements must have visible focus indicators:

```css
/* Focus visible (keyboard only) */
.focus-ring {
  @apply focus-visible:outline-none
         focus-visible:ring-2
         focus-visible:ring-purple-500
         focus-visible:ring-offset-2
         focus-visible:ring-offset-[#0a0a0f];
}
```

- Focus ring color: accent (purple)
- Ring offset: matches page background
- Never remove focus outlines without replacement
- `focus-visible` preferred over `focus` (don't show ring on mouse click)

---

## Color Contrast

| Text Type | Minimum Ratio | Current Colors |
|-----------|--------------|----------------|
| Body text on dark bg | 4.5:1 | `#f5f5f7` on `#0a0a0f` = ~19:1 ✅ |
| Secondary text | 4.5:1 | `#a1a1aa` on `#0a0a0f` = ~8:1 ✅ |
| Muted text (decorative) | 3:1 | `#71717a` on `#0a0a0f` = ~4.5:1 ✅ |
| Accent on dark bg | 3:1 (large text) | `#8b5cf6` on `#0a0a0f` = ~4.3:1 ✅ |

---

## Images

- All content images: descriptive `alt` text
- Decorative images: `alt=""` or `aria-hidden="true"`
- Portrait photo: `alt="Mohammed Ferwana, Backend Engineer"`
- Project screenshots: `alt="InsurFlow dashboard showing claims overview"`

---

## Forms

- Every input has an associated `<label>`
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required="true"`
- Form errors announced via `aria-live="polite"`
- Submit button has descriptive text

---

## Motion / Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Additionally, Framer Motion's `useReducedMotion()` hook is used in every animated component.

---

## ARIA Patterns

| Component | ARIA Pattern |
|-----------|-------------|
| Mobile menu | `aria-expanded`, `aria-controls` |
| Command palette | `role="dialog"`, `aria-modal="true"` |
| Search input | `role="combobox"`, `aria-autocomplete` |
| Command list | `role="listbox"`, `aria-activedescendant` |
| Architecture nodes | `role="button"`, `aria-pressed` |
| Detail panel | `aria-live="polite"` |
| External links | Visual indicator + `aria-label` with "(opens in new tab)" |
| Loading states | `aria-busy="true"` |

---

## Testing Checklist

- [ ] All pages navigable by keyboard only
- [ ] Skip-to-content link works
- [ ] Focus visible on all interactive elements
- [ ] No content trapped (Escape closes all overlays)
- [ ] Heading hierarchy is logical
- [ ] All images have appropriate alt text
- [ ] Form errors are announced to screen readers
- [ ] Color contrast meets WCAG AA
- [ ] Reduced motion is respected
- [ ] Touch targets ≥ 44px on mobile
