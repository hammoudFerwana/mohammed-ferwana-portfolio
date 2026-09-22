# Architecture

> Component architecture, data flow, routing, and technical decisions for Mohammed Ferwana's engineering portfolio.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS APP ROUTER                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Root Layout                         │   │
│  │  ┌─────────┐  ┌──────────────────────┐  ┌────────┐  │   │
│  │  │ Navbar  │  │    Page Content       │  │ Footer │  │   │
│  │  │         │  │                       │  │        │  │   │
│  │  │ • Logo  │  │  Server Components    │  │ Links  │  │   │
│  │  │ • Nav   │  │  ↓                    │  │ Nav    │  │   │
│  │  │ • CTA   │  │  Client Components    │  │ Brand  │  │   │
│  │  └─────────┘  │  (interactions only)  │  └────────┘  │   │
│  │               └──────────────────────┘               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────┐     │
│  │ Command Palette  │  │ Mini Terminal (Easter Egg)   │     │
│  │ (Global Overlay) │  │ (Global Overlay)             │     │
│  └──────────────────┘  └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Rendering Strategy

| Route | Rendering | Reason |
|-------|-----------|--------|
| `/` | **SSG** (Static Site Generation) | Content is static, best performance |
| `/projects` | **SSG** | Project data is pre-defined |
| `/projects/[slug]` | **SSG** with `generateStaticParams` | Case studies are pre-defined |
| `/about` | **SSG** | Static content |
| `/experience` | **SSG** | Static content |
| `/contact` | **SSG** + Client Components | Form needs interactivity |
| `/lab` | **SSG** | Static content |
| `not-found` | **SSG** | Error page |

**Principle:** Everything is statically generated at build time. Client Components are used ONLY for interactivity (form submissions, animations, command palette, terminal).

---

## 3. Component Architecture

### Server vs Client Boundary

```
Server Components (default)          Client Components ('use client')
─────────────────────────           ────────────────────────────────
• Page layouts                      • Navbar (scroll state, mobile menu)
• Section containers                • ContactForm (form state, validation)
• Static content rendering          • CommandPalette (keyboard events, search)
• SEO metadata                      • MiniTerminal (input handling)
• Data imports                      • RevealOnScroll (IntersectionObserver)
                                    • ArchitectureViewer (click interactions)
                                    • MobileMenu (toggle state)
                                    • AnimatedButton (hover physics)
```

### Component Hierarchy

```
RootLayout
├── Navbar (client)
│   ├── Logo
│   ├── NavLinks
│   ├── MobileMenuToggle
│   └── MobileMenu (client)
│
├── [Page Content]
│   │
│   ├── HomePage
│   │   ├── HeroSection
│   │   │   ├── HeroTypography
│   │   │   ├── HeroCTA
│   │   │   └── TechMetadata
│   │   ├── EngineeringIdentity
│   │   │   └── IdentityCard (×3)
│   │   ├── HowIThink (client — interactive flow)
│   │   │   └── ThinkingStep (×6)
│   │   ├── FeaturedProjects
│   │   │   └── ProjectCard (×3)
│   │   ├── CurrentlyExploring
│   │   │   └── ExplorationTag
│   │   └── CTASection
│   │
│   ├── ProjectsPage
│   │   ├── ProjectGrid
│   │   │   └── ProjectCard
│   │   └── [slug] → CaseStudyPage
│   │       ├── CaseStudyHero
│   │       ├── ProblemSection
│   │       ├── RoleSection
│   │       ├── SystemOverview
│   │       ├── ArchitectureViewer (client — interactive)
│   │       ├── EngineeringDecisions
│   │       │   └── DecisionCard
│   │       ├── TradeOffs
│   │       ├── TestingReliability
│   │       ├── WhatIWouldImprove
│   │       └── ProjectLinks
│   │
│   ├── AboutPage
│   │   ├── StorySection
│   │   ├── Philosophy
│   │   │   └── PrincipleCard
│   │   ├── Timeline (client — scroll interaction)
│   │   │   └── TimelineNode
│   │   └── TechStack
│   │       └── TechCategory
│   │           └── TechItem
│   │
│   ├── ExperiencePage
│   │   ├── ExperienceSection
│   │   │   └── ExperienceCard
│   │   └── EducationSection
│   │       └── EducationCard
│   │
│   ├── ContactPage
│   │   ├── ContactForm (client)
│   │   └── SocialLinks
│   │
│   ├── LabPage
│   │   └── LabTopic
│   │
│   └── NotFoundPage (404)
│
├── Footer
│   ├── FooterBrand
│   ├── FooterNav
│   └── FooterSocial
│
├── CommandPalette (client — global overlay)
│   ├── SearchInput
│   └── CommandList
│       └── CommandItem
│
└── MiniTerminal (client — global overlay)
    ├── TerminalInput
    └── TerminalOutput
```

