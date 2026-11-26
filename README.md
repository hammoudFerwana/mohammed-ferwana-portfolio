# Mohammed Ferwana · Portfolio

**Personal portfolio of a backend developer, with interactive case studies of real projects.**

![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

**[Visit the live site](https://mohammed-ferwana-portfolio.vercel.app/)**

---

## Purpose

Built to show backend engineering work (architecture, state machines, data design, API contracts and tests) to recruiters and engineering managers, in a form anyone can explore.

## What you will find on the site

| Page | Content |
|------|---------|
| Home | Introduction, featured projects, live Gaza clock |
| Projects | All projects, grouped into main projects and other work |
| Case study | Problem, architecture, decisions, trade-offs and testing for each project |
| About | Story, approach and tech stack |
| Experience | Training, work and education timeline |
| Contact | Contact form and social links |

## Interactive features

- **Claim lifecycle simulator:** step a Sawn insurance claim through its states and watch invalid moves get rejected.
- **Concurrency sandbox:** shows how Sawn keeps claim numbers unique when two claims arrive at once.
- **Task board simulator:** an interactive TeamLine task board demo.
- **Architecture viewer:** click through each layer of a project's system design.
- **Command palette:** press `Ctrl+K` (or `Cmd+K`) to jump anywhere.
- **Dark and light themes,** saved between visits.
- **One-click resume** download as PDF.

## Quality gates

Every push to `main` and `develop` runs the CI pipeline in `.github/workflows/ci.yml`:

1. ESLint
2. Unit tests for the claim state machine (`node --test`)
3. Production build
4. Facts check: blocks unverifiable or inflated wording in site content
5. Playwright end-to-end tests with axe accessibility checks
6. Lighthouse CI for performance and best practices

## Tech stack

| Area | Tools |
|------|-------|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons and fonts | Phosphor Icons, Geist |
| Forms | Formspree |
| Testing | Node test runner, Playwright, axe-core, Lighthouse CI |
| Hosting | Vercel, Vercel Analytics |

## Project structure

```text
src/
├── app/          # pages and routes (App Router)
├── components/   # UI by section: home, projects, about, contact, layout, shared
├── context/      # theme and command palette state
├── data/         # all site content: projects, experience, metrics, tech stack
└── lib/          # state machine logic, animations, helpers
scripts/          # facts check, resume PDF builder
tests/e2e/        # Playwright tests
docs/             # architecture, design system, content model, feature specs
```

All content lives in `src/data/`. Adding a project means adding one entry to `src/data/projects.js`; the case study page builds from that data.

## Run locally

```bash
git clone https://github.com/hammoudFerwana/mohammed-ferwana-portfolio.git
cd mohammed-ferwana-portfolio
npm install
npm run dev        # http://localhost:3000
```

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build |
| `npm run lint` | Lint the code |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end and accessibility tests |
| `npm run check:facts` | Content facts check |
| `npm run build:resume` | Rebuild the resume PDF |

Optional `.env.local` values:

| Variable | Use |
|----------|-----|
| `NEXT_PUBLIC_FORMSPREE_ID` | Contact form endpoint |
| `NEXT_PUBLIC_SITE_URL` | Base URL for SEO metadata |

## Documentation

[Architecture](docs/ARCHITECTURE.md) · [Design system](docs/DESIGN_SYSTEM.md) · [Content model](docs/CONTENT_MODEL.md) · [Deployment](docs/DEPLOYMENT.md) · [Changelog](CHANGELOG.md)

## Contact

[LinkedIn](https://www.linkedin.com/in/mohammed-ferwana) · [GitHub](https://github.com/hammoudFerwana) · mohammedferwana2@gmail.com
