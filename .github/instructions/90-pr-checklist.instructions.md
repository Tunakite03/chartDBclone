---
applyTo: "**"
---
# PR Checklist

Before submitting any change, verify:

## Correctness
- [ ] Types are correct, no implicit `any`
- [ ] Edge cases handled (null, empty, boundary values)
- [ ] Error states handled with proper messages
- [ ] No regressions to existing functionality

## Quality
- [ ] Minimal diff - only changes needed for the task
- [ ] No dead code, commented-out code, or console.logs
- [ ] Functions < 40 lines, max 3 params
- [ ] Naming is clear and consistent with codebase

## Safety
- [ ] No secrets, keys, or PII in code or logs
- [ ] Inputs validated at boundaries
- [ ] No new dependencies added without approval
- [ ] SQL uses parameterized queries (if applicable)

## Testing
- [ ] Tests added/updated for the change
- [ ] Tests are deterministic (no flaky tests)
- [ ] Edge cases covered in tests

## Documentation
- [ ] Public APIs documented with JSDoc/TSDoc
- [ ] Breaking changes noted (if any)
- [ ] README updated (if applicable)
