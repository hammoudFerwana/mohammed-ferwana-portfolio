# Hero Section

> The most important visual area of the entire portfolio. First impression in 5 seconds.

---

## Purpose

Communicate instantly:
- **Who**: Mohammed Ferwana
- **What**: Backend Engineer
- **Value**: Reliable Multi-Tenant Backend Systems
- **Action**: Explore My Work / Download Resume

---

## Layout

### Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [tech metadata bar — subtle, monospace]                    │
│  NODE.JS · EXPRESS · MONGODB · REST APIS · ARCHITECTURE     │
│                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────┐    │
│  │                              │  │                  │    │
│  │  MOHAMMED                    │  │  [Interactive    │    │
│  │  FERWANA                     │  │   Portrait Card] │    │
│  │                              │  │                  │    │
│  │  Backend Engineer            │  │                  │    │
│  │                              │  └──────────────────┘    │
│  │  I build multi-tenant REST   │                          │
│  │  APIs with guarded state     │  ┌──────────────────┐    │
│  │  machines, tenant isolation  │  │ SYSTEM STATUS    │    │
│  │  and tested business rules.  │  │ 616 tests passing│    │
│  │                              │  │ 10-state FSM     │    │
│  │  [Explore My Work]           │  │ CI: lint, test   │    │
│  │  [Download Resume] [Talk]    │  └──────────────────┘    │
│  │                              │                          │
│  └──────────────────────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌───────────────────────────┐
│                           │
│  [tech metadata — scroll] │
│                           │
│  MOHAMMED                 │
│  FERWANA                  │
│                           │
│  Backend Engineer         │
│                           │
│  [Portrait — centered]    │
│                           │
│  I build multi-tenant...  │
│                           │
│  [Explore My Work]        │
│  [Download Resume]        │
│                           │
└───────────────────────────┘
```

---

## Content

### Primary Typography
```
MOHAMMED FERWANA
```
- Font: Geist, weight 700
- Desktop: 72px (4.5rem), tracking -0.04em
- Mobile: 40px (2.5rem)

### Title
```
Backend Engineer
```

### Tagline
```
Backend Engineer
```

### Supporting Copy
```
I build multi-tenant REST APIs with guarded state machines, tenant isolation and tested business rules.
```

> [!NOTE]
> This copy reflects the current production implementation in `src/components/home/HeroSection.jsx`.

### CTAs
| Button | Type | Action |
|--------|------|--------|
| Explore My Work | Primary (accent) | Scroll to Projects or navigate to `/projects` |
| Download Resume | Secondary (outline) | Download PDF from `/resume/` |
| Let's Talk | Ghost/Link (optional) | Navigate to `/contact` |

### Technical Metadata Bar
Subtle, monospace, small text near the hero:
```
Node.js · Express · MongoDB · REST APIs · System Architecture
```

### System Status Widget (Signature Element)
A subtle engineering-flavored visual element (NOT a terminal):
```
SYSTEM STATUS
Backend Engineering    ●
API Architecture       ●
Security              ●
Testing               ●
Scalability           ●
```
- Communicates "this belongs to an engineer" without being a fake IDE
- Dots can have a subtle pulse animation
- This is decorative — does not represent real system status

---

## Interactions

| Element | Interaction |
|---------|-------------|
| Name typography | Subtle reveal animation on page load |
| Portrait | Subtle scale on load, no hover effects |
| CTA buttons | Scale(0.98) on press, hover elevation |
| Tech metadata | Subtle fade-in with stagger |
| System status dots | Gentle pulse animation (respects reduced-motion) |
| Entire section | Fade-up entrance on initial load |

---

## Technical Requirements

- Hero must be visible **above the fold** on all devices
- Portrait image must use `next/image` with `priority` for LCP
- No layout shift (CLS) — fixed dimensions for portrait container
- Reduced-motion: instant appearance, no animations
- Semantic: `<section>` with appropriate ARIA
- The hero should use `min-h-[100dvh]` NOT `h-screen`

---

## Accessibility

- Portrait: descriptive `alt` text
- CTAs: clear button labels
- Tech metadata: `aria-hidden` if purely decorative
- System status: `aria-hidden` (decorative element)
- Heading hierarchy: H1 for name, visual styling only for title/tagline
