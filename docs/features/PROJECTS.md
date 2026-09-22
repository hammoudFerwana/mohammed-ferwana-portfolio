# Projects & Case Studies

> Project data architecture, card design, and 9-part case study template.

---

## Purpose

- Showcase Mohammed's engineering work with depth, not just screenshots
- Differentiate between featured (Tier 1) and supporting (Tier 2) projects
- Provide a reusable case study template that works for any project

---

## 1. Projects Listing Page (`/projects`)

### Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  PROJECTS                                           │
│  Engineering work that solves real problems.         │
│                                                     │
│  ┌───────────────────────────────────────────┐      │
│  │  FEATURED                                 │      │
│  │  ┌─────────────────┐  ┌──────────────┐   │      │
│  │  │  InsurFlow       │  │ TeamLine     │   │      │
│  │  │  [large card]    │  │ [large card] │   │      │
│  │  └─────────────────┘  └──────────────┘   │      │
│  │  ┌──────────────────────────────────┐    │      │
│  │  │  SAIOS Academy [wide card]       │    │      │
│  │  └──────────────────────────────────┘    │      │
│  └───────────────────────────────────────────┘      │
│                                                     │
│  OTHER PROJECTS                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  PCD/PCED  [compact card]                │       │
│  └──────────────────────────────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Featured Project Card (Tier 1)

```
┌──────────────────────────────────────────┐
│  [Project Screenshot / Hero Image]       │
│                                          │
│  InsurFlow                               │
│  Enterprise B2B motor insurance claims   │
│  platform.                               │
│                                          │
│  Role: Backend Engineer / Backend Owner  │
│                                          │
│  Node.js  Express  MongoDB  JWT  RBAC   │
│                                          │
│  [View Case Study →]                     │
└──────────────────────────────────────────┘
```

### Supporting Project Card (Tier 2)

```
┌──────────────────────────────────────────┐
│  PCD/PCED                                │
│  Volunteer project — Backend + Leadership│
│                                          │
│  Node.js  Express  MongoDB              │
│  [GitHub] [Live]                         │
└──────────────────────────────────────────┘
```

---

## 2. Case Study Page (`/projects/[slug]`)

### 9-Part Structure

Every case study page follows this template. **Sections are rendered only when data is available.**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ← Back to Projects                                │
│                                                     │
│  InsurFlow                                          │
│  Enterprise B2B motor insurance claims platform     │
│                                                     │
│  Role: Backend Engineer / Backend Owner             │
│  Category: Enterprise                               │
│  Tech: Node.js, Express, MongoDB, JWT, RBAC        │
│                                                     │
│  [GitHub] [Dashboard] [Live]                        │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  01 — THE PROBLEM                                   │
│  [What problem was the project solving?]            │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  02 — MY ROLE                                       │
│  [What did Mohammed personally own?]                │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  03 — THE SYSTEM                                    │
│  [How the system works — high level]                │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  04 — ARCHITECTURE                                  │
│  [Interactive Architecture Viewer]                  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  05 — ENGINEERING DECISIONS                         │
│  [Decision cards with reasoning]                    │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  06 — TRADE-OFFS                                    │
│  [When verified information is available]           │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  07 — TESTING & RELIABILITY                         │
│  [Real testing practices, never fabricated]         │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  08 — WHAT I WOULD IMPROVE                          │
│  [Thoughtful future improvements]                   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  09 — LINKS                                         │
│  [GitHub / Live / Dashboard links]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 3. Project Data (Current)

### InsurFlow (Tier 1)

| Field | Value |
|-------|-------|
| Title | InsurFlow |
| Description | Enterprise B2B motor insurance claims platform |
| Role | Backend Engineer / Backend Owner |
| Category | Enterprise |
| GitHub | https://github.com/InsurFlow-Team/insurflow-backend |
| Dashboard | https://insurflow-dashboard.vercel.app |
| Technologies | To be verified from repo |

> [!NOTE]
> Case study content (problem, architecture, decisions, trade-offs) will be populated when Mohammed provides detailed information or when the GitHub repository is inspected.

### TeamLine (Tier 1)

| Field | Value |
|-------|-------|
| Title | TeamLine |
| Description | Project management / collaboration platform |
| Role | Backend Developer + Team Leader |
| Category | Platform |
| Live | https://team-line-frontend-eight.vercel.app/ |
| Leadership | ✅ |

### SAIOS Academy (Tier 1)

| Field | Value |
|-------|-------|
| Title | SAIOS Academy |
| Description | Learning Management System backend |
| Role | Backend Engineer |
| Category | Education |
| GitHub | https://github.com/hammoudFerwana/saios-academy |

### PCD/PCED (Tier 2)

| Field | Value |
|-------|-------|
| Title | PCD/PCED |
| Description | Volunteer project |
| Role | Backend Developer + Team Leader |
| Category | Volunteer |
| GitHub | https://github.com/PCD-Org/backEnd |
| Live | https://pced.vercel.app/ |
| Leadership | ✅ |

---

## 4. Interactions

| Element | Behavior |
|---------|----------|
| Project card | Hover: subtle elevation + border highlight |
| Project card click | Navigate to case study page |
| Tech tags | Static pills, no interaction |
| Architecture viewer | Click nodes for details (see ARCHITECTURE_VIEWER.md) |
| Decision cards | Expand/collapse on click |
| Back to Projects | Navigate back with transition |
| External links | Open in new tab with `rel="noopener noreferrer"` |

---

## 5. Technical Requirements

- Project data imported from `src/data/projects.js`
- Dynamic routes use `generateStaticParams()` for SSG
- Case study sections render conditionally based on available data
- Images use `next/image` with proper sizing
- Mobile: single column, full-width cards
- All external links verified and working
