# Architecture Viewer

> Interactive system architecture visualization for project case studies.

---

## Purpose

Show how Mohammed's systems are structured — not just what technologies were used, but how components connect, communicate, and handle responsibilities.

This is a **key differentiator** for the portfolio.

---

## Visual Design

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  ARCHITECTURE                                           │
│  System architecture for InsurFlow                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │        ┌──────────┐                             │   │
│  │        │  Client   │                             │   │
│  │        └────┬─────┘                             │   │
│  │             │                                    │   │
│  │        ┌────▼─────┐                             │   │
│  │        │   API     │                             │   │
│  │        │  Gateway  │                             │   │
│  │        └────┬─────┘                             │   │
│  │             │                                    │   │
│  │     ┌───────┼───────┐                           │   │
│  │     │       │       │                            │   │
│  │  ┌──▼──┐ ┌─▼──┐ ┌──▼──┐                       │   │
│  │  │Auth │ │Biz │ │Valid│                          │   │
│  │  └──┬──┘ └─┬──┘ └──┬──┘                        │   │
│  │     │      │       │                             │   │
│  │     └──────┼───────┘                            │   │
│  │            │                                     │   │
│  │       ┌────▼─────┐                              │   │
│  │       │   Data    │                              │   │
│  │       │  Access   │                              │   │
│  │       └────┬─────┘                              │   │
│  │            │                                     │   │
│  │       ┌────▼─────┐                              │   │
│  │       │ Database  │                              │   │
│  │       └──────────┘                              │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Click any component to learn more.                     │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │ [Selected Component Detail Panel]             │      │
│  │                                               │      │
│  │ Authentication                                │      │
│  │ JWT-based authentication with refresh token   │      │
│  │ rotation. Role-based access control (RBAC)    │      │
│  │ for organization-level permissions.            │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Component Behavior

### Node Types

| Type | Visual Style | Examples |
|------|-------------|----------|
| `client` | Outlined, top position | Client, Frontend |
| `api` | Filled accent-subtle | API Gateway, REST API |
| `auth` | Filled with lock icon | Authentication, Authorization |
| `logic` | Filled secondary | Business Logic, Services |
| `data` | Filled secondary | Data Access, Repositories |
| `db` | Filled with cylinder icon | MongoDB, PostgreSQL |
| `external` | Dashed outline | External APIs, Payment |

### Interactions

| Action | Behavior |
|--------|----------|
| **Click node** | Highlight node + show detail panel below |
| **Hover node** | Subtle border glow + scale(1.02) |
| **Click connection line** | Highlight the connected nodes |
| **Click outside** | Deselect all |
| **Mobile tap** | Same as click |

### Detail Panel

When a node is clicked, a panel appears below the diagram showing:
- **Component name** (bold)
- **Description** (1-3 sentences about what this component handles)
- **Responsibilities** (bullet list of specific responsibilities)

---

## Data Structure

Architecture data is part of the project data schema:

```javascript
architecture: {
  nodes: [
    { id: 'client', label: 'Client', description: '...', type: 'client' },
    { id: 'api', label: 'API Gateway', description: '...', type: 'api' },
    { id: 'auth', label: 'Authentication', description: '...', type: 'auth' },
    { id: 'logic', label: 'Business Logic', description: '...', type: 'logic' },
    { id: 'data', label: 'Data Access', description: '...', type: 'data' },
    { id: 'db', label: 'Database', description: '...', type: 'db' },
  ],
  connections: [
    { from: 'client', to: 'api', label: 'HTTP' },
    { from: 'api', to: 'auth', label: null },
    { from: 'api', to: 'logic', label: null },
    { from: 'logic', to: 'data', label: null },
    { from: 'data', to: 'db', label: 'Queries' },
  ],
}
```

---

## Technical Implementation

### Rendering Approach

**CSS + SVG** (no heavy library like D3/Three.js):

1. Nodes are positioned using CSS Grid or absolute positioning within a container
2. Connections drawn using SVG `<line>` or `<path>` elements
3. Interaction state managed with React `useState`
4. Animations via Framer Motion (node highlight, panel reveal)

### Why NOT a Library?

- D3.js is overkill for 6-10 nodes
- No need for drag, zoom, or dynamic layout
- Custom CSS gives full design control
- Smaller bundle size
- Better accessibility

### Responsive Strategy

| Viewport | Behavior |
|----------|----------|
| Desktop (≥1024px) | Full diagram with side detail panel |
| Tablet (768-1023px) | Full diagram with bottom detail panel |
| Mobile (<768px) | Vertical stacked list of components (simplified view) |

On mobile, the architecture diagram becomes a vertical list of components, each clickable to expand details. This ensures usability without tiny interactive elements.

---

## Accessibility

- Nodes are `<button>` elements with `aria-label`
- Active node uses `aria-pressed="true"`
- Detail panel uses `aria-live="polite"` for screen reader announcements
- Keyboard: Tab through nodes, Enter/Space to select
- Connections are `aria-hidden` (decorative)
- Reduced motion: no highlight animations, instant state changes

---

## Performance

- Render only when visible (IntersectionObserver)
- SVG connections are lightweight
- No continuous animations
- Lazy load the component on scroll
