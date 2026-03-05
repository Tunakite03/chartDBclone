# Skill: Web Accessibility (WCAG 2.1 AA)

## Semantic HTML
- Use correct elements: \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<aside>\`, \`<header>\`, \`<footer>\`.
- One \`<h1>\` per page. Headings in order: h1 → h2 → h3 (no skipping).
- Use \`<button>\` for actions, \`<a>\` for navigation. Never \`<div onClick>\`.
- Use \`<ul>\`/\`<ol>\` for lists. Use \`<table>\` for tabular data.

## Images & Media
- All \`<img>\` must have \`alt\` text. Decorative images: \`alt=""\`.
- Complex images (charts, diagrams) need extended descriptions.
- Videos need captions. Audio needs transcripts.

## Forms
- Every input must have a visible \`<label>\` (or \`aria-label\`).
- Group related fields with \`<fieldset>\` + \`<legend>\`.
- Error messages linked to inputs via \`aria-describedby\`.
- Required fields marked with \`aria-required="true"\`.
- Focus moves to the first error on submit.

## Keyboard Navigation
- All interactive elements reachable via Tab key.
- Visible focus indicator (never \`outline: none\` without replacement).
- Escape closes modals/dropdowns. Enter/Space activates buttons.
- Focus trapping inside modals (Tab cycles within modal).
- Skip links: \`<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>\`.

## Color & Contrast
- Text contrast ratio: **4.5:1** minimum (AA). Large text: **3:1**.
- Never use color alone to convey information (add icons, text, patterns).
- Test with grayscale filter to verify.

## ARIA Rules
- First rule of ARIA: don't use ARIA if native HTML works.
- \`aria-label\` for elements without visible text.
- \`aria-live="polite"\` for dynamic content updates (toasts, loading).
- \`role="alert"\` for error messages.
- \`aria-expanded\` for collapsible sections and dropdowns.

## Testing Tools
- Lighthouse accessibility audit (Chrome DevTools).
- axe DevTools browser extension.
- Screen reader testing: VoiceOver (Mac), NVDA (Windows).
- Keyboard-only navigation test.

## Checklist
- [ ] All images have appropriate alt text.
- [ ] All form inputs have labels.
- [ ] Color contrast meets WCAG AA (4.5:1).
- [ ] All functionality accessible via keyboard.
- [ ] Focus order is logical and visible.
- [ ] No content conveyed by color alone.
- [ ] ARIA used correctly (or not at all if native HTML suffices).
- [ ] Tested with screen reader.
