---
applyTo: "**"
---
# Security Rules

## Secrets
- NEVER hardcode secrets, API keys, tokens, or passwords in source code.
- Use environment variables or secret managers.
- NEVER log secrets, tokens, or PII (personally identifiable information).
- Add secret patterns to `.gitignore` (`.env`, `*.pem`, `*.key`).

## Input Validation
- Validate ALL external inputs: HTTP requests, CLI args, file contents, env vars.
- Use allowlists, not blocklists for input validation.
- Sanitize user input before rendering (prevent XSS).
- Use parameterized queries for databases (prevent SQL injection).
- Validate file paths to prevent path traversal (`../` attacks).

## Authentication & Authorization
- Check auth on every request, not just at the route level.
- Use constant-time comparison for secrets/tokens.
- Hash passwords with bcrypt/argon2. Never store plaintext.
- Set appropriate token expiration times.

## Headers & Transport
- Use HTTPS everywhere. Set HSTS headers.
- Configure Content-Security-Policy (CSP).
- Set `X-Content-Type-Options: nosniff`.
- Configure CORS with specific origins, not `*` in production.
