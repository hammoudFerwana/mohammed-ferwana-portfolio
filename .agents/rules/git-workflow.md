# Git & GitHub Engineering Standard (Lead / 20+ YOE Standard)

This document establishes the mandatory Git workflow, commit conventions, branching policies, and CI/CD protocols for this repository. Every automated agent and contributor must adhere to these guidelines strictly.

---

## 1. Mandatory User Approval Gate (STRICT ENFORCEMENT)

**CRITICAL RULE**: The agent MUST NEVER start executing code changes, creating branches, or modifying files without explicit prior permission from Mohammed.

1. **Before any new task**: Outline clearly in Arabic what will be done (the feature, branch name, and planned changes).
2. **Ask directly**: Ask the user: *"هل أبلش شغل على [...] ولا لأ؟"*.
3. **Execution Condition**: Proceed ONLY when Mohammed explicitly replies with approval (e.g., "بلش", "اشتغل", "نعم", "تمام").
4. If approval is not yet given, pause and wait.

---

## 2. Commit Message Standard: Conventional Commits v1.0.0

All commits must strictly follow the format:

```text
<type>(<scope>): <imperative summary in lowercase, no trailing dot>

[optional body: explain WHAT changed and WHY it changed]

[optional footer: breaking changes, issue references, co-authors]
```

### Allowed Types
- **`feat`**: A new user-facing feature or major technical capability.
- **`fix`**: A bug fix.
- **`docs`**: Documentation only changes (architecture docs, README, specifications).
- **`style`**: Code formatting, styling, CSS tokens (no functional logic change).
- **`refactor`**: Code restructuring without bug fixes or new features.
- **`perf`**: Performance optimizations.
- **`test`**: Adding missing tests or correcting existing tests.
- **`build`**: Changes that affect the build system or external dependencies (npm, bundler).
- **`ci`**: Changes to CI/CD configuration files and scripts (GitHub Actions, Vercel).
- **`chore`**: Maintenance tasks, tooling setup, configs, repo hygiene.

### Quality Rules for Commits
1. **Atomic Commits**: Each commit must represent a single logical, testable unit of work.
2. **Imperative Mood**: Use "add", "implement", "fix", "refactor" (not "added", "fixing", "adds").
3. **No Slop**: Never use generic messages like `update files`, `wip`, `fix bug`, or `commit`.
4. **Body Requirement for Non-Trivial Changes**: Provide a bulleted or clear narrative explaining *why* the decision was made.

---

## 3. Branching Strategy

We follow a robust Gitflow / GitHub Flow model designed for production stability:

```
[main] -----------------------------------------------------> Production Ready (Protected)
         \                                                ^
          \---> [develop] ------------------------------/ --> Active Integration
                  \                     ^
                   \---> [feat/...] ---/ -------------------> Feature Branches
                   \---> [fix/...] ----/ -------------------> Bug Fix Branches
                   \---> [chore/...] --/ -------------------> Tooling & Deps Branches
```

- **`main`**: Protected branch. Contains solely verified, production-ready code.
- **`develop`**: Integration branch for day-to-day feature staging.
- **`feat/<feature-slug>`**: Feature branches branched off `develop`.
- **`fix/<fix-slug>`**: Bug fix branches.
- **`docs/<doc-slug>`**: Documentation branches.
- **`chore/<chore-slug>`**: Tooling, dependencies, or configuration updates.

---

## 4. CI/CD Quality Gates & Automated Verification

1. **GitHub Actions**: Every `push` and `pull_request` to `main` and `develop` triggers `.github/workflows/ci.yml`.
2. **Local Pre-flight Check**: Before merging any branch into `develop` or pushing to remote, always verify locally:
   - `npm run lint` passes with 0 errors.
   - `npm run build` generates production bundles successfully with 0 errors.
3. **Deterministic Dependencies**: Always use `npm ci` in CI and keep `package-lock.json` updated and tracked in Git.

---

## 5. Remote Synchronization & Safety

1. Always verify working tree with `git status` before staging.
2. Stage specific, intended files (avoid blind `git add .` when untracked scratch files exist).
3. Merge feature branches into `develop` using `--no-ff` (non-fast-forward) to preserve clear history graphs.
4. Do not force push (`--force` or `-f`) to `main` or `develop`.
5. Keep `.gitignore` strictly updated to prevent secret leaks, build outputs (`.next`, `dist`), or OS junk from polluting remote history.
