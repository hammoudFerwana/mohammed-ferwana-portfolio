# Workspace Agent Directives & Engineering Standards

## 1. Absolute Rule: Mandatory User Approval Gate
**NEVER START ANY WORK WITHOUT EXPLICIT PERMISSION FROM MOHAMMED.**
- Before creating a branch, writing code, or running modifying commands, always explain the plan briefly in Arabic.
- Ask the explicit question: *"هل أبلش شغل على [اسم الميزة] ولا لأ؟"*.
- Wait for Mohammed's explicit approval ("بلش", "نعم", "اشتغل"). Only then execute.

## 2. Git & GitHub Engineering Standard (Senior / Lead 20+ YOE)
- **Branching Model**: Gitflow (`main` for production releases, `develop` for daily integration, `feat/<name>` for scoped feature work).
- **Commits**: Strictly Conventional Commits v1.0.0 (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`, `ci:`).
- **Merging**: Always merge feature branches into `develop` using `--no-ff` (non-fast-forward) to preserve clear feature history.
- **Never touch `main` directly**: `main` is only updated when doing a full production release from `develop`.

## 3. CI/CD Standards
- Every commit pushed to `develop` or `main` must pass GitHub Actions CI (`.github/workflows/ci.yml`).
- Always run and verify `npm run lint` and `npm run build` locally before pushing or merging.
