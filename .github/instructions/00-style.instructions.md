---
applyTo: "**"
---
# Style & Readability

## Functions
- Keep functions under 40 lines. If longer, extract helpers.
- One level of abstraction per function.
- Max 3 parameters. Use an options object for more.
- Name functions as verbs: `createUser`, `validateInput`, `fetchOrders`.

## Naming
- Variables/functions: `camelCase`
- Types/Classes/Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts` or match existing convention
- Boolean vars: `is`, `has`, `should`, `can` prefix (`isVisible`, `hasAccess`)
- Event handlers: `handle<Event>` (`handleClick`, `handleSubmit`)

## Structure
- Early returns to reduce nesting. Max 2-3 indentation levels.
- Guard clauses at the top of functions.
- Group related code together. Separate with blank lines.
- Imports order: built-in -> external -> internal -> types -> styles.

## Comments
- Comments explain WHY, not WHAT. Code is self-documenting.
- Use JSDoc/TSDoc for public APIs with `@param`, `@returns`, `@throws`, `@example`.
- TODO format: `// TODO(username): description (#issue-number)`
- Remove commented-out code. Use git history instead.

## UI Theme & Colors
- Do NOT change existing colors, themes, or design tokens unless explicitly asked.
- Use design tokens / CSS variables / theme constants — never hardcode hex/rgb values inline.
- Reference the project's color palette. Do NOT invent new colors.
- Preserve the existing visual hierarchy (font sizes, spacing, border-radius, shadows).
- When adding new UI elements, match the closest existing component's style.
- Do NOT switch between light/dark mode behavior unless instructed.
- Do NOT change opacity, gradients, or color transformations on existing elements.
- If a design system (Tailwind, shadcn, MUI, etc.) is in use, use ONLY its tokens/classes.
- Before changing any visual property, ask: "Does this match the existing theme?"
