# Skill: Create a Custom React Hook

## Template
```typescript
// src/hooks/use<Name>.ts
import { useState, useEffect, useCallback } from 'react';

interface Use<Name>Options {
  // options
}

interface Use<Name>Return {
  // return values
}

export function use<Name>(options: Use<Name>Options): Use<Name>Return {
  const [state, setState] = useState<...>(/* initial */);

  useEffect(() => {
    // side effect
    return () => {
      // cleanup
    };
  }, [/* deps */]);

  const handleAction = useCallback(() => {
    // handler
  }, [/* deps */]);

  return { state, handleAction };
}
```

## Checklist
- [ ] Named `use<Name>` (camelCase, "use" prefix).
- [ ] Returns a plain object (not array) unless mimicking useState pair.
- [ ] All effect dependencies listed correctly.
- [ ] Cleanup in useEffect return for subscriptions/timers.
- [ ] No direct DOM manipulation — use refs when needed.
- [ ] Unit tested in isolation with `renderHook`.
- [ ] Performance: State updates are batched/deferred if they cause heavy renders.
