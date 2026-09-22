# Development Methodology

> **This file is the single source of truth for how every feature is built.**
> Read this BEFORE starting any feature implementation.
> This methodology applies to EVERY task, EVERY feature, EVERY fix.

---

## The Pipeline: 8 Phases

Every piece of work — whether a new feature, bug fix, or enhancement — passes through ALL 8 phases in order. No skipping.

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ① ANALYZE  →  ② PLAN  →  ③ REVIEW PLAN  →  ④ IMPLEMENT        │
│                                                                  │
│      ↓                                                           │
│                                                                  │
│  ⑤ SELF-TEST  →  ⑥ CODE REVIEW  →  ⑦ RE-TEST  →  ⑧ SIGN-OFF   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — ANALYZE

**Goal:** Fully understand WHAT we're building and WHY before touching code.

### Checklist
- [ ] Read the feature spec `.md` file (if it exists)
- [ ] Read the master prompt section(s) related to this feature
- [ ] Check the DESIGN_SYSTEM.md for relevant tokens
- [ ] Check CONTENT_MODEL.md for relevant data schemas
- [ ] Check ARCHITECTURE.md for where this component fits
- [ ] Identify which skills are relevant for this feature
- [ ] Read relevant skill SKILL.md files
- [ ] Identify dependencies (does this feature depend on another being built first?)
- [ ] Identify what content is available vs. placeholder needed

### Questions to Answer
1. What is the user-facing goal of this feature?
2. Which components need to be created/modified?
3. Is this a Server or Client component?
4. What data does it consume?
5. What interactions does it support?
6. What are the accessibility requirements?
7. What are the responsive breakpoints?
8. Are there any open questions that BLOCK implementation?

### Blocking Rule
> **If a question is genuinely ambiguous and could lead to significant rework, ASK the user BEFORE proceeding.** Never guess on critical decisions.

---

## Phase 2 — PLAN

**Goal:** Create a mental or written mini-plan for the implementation.

### For Simple Features (1-2 components)
- Mental plan is fine
- List the files to create/modify
- Identify the order of operations

### For Complex Features (3+ components, interactions, state)
- Write a brief plan as a comment at the top of the task
- Component breakdown with props/state
- Interaction flow
- Edge cases to handle

### Order of Implementation
1. Data first (ensure data schema exists in `src/data/`)
2. Static structure (HTML/JSX skeleton)
3. Styling (Tailwind classes, design system tokens)
4. Interactivity (state, event handlers — only if Client Component)
5. Animation (Framer Motion — only if needed)
6. Accessibility (ARIA, keyboard, focus states)
7. Responsive adjustments (mobile → desktop)

---

## Phase 3 — REVIEW PLAN (Self-Check)

**Goal:** Catch bad decisions BEFORE writing code.

### Product Engineer Review Questions
- [ ] Does this implementation match the master prompt's vision?
- [ ] Does this align with the design system (colors, typography, spacing)?
- [ ] Is this the simplest implementation that achieves the goal?
- [ ] Am I over-engineering this? (YAGNI check)
- [ ] Am I under-engineering this? (Will this need to be rewritten soon?)
- [ ] Does the component architecture allow Mohammed to add content later without code changes?
- [ ] Am I introducing any fabricated content or fake data? (**ZERO TOLERANCE**)
- [ ] Is the Server/Client boundary correct? (Minimize client JS)

### Anti-Patterns to Catch
- [ ] NOT building a generic template
- [ ] NOT using fake skill percentages
- [ ] NOT using generic AI phrases ("passionate developer", "love coding")
- [ ] NOT using excessive animations
- [ ] NOT hardcoding content across components
- [ ] NOT creating fake statistics or metrics
- [ ] NOT ignoring accessibility

---

## Phase 4 — IMPLEMENT

**Goal:** Write clean, production-quality code.

### Coding Standards
1. **Naming:** Descriptive, consistent. Components: PascalCase. Files: PascalCase.jsx
2. **Structure:** One component per file. Props destructured at top.
3. **Comments:** Explain WHY, not WHAT. No commented-out code.
4. **Imports:** Group: React → Next.js → Libraries → Components → Data → Styles
5. **No Magic Numbers:** Use design system tokens from Tailwind config
6. **Conditional Rendering:** Gracefully handle null/undefined data
7. **Accessibility:** Every interactive element has accessible labels from the start (not added later)

### Skills to Activate Per Feature Type

| Feature Type | Skills to Read |
|-------------|----------------|
| Layout/Visual | `high-end-visual-design`, `design-taste-frontend` |
| Interactive UI | `design-spells`, `react-patterns` |
| Forms | `accessibility-compliance`, `react-patterns` |
| SEO | `seo-fundamentals` |
| Performance | `performance-optimizer` |
| Code Quality | `clean-code` |
| Architecture | `architect-review` |

### Implementation Rules
- Build mobile-first, then add responsive breakpoints
- Start with static content, then add interactivity
- Add animations LAST (after everything works)
- Test in browser frequently during development
- Commit logical chunks, not huge batches

---

## Phase 5 — SELF-TEST

**Goal:** Verify the implementation works before code review.

### Automated Checks
```bash
# Must pass before moving to Phase 6
npm run build          # Production build succeeds
npm run lint           # No lint errors
```

### Manual Checks
- [ ] Feature renders correctly in browser
- [ ] Desktop layout matches spec wireframe
- [ ] Mobile layout is usable (no overflow, readable text, tappable targets)
- [ ] All links/buttons work
- [ ] No console errors or warnings
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Content is truthful (no fabricated data)
- [ ] Animations feel intentional and restrained
- [ ] Reduced motion: feature works without animations

