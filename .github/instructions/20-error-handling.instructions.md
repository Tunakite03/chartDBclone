---
applyTo: "**/*.{ts,tsx,js,jsx}"
---
# Error Handling Rules

## Principles
- Never swallow errors. Handle or re-throw with added context.
- Use typed errors with error codes, not raw strings.
- Provide actionable error messages: what happened + how to fix.
- Log errors at the point of handling, not at every catch.

## Patterns
- Custom error classes extending `Error` with a `code` property.
- Result type: `type Result<T, E = Error> = { ok: true; data: T } | { ok: false; error: E }`
- Try/catch only at boundaries (API handlers, event listeners).
- Avoid `catch (e) { console.log(e) }` - always re-throw or return error state.

## Async Errors
- Always `await` promises or attach error handlers.
- Use `Promise.allSettled()` when some failures are acceptable.
- Handle stream errors and close events explicitly.

## User-Facing Errors
- Separate internal error details from user-facing messages.
- Never expose stack traces, SQL errors, or internal paths to users.
- Return consistent error shape: `{ error: { code, message, details? } }`.
