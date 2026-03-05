# Skill: Debug an Issue

## Steps
1. **Reproduce** — get a minimal, repeatable case.
2. **Isolate** — binary-search the code path. Add logs to narrow scope.
3. **Hypothesize** — form a specific theory for the root cause.
4. **Verify** — write a failing test that proves the bug exists.
5. **Fix** — make the smallest change that fixes the failing test.
6. **Regression test** — ensure the test now passes and stays green.
7. **Scan** — look for the same pattern elsewhere in the codebase.

## Useful diagnostics
- Read error messages carefully — the stack trace shows the exact line.
- Check recent git changes: `git log --oneline -20`, `git diff HEAD~1`.
- Validate assumptions with `console.log` / `print` / breakpoints.
- Check environment: env vars, dependency versions, OS differences.

## Anti-patterns to avoid
- Don't fix symptoms — find the root cause.
- Don't suppress errors with try/catch without understanding them.
- Don't assume — verify every assumption with evidence.
