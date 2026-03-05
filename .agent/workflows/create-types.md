# Skill: Design TypeScript Types

## Prefer interfaces for object shapes
```typescript
interface User {
  readonly id: string;
  email: string;
  createdAt: Date;
}
```

## Discriminated unions for state
```typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

## Const object + derived union (prefer over enum)
```typescript
const ROLE = { Admin: 'admin', User: 'user', Guest: 'guest' } as const;
type Role = (typeof ROLE)[keyof typeof ROLE];
```

## Branded types for primitives
```typescript
type UserId = string & { readonly _brand: 'UserId' };
const toUserId = (id: string): UserId => id as UserId;
```

## Checklist
- [ ] No `any` — use `unknown` + type guard if type is truly unknown.
- [ ] No unconstrained generics — use `<T extends Base>`.
- [ ] Readonly where mutation is unintended.
- [ ] `import type` for type-only imports.
