# Skill: Create a TypeScript Service

## Template
```typescript
// src/services/<name>.service.ts
import type { <InputType>, <ReturnType> } from '../types';

export interface <Name>ServiceDeps {
  // inject DB, logger, other services here
}

export class <Name>Service {
  constructor(private readonly deps: <Name>ServiceDeps) {}

  async <methodName>(input: <InputType>): Promise<<ReturnType>> {
    // 1. Validate input
    // 2. Execute core logic
    // 3. Return result
  }
}
```

## Checklist
- [ ] All public methods have explicit return types.
- [ ] Input validated at the start of each method.
- [ ] Dependencies injected via constructor (no global imports).
- [ ] Unit tests mock all injected dependencies.
- [ ] Errors thrown as typed custom error classes.
