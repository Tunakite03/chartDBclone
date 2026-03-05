# Write Tests

## Target
- File/Function: <path to test>
- Test file: <path to test file, or "create new">

## Instructions
1. Read the source code thoroughly. Understand all code paths.
2. Identify test scenarios:
   - Happy path (normal usage)
   - Edge cases (empty, null, boundary values, max/min)
   - Error cases (invalid input, network failure, timeout)
   - Concurrent/race conditions (if applicable)
3. Write tests using Arrange-Act-Assert pattern.
4. Use descriptive test names: `should <expected> when <condition>`.
5. Mock external dependencies (API calls, DB, file system).
6. Tests must be deterministic - mock time, random, network.

## Test Template
```
describe("<ModuleName>", () => {
  describe("<functionName>", () => {
    it("should <expected behavior> when <condition>", () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Constraints
- Do NOT test implementation details. Test behavior.
- Do NOT mock the module under test.
- Each test should be independent (no shared mutable state).
- Reset all mocks between tests.
