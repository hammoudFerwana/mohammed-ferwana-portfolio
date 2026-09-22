# Repository Git Workflow & Contribution Guide

This guide documents the enterprise-grade Git strategy practiced in this repository, adhering to Principal Engineering standards.

## Remote Repository
- **Remote URL**: `https://github.com/hammoudFerwana/mohammed-ferwana-portfolio.git`
- **Main Branch**: `main`
- **Development Branch**: `develop`

---

## 1. Branch Taxonomy

| Branch Category | Naming Pattern | Base Branch | Target Branch | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Production** | `main` | - | - | Deployed production code |
| **Integration** | `develop` | `main` | `main` | Next release integration |
| **Features** | `feat/<feature-name>` | `develop` | `develop` | New functionality |
| **Bug Fixes** | `fix/<bug-name>` | `develop` | `develop` | Patches and bug fixes |
| **Docs** | `docs/<topic>` | `develop` or `main` | `develop` or `main` | Specifications, guides |
| **Chores** | `chore/<scope>` | `develop` | `develop` | Tooling, dependencies |
| **Hotfixes** | `hotfix/<patch-name>` | `main` | `main` & `develop` | Urgent production fixes |

---

## 2. Commit Message Standard (Conventional Commits v1.0.0)

Format:
```text
<type>(<scope>): <short summary in imperative mood>

[optional body providing technical context and rationale]

[optional footer referencing tickets or breaking changes]
```

### Examples

#### Feature:
```text
feat(hero): implement dynamic canvas mesh background and terminal status

- Introduce interactive particle wave utilizing CSS grid and Canvas API
- Add terminal-style availability badge with live UTC time indicator
- Support reduced-motion accessibility preference via media query hook
```

#### Fix:
```text
fix(nav): correct active route indicator offset on mobile viewport

- Adjust bounding client rect calculation when drawer is scrolled
- Resolve z-index collision with glassmorphic modal overlay
```

#### Documentation:
```text
docs(architecture): document interactive 3D component pipeline

- Detail lazy-loading strategy with dynamic imports and SSR disabled
- Document WebGL context fallback handling for low-power mobile devices
```

---

## 3. Merge Standards
- Linear history or clean squash-and-merge via PRs.
- No direct unreviewed pushes to `main`.
- All branches must pass linting and type checking before merge.
