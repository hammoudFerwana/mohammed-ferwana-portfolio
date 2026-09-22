# 404 Page

> Custom error page with subtle engineering personality.

---

## Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│               404                           │
│                                             │
│         Route not found.                    │
│         The system couldn't                 │
│         resolve this path.                  │
│                                             │
│         [Return Home]                       │
│                                             │
│  $ error: ROUTE_NOT_FOUND                   │
│  $ path: /unknown-route                     │
│  $ status: 404                              │
│  $ suggestion: try /projects or /about      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Content

- **Error code:** 404 (large, prominent)
- **Message:** "Route not found."
- **Subtext:** "The system couldn't resolve this path."
- **CTA:** "Return Home" button → navigates to `/`
- **Technical detail:** Subtle monospace metadata (engineering personality, not overdone joke)

---

## Rules

- Keep it professional with subtle engineering humor
- Do NOT overdo the joke
- Clear return action is the priority
- Centered layout, minimal elements
- Dark background, consistent with site design
- Responsive: works on all viewports

---

## Technical Requirements

- `not-found.js` in the app directory (Next.js convention)
- Server Component
- Includes metadata (`title: '404 — Page Not Found'`)
- Links to home using `<Link>` component
