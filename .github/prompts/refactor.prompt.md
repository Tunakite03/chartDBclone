# Refactor

## Target
- File/Module: <path to refactor>
- Current problem: <why refactor - complexity, duplication, readability>
- Goal: <desired outcome>

## Instructions
1. Read the entire file/module and understand all its responsibilities.
2. Identify all callers/consumers of the code being refactored.
3. Plan the refactoring steps (each step should leave code working).
4. Make incremental changes. Each step must keep all tests passing.
5. Do NOT change external behavior. Same inputs -> same outputs.
6. Update tests if internal structure changes, but test the same behaviors.

## Constraints
- Zero behavior changes. This is a pure refactor.
- All existing tests must pass after refactoring.
- Do not change function signatures used by other modules.
- Each commit should be a single, reviewable logical step.

## Deliverables
1. **Analysis** - current problems identified
2. **Plan** - step-by-step refactoring approach
3. **Changes** - incremental code changes
4. **Verification** - all tests pass, no behavior change
