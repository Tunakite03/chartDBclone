# Code Review

## What to Review
- File(s): <file paths or PR link>
- Context: <what the change is about>

## Review Checklist
Analyze the code for:

### Correctness
- Does the logic handle all cases correctly?
- Are edge cases handled (null, empty, max/min, concurrent)?
- Are error paths handled properly?

### Security
- Any hardcoded secrets or credentials?
- Is user input validated and sanitized?
- Are there SQL injection, XSS, or path traversal risks?

### Performance
- Any N+1 queries or unbounded loops?
- Is there unnecessary data fetching or computation?
- Are there memory leaks (unclosed resources, growing arrays)?

### Maintainability
- Are functions small and single-purpose?
- Is naming clear and consistent?
- Could future developers understand this code easily?

### Testing
- Are tests comprehensive? (happy path + edge cases + errors)
- Are tests deterministic?
- Is test coverage adequate for the change?

## Output Format
For each issue found:
- **Severity**: critical / warning / suggestion / nit
- **Location**: file:line
- **Issue**: what is wrong
- **Fix**: suggested improvement
