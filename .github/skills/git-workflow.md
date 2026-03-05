# Skill: Git Workflow

## Commit Messages — Conventional Commits
Format: `type(scope): description`

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `test` | Add or update tests |
| `docs` | Documentation only |
| `perf` | Performance improvement |
| `chore` | Build, tooling, CI changes |
| `style` | Formatting, white-space (no logic change) |

Rules:
- Subject: imperative mood, max 72 chars, no trailing period.
- Body: explain **WHY**, not what (the diff shows what).
- Footer: `Closes #123` or `Breaking change: <description>`.

Examples:
```
feat(auth): add OAuth2 login with Google

Adds Google OAuth2 as an alternative sign-in method.
Users can now link their Google account in Settings > Account.

Closes #42
```
```
fix(api): return 404 when user not found instead of 500

Previously GetUser threw an unhandled exception when userId
didn't exist in the DB. Added explicit null-check + 404 response.
```

## Branch Naming
- Feature : `feat/<short-description>`
- Bug fix  : `fix/<issue-or-description>`
- Hotfix   : `hotfix/<critical-bug>`
- Release  : `release/v<semver>`

## PR Checklist
- [ ] Tests pass locally
- [ ] No debug logs or commented-out code
- [ ] No hardcoded secrets or tokens
- [ ] Self-reviewed the diff
- [ ] PR description explains the WHY, not just the WHAT
- [ ] Breaking changes documented
