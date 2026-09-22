# Engineering Lab

> Lightweight section showing active learning and experimentation.

---

## Purpose

Show that Mohammed actively experiments and learns — the portfolio feels alive, not frozen in time. This is NOT a blog. It's a concise window into ongoing engineering exploration.

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ENGINEERING LAB                                    │
│  Where I experiment with engineering ideas.          │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Design Patterns                          │  │
│  │  Exploring REST best practices, resource      │  │
│  │  naming, and versioning strategies.            │  │
│  │                                               │  │
│  │  #rest-api  #architecture                     │  │
│  │  Status: Exploring                            │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Docker & Containerization                    │  │
│  │  Learning container patterns for backend      │  │
│  │  services and development workflows.           │  │
│  │                                               │  │
│  │  #docker  #devops                             │  │
│  │  Status: Exploring                            │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  CURRENTLY EXPLORING                                │
│  Backend architecture · System design ·             │
│  Database performance · Testing · Docker · CI/CD    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Content

### Lab Topics

> [!NOTE]
> Actual lab topics need to be provided by Mohammed. The structure supports any topics. The following are based on the prompt's suggestions.

**Possible topics (pending confirmation):**

| Topic | Description | Tags |
|-------|-------------|------|
| API Design Patterns | REST best practices, resource naming, versioning | `rest-api`, `architecture` |
| Authentication Patterns | JWT strategies, refresh tokens, session management | `security`, `auth` |
| Database Optimization | Query optimization, indexing strategies | `database`, `performance` |
| Testing Strategies | Integration testing patterns, test architecture | `testing`, `quality` |
| Docker & Containerization | Container patterns for backend services | `docker`, `devops` |
| CI/CD Pipelines | GitHub Actions workflows, deployment automation | `ci-cd`, `devops` |

### Currently Exploring Section

Small, lightweight section showing what Mohammed is learning RIGHT NOW.

**Language rule:** Use "Currently exploring..." — do NOT imply mastery.

```
Currently exploring...
Backend architecture · System design · Database performance · Testing · Docker · CI/CD
```

---

## Extensibility

The Lab is designed to grow over time:
- Topics are data-driven (from `src/data/labTopics.js`)
- Adding a new topic = adding an object to the array
- No new components needed for new topics
- Future: could link to blog posts if Mohammed starts writing

---

## Technical Requirements

- Data from `src/data/labTopics.js`
- Server Component (no interactivity)
- Scroll reveal animations
- Responsive: single column on mobile
- Status badges: "Exploring" / "Practiced" / "Applied"
- Tags rendered as small accent pills
