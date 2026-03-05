---
applyTo: "**/*.{tsx,jsx,css}"
---
# UI Style Guide (Tailwind + shadcn/ui)

## Theme
- Dark mode: class-based (`dark` class on html/body).
- Use semantic tokens ONLY:
  - `background` / `foreground`
  - `primary` / `primary-foreground`
  - `secondary` / `secondary-foreground`
  - `muted` / `muted-foreground`
  - `accent` / `accent-foreground`
  - `destructive` / `destructive-foreground`
  - `border` / `ring`
  - `card` / `card-foreground`
  - `popover` / `popover-foreground`

## Colors
- Do NOT hardcode hex/rgb colors in components.
- Use Tailwind semantic classes:
  - `bg-background`, `text-foreground`
  - `bg-primary`, `text-primary-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `border-border`, `ring-ring`
- Do NOT invent new colors or override theme variables.
- Do NOT change existing color mappings unless explicitly asked.

## Radius
- Default: `rounded-lg` for cards, modals, buttons.
- Use `rounded-md` for small inputs, `rounded-sm` for chips/badges.
- Match existing border-radius patterns. Do NOT mix.

## Spacing
- Page padding: `px-4 md:px-6`
- Card padding: `p-4` (default), `p-6` for large sections.
- Use `gap-2` / `gap-3` / `gap-4` consistently (avoid random spacing).
- Section spacing: `space-y-4` or `space-y-6`.

## Components
- Prefer shadcn/ui components first. Do NOT build custom alternatives.
- Avoid custom button/input/dialog styles — use shadcn `<Button>`, `<Input>`, `<Dialog>`.
- When shadcn doesn't have a component, match its visual style.
- Do NOT change shadcn component defaults (variants, sizes) unless asked.

## Examples
- Card: `className="rounded-lg border border-border bg-background p-4"`
- Primary button: `<Button variant="default" />`
- Secondary button: `<Button variant="secondary" />`
- Muted text: `className="text-sm text-muted-foreground"`
- Page container: `className="container mx-auto px-4 md:px-6"`
