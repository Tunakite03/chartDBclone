# Skill: Code Review

## Review Process
1. **Understand** — Read the PR description and linked issue first.
2. **Skim** — Get the big picture. Understand the shape of the change.
3. **Deep dive** — Read each file carefully. Check logic, edge cases, naming.
4. **Test mentally** — Trace the code path with real inputs (happy + unhappy).
5. **Comment** — Be specific, suggest fixes, explain reasoning.

## Severity Levels
| Level | When to use |
|-------|-------------|
| `🔴 critical` | Bug, security flaw, data loss risk. Must fix before merge. |
| `🟡 warning` | Performance issue, bad pattern, potential tech debt. Should fix. |
| `🔵 suggestion` | Better approach exists, readability improvement. Nice to have. |
| `⚪ nit` | Style, naming, formatting. Optional. |

## What to Check
- **Correctness**: Does the logic handle all cases? Edge cases?
- **Security**: User input validated? Secrets exposed? SQL injection?
- **Performance**: N+1 queries? Unbounded loops? Memory leaks?
- **Naming**: Is every name clear? Would a new teammate understand?
- **Tests**: Happy path + edge cases + error cases covered?
- **Docs**: Public APIs documented? Breaking changes noted?

## Comment Template
\`\`\`
[severity] file.ts:L42
Issue: <what is wrong>
Why: <why it matters>
Fix: <suggested improvement with code>
\`\`\`

## Anti-patterns
- Don't just say "this is wrong" — explain WHY and suggest a fix.
- Don't nitpick style if a formatter/linter handles it.
- Don't approve without reading. "LGTM" without review is harmful.
- Don't block on subjective preferences. Distinguish opinion from rule.
