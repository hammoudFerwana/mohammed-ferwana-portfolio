# Responsive Design

> Intentional layouts for all viewport sizes.

---

## Philosophy

Do NOT simply shrink desktop components. Each viewport size gets intentional design attention.

---

## Breakpoints

| Name | Width | Target Device |
|------|-------|--------------|
| Base | < 640px | Phones (portrait) |
| `sm` | ≥ 640px | Phones (landscape) |
| `md` | ≥ 768px | Tablets |
| `lg` | ≥ 1024px | Laptops |
| `xl` | ≥ 1280px | Desktop |
| `2xl` | ≥ 1536px | Large desktop |

---

## Container Strategy

```css
/* Page container */
.container {
  max-width: 1280px;  /* max-w-7xl */
  margin: 0 auto;
  padding: 0 20px;    /* px-5 on mobile */
}

@media (min-width: 768px) {
  .container {
    padding: 0 32px;   /* px-8 on tablet+ */
  }
}
```

---

## Component Responsive Behavior

### Hero Section

| Viewport | Layout |
|----------|--------|
| Mobile | Single column, name + title + description stacked, portrait below, CTAs full-width |
| Tablet | Two columns start to emerge, portrait may sit beside text |
| Desktop | Full split layout: text left, portrait + system status right |

**Key:** Hero typography scales significantly. `40px` mobile → `72px` desktop.

### Navigation

| Viewport | Layout |
|----------|--------|
| Mobile | Logo + hamburger, full-screen menu overlay |
| Desktop | Logo + horizontal nav links + command palette trigger |

### Project Cards

| Viewport | Layout |
|----------|--------|
| Mobile | Single column, full-width cards |
| Tablet | Two column grid |
| Desktop | Featured: 2-col for first two + 1-col wide for third; Supporting: compact rows |

### Architecture Viewer

| Viewport | Layout |
|----------|--------|
| Mobile | **Simplified**: Vertical list of components, tap to expand details |
| Tablet | Full diagram with bottom detail panel |
| Desktop | Full diagram with side or bottom detail panel |

> [!IMPORTANT]
> Architecture diagrams MUST remain usable on mobile. Small interactive nodes on a phone screen are unusable. The mobile fallback is a structured list.

### Timeline

| Viewport | Layout |
|----------|--------|
| Mobile | Vertical timeline, left-aligned, reduced padding |
| Desktop | Vertical timeline, centered or left-aligned with wider spacing |

### Tech Stack

| Viewport | Layout |
|----------|--------|
| Mobile | Single column, categories stacked |
| Desktop | Multi-column grid of categories |

### Contact Form

| Viewport | Layout |
|----------|--------|
| Mobile | Single column: form → social links |
| Desktop | Two columns: form left, social links right |

### Command Palette

| Viewport | Layout |
|----------|--------|
| Mobile | Full-width modal, `90vw` width |
| Desktop | Centered modal, `560px` max-width |

### Footer

| Viewport | Layout |
|----------|--------|
| Mobile | Single column, sections stacked |
| Desktop | Three columns: brand, pages, connect |

---

## Typography Scale

| Element | Mobile | Desktop |
|---------|--------|---------|
| Display | 40px / 2.5rem | 72px / 4.5rem |
| H1 | 32px / 2rem | 56px / 3.5rem |
| H2 | 28px / 1.75rem | 40px / 2.5rem |
| H3 | 22px / 1.375rem | 28px / 1.75rem |
| Body | 15px / 0.9375rem | 16px / 1rem |
| Label | 11px / 0.6875rem | 12px / 0.75rem |

---

## Spacing Scale

| Element | Mobile | Desktop |
|---------|--------|---------|
| Section padding (vertical) | 64px–80px | 96px–128px |
| Container padding (horizontal) | 20px | 32px |
| Component gap | 32px–48px | 48px–64px |
| Card internal padding | 20px–24px | 24px–32px |

---

## Critical Rules

1. **No horizontal scrolling** — ever, on any viewport
2. **Use `min-h-[100dvh]`** — not `h-screen` (prevents iOS Safari issues)
3. **Touch targets ≥ 44px** — on mobile, all tappable elements
4. **No tiny interactive elements** — architecture nodes, buttons, links
5. **Full-width inputs** — on mobile, form inputs should be 100%
6. **Readable text** — minimum 15px body text on mobile
7. **Safe area insets** — account for notches and home indicators

---

## Testing

- [ ] Chrome DevTools device emulation
- [ ] Real device testing (if available)
- [ ] iOS Safari (viewport quirks)
- [ ] Landscape orientation
- [ ] Very small screens (320px width)
- [ ] Very large screens (2560px+)
- [ ] No horizontal overflow
- [ ] All interactive elements reachable
