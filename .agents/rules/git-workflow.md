# Git & GitHub Engineering Standard (Lead / 20+ YOE Standard)

This document establishes the mandatory Git workflow, commit conventions, and branching policies for this repository. Every automated agent and contributor must adhere to these guidelines strictly.

---

## 1. Commit Message Standard: Conventional Commits v1.0.0

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
- **`style`**: Code formatting, missing semi-colons, whitespace (no functional logic change).
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

## 2. Branching Strategy

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

## 3. Remote Synchronization & Safety

1. Always verify working tree with `git status` before staging.
2. Stage specific, intended files (avoid blind `git add .` when untracked scratch files exist).
3. Do not force push (`--force` or `-f`) to `main` or `develop`.
4. Keep `.gitignore` strictly updated to prevent secret leaks, build outputs (`.next`, `dist`), or OS junk from polluting remote history.
