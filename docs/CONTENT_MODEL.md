# Content Model

> Centralized data structures and schemas for all content in the portfolio. All content lives in `src/data/` and is imported by components at build time.

---

## 1. Project Data Schema

Each project in `src/data/projects.js` follows this structure:

```javascript
const project = {
  // === REQUIRED FIELDS ===
  id: 'string',                    // Unique identifier
  slug: 'string',                  // URL-friendly slug (e.g., 'insurflow')
  title: 'string',                 // Project name (e.g., 'InsurFlow')
  description: 'string',           // 1-2 sentence summary
  role: 'string',                  // Mohammed's role (e.g., 'Backend Engineer / Backend Owner')
  category: 'string',             // 'enterprise' | 'platform' | 'education' | 'volunteer'
  tier: 'number',                  // 1 = Featured case study, 2 = Supporting project
  technologies: ['string'],        // Array of technologies used

  // === LINKS (at least one required) ===
  links: {
    github: 'string | null',      // GitHub repository URL
    live: 'string | null',        // Live deployment URL
    dashboard: 'string | null',   // Dashboard/admin URL (if applicable)
  },

  // === FEATURED FLAG ===
  featured: 'boolean',            // Show on homepage

  // === OPTIONAL CASE STUDY FIELDS ===
  // These are populated when detailed information is available.
  // Components must handle these being null/undefined gracefully.

  image: 'string | null',         // Path to project screenshot/hero image

  problem: 'string | null',       // What problem was the project solving?

  solution: 'string | null',      // High-level solution approach

  system: 'string | null',        // How the system works (overview)

  architecture: {                  // For the Architecture Viewer
    nodes: [{
      id: 'string',
      label: 'string',
      description: 'string',
      type: 'string',             // 'client' | 'api' | 'auth' | 'logic' | 'data' | 'db' | 'external'
    }],
    connections: [{
      from: 'string',             // node id
      to: 'string',               // node id
      label: 'string | null',
    }],
  } | null,

  engineeringDecisions: [{
    title: 'string',              // Decision title
    description: 'string',       // Why this decision was made
    context: 'string | null',    // Additional context
  }] | null,

  tradeoffs: [{
    decision: 'string',
    reasoning: 'string',
  }] | null,

  testing: {
    approach: 'string',           // Testing strategy description
    tools: ['string'],            // Testing tools used
    details: 'string | null',     // Additional testing details
  } | null,

  results: 'string | null',       // Measurable outcomes (only if verified)

  whatIWouldImprove: [{
    area: 'string',
    description: 'string',
  }] | null,

  leadership: {
    description: 'string',
    responsibilities: ['string'],
  } | null,
};
```

### Current Projects Data

| Project | Slug | Tier | Featured | Has Case Study |
|---------|------|------|----------|---------------|
| InsurFlow | `insurflow` | 1 | ✅ | Detailed (when content provided) |
| TeamLine | `teamline` | 1 | ✅ | Detailed (when content provided) |
| SAIOS Academy | `saios-academy` | 1 | ✅ | Detailed (when content provided) |
| PCD/PCED | `pcd-pced` | 2 | ❌ | Basic |

### Adding a New Project

1. Add a new object to the `projects` array in `src/data/projects.js`
2. Fill in required fields (id, slug, title, description, role, category, tier, technologies, links)
3. Set `featured: true` if it should appear on the homepage
4. Add optional case study fields as content becomes available
5. Add project screenshot to `public/images/projects/{slug}.png`
6. Run `npm run build` to regenerate pages

---

## 2. Experience Data Schema

```javascript
const experience = {
  id: 'string',
  type: 'work' | 'training',      // Distinguish employment from programs
  title: 'string',                 // Role title
  organization: 'string',         // Company/organization name
  period: 'string',               // e.g., '2024'
  description: 'string',          // Brief description of the role
  project: 'string | null',       // Associated project name
  projectSlug: 'string | null',   // Link to project case study
  responsibilities: ['string'],   // What Mohammed did
  technologies: ['string'],       // Technologies used
  isLeadership: 'boolean',        // Involves leadership responsibilities
};
```

### Current Experience

