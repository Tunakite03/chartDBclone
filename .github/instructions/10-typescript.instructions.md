---
applyTo: "**/*.{ts,tsx}"
---
# TypeScript Rules

## Types
- Enable `strict: true`. Never weaken compiler options.
- No `any`. Use `unknown` + type guards, or the correct specific type.
- Avoid `as` assertions. If needed, add a comment explaining why.
- Use `satisfies` for config: `const cfg = { ... } satisfies Config`.
- Prefer `interface` for object shapes (extendable). `type` for unions.
- Use `readonly` for immutable data.
- Avoid `enum` - use `as const` objects with derived union types.
- Use `import type` for type-only imports.

## Patterns
- Discriminated unions for state: `{ status: "loading" } | { status: "ok"; data: T }`
- Result pattern for errors: `{ ok: true; data: T } | { ok: false; error: E }`
- Type narrowing with `in`, `typeof`, `instanceof`, custom type guards.
- Generic constraints: `<T extends Base>` not unbounded `<T>`.
- Utility types: `Pick`, `Omit`, `Partial`, `Required`, `Record`.

## Safety
- Handle `null | undefined` explicitly. Use optional chaining `?.` and nullish coalescing `??`.
- Exhaustive switch with `never` default: `default: { const _: never = x; }`
- Validate external data (API responses, env vars) at the boundary with Zod or similar.
- Prefer `Map`/`Set` over plain objects for dynamic keys.