---

## 4. Data Flow

### Content Data Flow

```
src/data/*.js (centralized content)
      │
      ▼
Server Components (import directly)
      │
      ▼
Props → Client Components (for interactive pieces only)
```

### No External Data Fetching

All content is pre-defined in `src/data/` files. There are no API calls, no CMS, no database queries. This keeps the site:
- Blazing fast (all static)
- Zero runtime dependencies
- Easy to update (edit JS files, rebuild)

### Form Submission Flow

```
ContactForm (client component)
      │
      ▼
Client-side validation
      │
      ▼
Formspree/EmailJS API call
      │
      ▼
Success/Error state update
```

---

## 5. Routing Architecture

```
app/
├── layout.js              → Root layout (wraps all pages)
├── page.js                → /
├── not-found.js           → /[any-invalid-route]
├── projects/
│   ├── page.js            → /projects
│   └── [slug]/
│       └── page.js        → /projects/insurflow
│                            /projects/teamline
│                            /projects/saios-academy
│                            /projects/pcd-pced
├── about/
│   └── page.js            → /about
├── experience/
│   └── page.js            → /experience
├── contact/
│   └── page.js            → /contact
└── lab/
    └── page.js            → /lab
```

### Dynamic Routes

`/projects/[slug]` uses `generateStaticParams()` to pre-render all case study pages at build time:

```javascript
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
```

---

## 6. State Management

### Principle: Minimal State

| State | Location | Reason |
|-------|----------|--------|
| Mobile menu open/close | `useState` in Navbar | Local UI state |
| Command palette open/close | `useState` in CommandPalette | Local UI state |
| Terminal open/close | `useState` in MiniTerminal | Local UI state |
| Contact form fields | `useState` in ContactForm | Form state |
| Form submission status | `useState` in ContactForm | Loading/success/error |
| Active route | Next.js `usePathname()` | Built-in |
| Scroll position | `useScroll()` from Framer Motion | For navbar bg |
| Reduced motion | `useReducedMotion()` from Framer Motion | Accessibility |

**No global state library needed.** All state is local to the component that needs it.

---

## 7. Animation Architecture

### Animation Layers

```
Layer 1 — Page Transitions
  └── Framer Motion AnimatePresence on route change

Layer 2 — Scroll Reveals
  └── RevealOnScroll wrapper using IntersectionObserver
      └── Fade-up with blur (translate-y + opacity + filter)

Layer 3 — Hover & Interaction
  └── CSS transitions for simple hovers
  └── Framer Motion for complex interactions (architecture viewer)

Layer 4 — Micro-interactions
  └── Button press feedback (scale)
  └── Link hover indicators
  └── Card hover elevation
```

### Reduced Motion Strategy

```javascript
// All animated components check this
const prefersReducedMotion = useReducedMotion();

// If true: instant transitions, no scroll reveals, no parallax
// Essential functionality preserved
```

---

## 8. Key Architecture Decisions

### ADR-001: Next.js App Router over Pages Router
- **Context:** Need SSG + SEO + modern React features
- **Decision:** App Router with Server Components as default
- **Trade-off:** Newer API, but better performance and DX

### ADR-002: Centralized Data over CMS
- **Context:** Small, controlled content set (7 projects, limited experience)
- **Decision:** JavaScript data files in `src/data/`
- **Trade-off:** Need to rebuild on content change, but zero runtime dependency

### ADR-003: Tailwind CSS v3 for Styling
- **Context:** Need rapid development with consistent design
- **Decision:** Tailwind v3 with custom design tokens
- **Trade-off:** Utility classes in JSX, but faster iteration

### ADR-004: Formspree for Contact Form
- **Context:** Need real form submissions without a custom backend
- **Decision:** Formspree (free tier, easy setup)
- **Trade-off:** Third-party dependency, but eliminates need for backend

### ADR-005: Client Components only for Interactivity
- **Context:** Minimize JavaScript shipped to the browser
- **Decision:** Server Components by default; `'use client'` only when needed
- **Trade-off:** Some components need prop drilling, but smaller bundle

---

## 9. Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** | < 2.0s | SSG, optimized images, font preloading |
| **INP** | < 100ms | Minimal client JS, efficient event handlers |
| **CLS** | < 0.05 | Fixed dimensions for images, font display swap |
| **Bundle Size** | < 150KB (first load JS) | Code splitting, tree shaking |
| **Lighthouse Performance** | ≥ 90 | All of the above |

---

## 10. Security Considerations

- No sensitive data in client-side code
- Contact form CSRF handled by Formspree
- External links use `rel="noopener noreferrer"`
- No user-generated content (no XSS surface)
- Environment variables for API keys (NEXT_PUBLIC_ prefix only for client-safe values)