### Browser Testing
- [ ] Chrome (primary)
- [ ] Responsive mode: 375px, 768px, 1024px, 1440px

---

## Phase 6 — CODE REVIEW (Self-Review as Senior Engineer)

**Goal:** Review your own code as if you're a strict senior engineer reviewing a PR.

### Code Quality Checklist
- [ ] No unused imports or variables
- [ ] No hardcoded values that should be tokens
- [ ] No duplicated logic that should be extracted
- [ ] Props are typed/validated properly
- [ ] Error states handled (not just happy path)
- [ ] Loading states handled (where applicable)
- [ ] Empty states handled (where applicable)
- [ ] Component is reusable where it should be
- [ ] Server/Client boundary is correct
- [ ] No unnecessary re-renders (React performance)

### Design Review Checklist (as Designer)
- [ ] Typography matches design system scale
- [ ] Colors from design system palette only
- [ ] Spacing follows the spacing scale
- [ ] Visual hierarchy is clear
- [ ] Hover/focus states are present
- [ ] The section feels "premium and engineered", not "template"

### Content Review Checklist (as Brand Strategist)
- [ ] Mohammed is positioned as Backend Engineer
- [ ] No generic AI copy
- [ ] Every sentence adds value
- [ ] Leadership supports engineering identity (not the reverse)
- [ ] No fabricated content
- [ ] Training is NOT presented as employment

### Prompt Compliance Check
- [ ] Does this match the relevant master prompt section?
- [ ] Does it follow the anti-pattern rules (Section 46 of prompt)?
- [ ] Does it support the UX story (Section 55)?
- [ ] Does the feature pass the quality bar (Section 56)?

---

## Phase 7 — RE-TEST

**Goal:** After code review fixes, test EVERYTHING again.

### Regression Testing
- [ ] Previous features still work
- [ ] Navigation between pages works
- [ ] Global components (Navbar, Footer, Command Palette) unaffected
- [ ] Build still passes
- [ ] No new console errors

### Integration Testing
- [ ] New feature integrates with existing pages
- [ ] Data flows correctly from `src/data/` to components
- [ ] Links to/from this feature work
- [ ] SEO metadata is correct for new/modified pages

---

## Phase 8 — SIGN-OFF

**Goal:** Final verification before moving to the next feature.

### Sign-Off Criteria
- [ ] Feature matches its spec document
- [ ] All Phase 5, 6, 7 checklists passed
- [ ] Task list updated (mark feature as complete)
- [ ] No known bugs introduced
- [ ] Code is clean and ready for production

### Update Tracking
- Update `task.md` — mark feature as `[x]` complete
- Update `CHANGELOG.md` if significant

---

## Additional Process Rules

### Content Safety Protocol (CRITICAL)
At every phase, validate:
- ❌ No invented clients, companies, job titles
- ❌ No fabricated project results, users, revenue
- ❌ No fake performance numbers, test counts, team sizes
- ❌ No awards, certifications, or production usage claims
- ❌ No fake statistics (repositories, APIs, hours)
- ✅ Omit content rather than fabricate it
- ✅ Use `[PLACEHOLDER]` prefix for content awaiting confirmation
- ✅ Hide sections with no real content (conditional rendering)

### Decision Protocol
- **Trivial decisions** (naming, spacing tweaks): Decide and proceed
- **Minor decisions** (component structure, animation style): Decide, document reasoning
- **Major decisions** (architecture change, new dependency, content interpretation): ASK the user

### Rollback Rule
If a feature implementation reveals a fundamental problem with the plan:
1. STOP implementation
2. Document what was found
3. Propose a revised approach
4. Get user approval before continuing

### Feature Dependency Order
Build in this order to minimize rework:
```
1. Design system + Tailwind config
2. Data files
3. Shared components (Button, Badge, SectionHeading, RevealOnScroll)
4. Layout (Navbar, Footer, Root Layout)
5. Home page (most important first impression)
6. Projects page + Case studies
7. About page
8. Experience page
9. Contact page
10. Engineering Lab
11. Command Palette + Mini Terminal
12. 404 page
13. SEO (sitemap, structured data, meta)
14. Final polish + testing
```

---

## Suggested Improvements (Not in Original Prompt)

### 1. Error Boundary
Add a React Error Boundary component to catch rendering errors gracefully instead of showing a blank page.

### 2. Loading Skeleton
Create a lightweight loading skeleton component for pages that might have hydration delay.

### 3. Print Stylesheet
Add basic print styles so the portfolio prints cleanly (recruiters sometimes print/PDF portfolios).

### 4. OG Image Generation
Consider using `@vercel/og` to dynamically generate Open Graph images for each project case study.

### 5. Prefetch Strategy
Use Next.js `<Link prefetch>` strategically — prefetch project case studies on hover over project cards.

### 6. Content Validation Script
Create a simple script that validates all project data has required fields, all links are valid URLs, and no `[PLACEHOLDER]` content is exposed in production.

### 7. Bundle Analysis
Add `@next/bundle-analyzer` to monitor bundle size during development.

### 8. Git Hooks
Consider adding a pre-commit hook (via Husky + lint-staged) to run lint on staged files.

### 9. Visual Regression
After V1, consider adding Playwright visual snapshot tests for critical pages.

### 10. Progressive Enhancement
Ensure the site is fully functional with JavaScript disabled (content is readable, navigation works via standard links). All content is SSG, so this should work naturally.