| Experience | Type | Leadership |
|-----------|------|-----------|
| TAQAT Internship — Backend Developer + Team Leader | `work` | ✅ |
| GSG Market Ready Developer | `training` | ❌ |

> [!WARNING]
> GSG is a **training/program experience**, NOT employment. Must be presented accurately.

---

## 3. Education Data Schema

```javascript
const education = {
  id: 'string',
  institution: 'string',          // 'Al-Azhar University'
  degree: 'string',               // 'Computer Systems Engineering'
  period: 'string',               // '2022–2027'
  status: 'string',               // 'In Progress' | 'Completed'
};
```

---

## 4. Tech Stack Data Schema

```javascript
const techStack = {
  categories: [{
    name: 'string',               // Category name
    items: [{
      name: 'string',             // Technology name
      icon: 'string | null',      // Icon identifier
    }],
  }],
};
```

### Verified Categories

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express.js, MongoDB, PostgreSQL, Mongoose, Sequelize |
| **Architecture & Security** | REST APIs, MVC, Modular Architecture, JWT, RBAC, Validation |
| **Testing** | Jest, Supertest, Integration Testing |
| **DevOps** | Docker, CI/CD, GitHub Actions |
| **Tools** | Git, GitHub, Postman |

> [!CAUTION]
> Only display technologies Mohammed **actually uses**. Never add technologies to inflate the list.

---

## 5. Site Metadata Schema

```javascript
const siteMetadata = {
  name: 'Mohammed Ferwana',
  title: 'Backend Engineer',
  tagline: 'Building Scalable & Reliable Systems',
  description: 'Backend Engineer focused on scalable systems, reliable APIs, and software architecture.',
  siteUrl: 'https://mohammedferwana.dev',  // Update with actual domain
  email: 'mohammedferwana2@gmail.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/mohammed-ferwana/',
    github: 'https://github.com/hammoudFerwana',
  },
  ogImage: '/images/og-image.png',         // Open Graph preview image
};
```

---

## 6. Navigation Data Schema

```javascript
const navigation = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Contact', href: '/contact' },
  ],
  secondary: [
    { label: 'Engineering Lab', href: '/lab' },
  ],
};
```

---

## 7. Command Palette Commands Schema

```javascript
const commands = [
  {
    id: 'string',
    label: 'string',              // Display label
    shortcut: 'string | null',    // Keyboard shortcut hint
    action: 'navigate' | 'external' | 'download',
    target: 'string',             // URL or route
    icon: 'string',               // Icon identifier
    group: 'string',              // 'Navigation' | 'Social' | 'Actions'
  },
];
```

### Default Commands

| Label | Action | Target | Group |
|-------|--------|--------|-------|
| Home | navigate | `/` | Navigation |
| Projects | navigate | `/projects` | Navigation |
| About | navigate | `/about` | Navigation |
| Experience | navigate | `/experience` | Navigation |
| Contact | navigate | `/contact` | Navigation |
| Engineering Lab | navigate | `/lab` | Navigation |
| GitHub | external | github URL | Social |
| LinkedIn | external | linkedin URL | Social |
| Download Resume | download | `/resume/...` | Actions |

---

## 8. Engineering Lab Data Schema

```javascript
const labTopics = [{
  id: 'string',
  title: 'string',                // Topic name
  description: 'string',          // What Mohammed explored
  status: 'exploring' | 'practiced' | 'applied',
  tags: ['string'],               // Related technologies
}];
```

> [!NOTE]
> Lab topics need to be provided by Mohammed. Content will use placeholders marked with `[PLACEHOLDER]` until real topics are confirmed.

---

## 9. Content Placeholder Convention

When content is not yet available, use this pattern:

```javascript
// In data files
description: '[PLACEHOLDER] Brief description of this project.',

// In components — render conditionally
{project.problem && <ProblemSection content={project.problem} />}
```

### Placeholder Rules
1. All placeholders are prefixed with `[PLACEHOLDER]`
2. Components must handle `null`/`undefined` gracefully (conditional rendering)
3. Placeholders are never shown to end users — sections with placeholder content are hidden
4. The build must succeed even with all optional fields empty
