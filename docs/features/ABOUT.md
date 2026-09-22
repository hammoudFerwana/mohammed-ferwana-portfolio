# About Page

> Story-driven About page with engineering philosophy, timeline, and tech stack.

---

## Purpose

Tell Mohammed's engineering story — not a generic biography, but the journey from Software Engineering student to Backend Engineer who builds real systems and leads teams.

---

## Sections

### 1. Story Section

**Heading:** About Me
**Eyebrow:** THE ENGINEER

The narrative should follow this arc:
```
Software Engineering → Discovery of Backend → Building Real Systems → Leadership Through Engineering → Where I'm Headed
```

> [!IMPORTANT]
> The About page content needs Mohammed's actual story. Use placeholder content marked with `[PLACEHOLDER]` until provided. The structure and layout should be complete.

**Content direction:**
- Where Mohammed is coming from (university, engineering foundation)
- Why backend specifically (what drew him to server-side systems)
- What kind of systems he likes building (scalable, reliable, well-architected)
- How his engineering mindset developed (through real projects, not theory)
- How leadership became part of his engineering journey (TeamLine, PCD)
- What he is currently working toward

**Writing rules:**
- No generic phrases ("I'm passionate about technology")
- Concise, confident, human
- Every sentence communicates something useful

---

### 2. Engineering Philosophy

**Heading:** Engineering Philosophy
**Eyebrow:** HOW I WORK

Principles presented as a structured list:

| Principle | Description |
|-----------|-------------|
| Understand before implementing | Start with the problem, not the solution |
| Prefer simple solutions before complex ones | Complexity is a cost, not a feature |
| Design for maintainability | Code is read more than it is written |
| Validate assumptions | Test your understanding, not just your code |
| Test behavior, not just happy paths | Edge cases reveal system quality |
| Improve systems based on evidence | Optimize what you can measure |
| Take ownership of engineering decisions | Explain why, not just what |

**Layout:** Each principle as a card or row with the principle as heading and description below.

---

### 3. Engineering Timeline

**Heading:** Journey
**Eyebrow:** TIMELINE

```
2022 ──── Started Software Engineering at Al-Azhar University
  │
  ├──── Discovered backend development
  │
  ├──── First backend projects
  │
  ├──── Real-world projects (InsurFlow, TeamLine, SAIOS)
  │
  ├──── Engineering leadership (TeamLine, PCD)
  │
  ├──── Production-oriented systems
  │
2027 ──── Expected graduation
```

> [!WARNING]
> Only include verified milestones. Do NOT fabricate specific dates, events, or achievements that haven't been confirmed by Mohammed.

**Visual:** Vertical timeline with nodes, connecting lines, and brief descriptions. Dark surface with accent highlights for key nodes.

**Mobile:** Timeline remains vertical, full-width, with reduced padding.

---

### 4. Tech Stack

**Heading:** Tech Stack
**Eyebrow:** TOOLS I USE

Organized by category (NOT a random logo wall):

```
┌──────────────────────────────────────────────┐
│  BACKEND                                     │
│  Node.js  Express.js  MongoDB  PostgreSQL    │
│  Mongoose  Sequelize                         │
├──────────────────────────────────────────────┤
│  ARCHITECTURE & SECURITY                     │
│  REST APIs  MVC  Modular Architecture        │
│  JWT  RBAC  Validation                       │
├──────────────────────────────────────────────┤
│  TESTING                                     │
│  Jest  Supertest  Integration Testing        │
├──────────────────────────────────────────────┤
│  DEVOPS                                      │
│  Docker  CI/CD  GitHub Actions               │
├──────────────────────────────────────────────┤
│  TOOLS                                       │
│  Git  GitHub  Postman                        │
└──────────────────────────────────────────────┘
```

**Presentation:**
- Grouped by category with clear headings
- NO skill percentage bars
- NO fake proficiency ratings
- Technologies shown as text items or subtle cards
- Optional: small icons next to technology names

---

## Interactions

| Element | Behavior |
|---------|----------|
| Story text | Scroll reveal (paragraph by paragraph) |
| Philosophy cards | Stagger reveal on scroll |
| Timeline nodes | Highlight on scroll into view |
| Tech categories | Stagger reveal, subtle hover on items |

---

## Technical Requirements

- Story content from `src/data/` or inline (simple enough)
- Philosophy principles from data file
- Timeline milestones from data file
- Tech stack from `src/data/techStack.js`
- All sections are Server Components (no interactivity needed)
- Timeline may need client component for scroll-based highlighting
- Responsive: single column on mobile, generous spacing
