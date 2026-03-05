---
applyTo: "**/*.{ts,tsx,js,jsx}"
---
# Performance Rules

## Principles
- Correctness FIRST, then optimize when measured to be slow.
- Profile before optimizing. Don't guess bottlenecks.
- Document WHY an optimization was made (with benchmarks if possible).

## Data Fetching
- Avoid N+1 queries. Use batch loading, joins, or DataLoader.
- Paginate list responses. Never return unbounded result sets.
- Use database indexes for frequently filtered/sorted columns.
- Cache expensive queries / computations with appropriate TTL.

## Frontend
- Lazy load routes and heavy components (`React.lazy` / dynamic import).
- Debounce user input handlers (search, resize, scroll).
- Virtualize long lists (react-window, tanstack-virtual).
- Optimize images: proper format, sizing, lazy loading.
- Minimize re-renders: `React.memo`, `useMemo`, `useCallback` when measurably helpful.

## Backend
- Stream large responses instead of buffering.
- Use connection pooling for databases.
- Avoid synchronous I/O in request handlers.
- Set appropriate cache headers (ETags, Cache-Control).
