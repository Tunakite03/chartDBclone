# Skill: Create a React Component

## Template
```tsx
// src/components/<Name>/<Name>.tsx
import { type FC } from 'react';

export interface <Name>Props {
  // define props here
}

export const <Name>: FC<<Name>Props> = ({ /* props */ }) => {
  // hooks at the top
  // handlers named handle<Event>
  // early returns for loading/error states

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

<Name>.displayName = '<Name>';
```

## Checklist
- [ ] Props interface exported and named `<Name>Props`.
- [ ] No inline arrow functions in JSX — extract to named handlers.
- [ ] `useCallback` for functions passed to child components.
- [ ] Loading + error states handled explicitly.
- [ ] Accessible: alt text on images, labels on inputs, aria where needed.
- [ ] Colors only via Tailwind semantic tokens (no hardcoded hex).
- [ ] Tested: renders without crash, key interactions covered.
- [ ] Performance: Large lists are virtualized, expensive children are memoized.
