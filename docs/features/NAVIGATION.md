# Navigation

> Primary navigation, mobile menu, and routing behavior.

---

## Primary Navigation

| Label | Route | Position |
|-------|-------|----------|
| Home | `/` | Main nav |
| Projects | `/projects` | Main nav |
| About | `/about` | Main nav |
| Experience | `/experience` | Main nav |
| Contact | `/contact` | Main nav |

Engineering Lab may be included as a secondary nav item or accessed via Command Palette.

---

## Desktop Navbar

```
┌─────────────────────────────────────────────────────────────┐
│  MF   Home  Projects  About  Experience  Contact   [Ctrl+K]│
└─────────────────────────────────────────────────────────────┘
```

- **Logo/Initials:** "MF" or "Mohammed Ferwana" — links to home
- **Nav links:** Text links with active state indicator
- **Right side:** Command palette trigger (search icon or Ctrl+K hint)
- **Position:** Fixed/sticky top
- **Background:** Transparent on top, gains `bg + backdrop-blur` on scroll
- **Width:** Contained within `max-w-7xl`

---

## Active Route Indicator

- Active link: `text-primary` + subtle bottom accent border or dot
- Inactive links: `text-secondary` on hover: `text-primary`
- Transition between states: smooth color transition

---

## Mobile Navigation

### Hamburger Menu

```
┌──────────────────────────┐
│  MF                ☰     │
└──────────────────────────┘
```

### Expanded Mobile Menu

```
┌──────────────────────────┐
│  MF                ✕     │
│                          │
│  Home                    │
│  Projects                │
│  About                   │
│  Experience              │
│  Contact                 │
│                          │
│  Engineering Lab         │
│                          │
│  ─────────────────────── │
│  GitHub  LinkedIn  Email │
│                          │
└──────────────────────────┘
```

- Full-screen overlay with `backdrop-blur`
- Links stagger-reveal on open
- Hamburger icon morphs to X
- Close on: X click, link click, Escape key
- Body scroll locked when open

---

## Scroll Behavior

| Scroll Position | Navbar State |
|----------------|-------------|
| Top of page (0-50px) | Transparent background |
| Scrolled (>50px) | `bg-bg-primary/80 backdrop-blur-lg border-b border-border-subtle` |

Transition between states: `300ms ease-out-expo`

---

## Transitions

- Route changes: subtle fade transition between pages
- No full-page reload (client-side navigation via Next.js)
- Scroll position: reset to top on route change

---

## Technical Requirements

- Client Component (`'use client'`) for scroll detection and mobile toggle
- `usePathname()` from `next/navigation` for active route
- `useScroll()` from Framer Motion for scroll-based background
- Mobile menu: conditional render or CSS transform-based reveal
- Z-index: navbar at `z-40`, mobile menu at `z-50`
- Fixed position with safe area insets for mobile

---

## Accessibility

- `<nav>` element with `aria-label="Main navigation"`
- Mobile menu button: `aria-expanded`, `aria-controls`
- Skip-to-content link (visually hidden, visible on focus)
- All links have visible focus states
- Keyboard: Tab through links, Enter to navigate
- Mobile menu: focus trap when open
- Escape closes mobile menu
