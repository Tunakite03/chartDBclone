---
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx}"
---
# Testing Rules

## When to Write Tests
- Every new feature must have tests.
- Every bug fix must have a regression test.
- Refactors must not break existing tests.
- Test edge cases: empty inputs, null, boundaries, large datasets.

## Test Structure
- Arrange-Act-Assert (AAA) pattern.
- One assertion concept per test (can have multiple `expect` for one concept).
- Descriptive names: `should <expected behavior> when <condition>`.
- Group related tests with `describe` blocks.

## Test Quality
- Tests must be deterministic. Mock: time, random, network, file system.
- Prefer table-driven / parameterized tests for multiple similar cases.
- Test behavior, not implementation. Don't test private methods directly.
- Avoid testing framework internals or third-party library behavior.

## Mocking
- Mock at boundaries: HTTP calls, database, file system, external APIs.
- Do NOT mock the module under test.
- Use dependency injection to make code testable.
- Reset mocks between tests to prevent leakage.

## Coverage
- Aim for meaningful coverage, not 100% line coverage.
- Critical paths (auth, payments, data mutations) must have thorough tests.
- Integration tests for API endpoints and data flows.
- E2E tests for critical user journeys.
