# Mohammed Ferwana — Premium Engineering Portfolio

> A sophisticated personal engineering portfolio built with Next.js 14, Tailwind CSS, and Framer Motion. Designed to communicate backend engineering thinking through evidence, architecture, and storytelling.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 14+ |
| **Language** | JavaScript (JSX) | ES2022+ |
| **Styling** | Tailwind CSS | v3 |
| **Animation** | Framer Motion | Latest |
| **Icons** | Phosphor Icons (React) | Latest |
| **Fonts** | Geist + Geist Mono | Variable |
| **Deployment** | Vercel | — |
| **Analytics** | Vercel Analytics | — |
| **Contact Form** | Formspree / EmailJS | — |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.js           # Root layout, fonts, metadata
│   ├── page.js             # Home page
│   ├── projects/           # Projects listing + case studies
│   ├── about/              # About page (story, philosophy, timeline)
│   ├── experience/         # Experience & education
│   ├── contact/            # Contact form + social links
│   ├── lab/                # Engineering Lab
│   └── not-found.js        # Custom 404
│
├── components/             # Reusable UI components
│   ├── layout/             # Navbar, Footer, MobileMenu
│   ├── home/               # Hero, Identity, HowIThink, Featured
│   ├── projects/           # ProjectCard, CaseStudy, ArchViewer
│   ├── about/              # Story, Philosophy, Timeline, TechStack
│   ├── experience/         # ExperienceCard, EducationCard
│   ├── contact/            # ContactForm, SocialLinks
│   └── shared/             # CommandPalette, Terminal, Button, etc.
│
├── data/                   # Centralized content/data
│   ├── projects.js         # All project data
│   ├── experience.js       # Work & education data
│   ├── techStack.js        # Technology categories
│   ├── navigation.js       # Nav items & routes
│   ├── siteMetadata.js     # Global SEO metadata
│   └── commands.js         # Command palette actions
│
├── lib/                    # Utilities & helpers
│   ├── animations.js       # Animation variants & configs
│   ├── seo.js              # SEO helper functions
│   └── utils.js            # General utilities
│
└── public/                 # Static assets
    ├── images/             # Photos & screenshots
    ├── resume/             # Resume PDF
    └── favicon/            # Favicon set
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, engineering identity, featured projects, thinking process |
| `/projects` | Projects | All projects with filtering |
| `/projects/[slug]` | Case Study | Detailed engineering case study |
| `/about` | About | Story, philosophy, timeline, tech stack |
| `/experience` | Experience | Work experience, training, education |
| `/contact` | Contact | Contact form, social links |
| `/lab` | Engineering Lab | Engineering experiments & explorations |

---

## Features

- **Interactive Architecture Viewer** — Visualize system architecture for case studies
- **Command Palette** (`Ctrl+K`) — Quick navigation across the site
- **Mini Terminal Easter Egg** — Engineering-flavored hidden feature
- **Engineering Case Studies** — 9-part project deep-dives
- **"How I Think" Section** — Visual engineering thought process
- **Scroll Reveal Animations** — Framer Motion powered entrances
- **Dark Theme** — Premium dark surfaces with purple/indigo accent
- **Responsive Design** — Intentional layouts for all viewports
- **Accessible** — Keyboard nav, focus states, reduced-motion support
- **SEO Optimized** — Meta tags, Open Graph, structured data

---

## Content Management

All content is centralized in `src/data/`. To add a new project:

1. Add project data to `src/data/projects.js`
2. Add project screenshot to `public/images/projects/`
3. The case study page auto-generates from the data

See [CONTENT_MODEL.md](./docs/CONTENT_MODEL.md) for the complete data schema.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FORMSPREE_ID` | Formspree form endpoint ID | For contact form |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | For SEO |

---

## Deployment

This project is configured for **Vercel** deployment:

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

---

## Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Component architecture & data flow |
| [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | Colors, typography, spacing, motion tokens |
| [CONTENT_MODEL.md](./docs/CONTENT_MODEL.md) | Data structures & schemas |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Build & deployment guide |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [features/](./docs/features/) | Feature specification documents |

---

## License

Private — Mohammed Ferwana © 2024–2027
