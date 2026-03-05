# Skill: Design a REST API

## URL Conventions
- Nouns, not verbs: \`/users\` not \`/getUsers\`.
- Plural resource names: \`/users\`, \`/orders\`, \`/products\`.
- Nest for relationships: \`/users/:id/orders\`.
- Use kebab-case: \`/order-items\` not \`/orderItems\`.
- Version prefix: \`/api/v1/users\`.

## HTTP Methods
| Method | Purpose | Idempotent | Response |
|--------|---------|------------|----------|
| GET | Read | Yes | 200, 404 |
| POST | Create | No | 201, 400, 409 |
| PUT | Full replace | Yes | 200, 404 |
| PATCH | Partial update | No | 200, 404 |
| DELETE | Remove | Yes | 204, 404 |

## Response Format
\`\`\`json
// Success (single)
{ "data": { "id": "1", "name": "Alice" } }

// Success (list)
{ "data": [...], "meta": { "page": 1, "limit": 20, "total": 142 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
\`\`\`

## Pagination
- Use cursor-based for infinite scroll: \`?cursor=abc&limit=20\`.
- Use offset-based for page navigation: \`?page=1&limit=20\`.
- Always return total count and next cursor/page link.

## Filtering & Sorting
- Filter: \`?status=active&role=admin\`.
- Sort: \`?sort=created_at:desc,name:asc\`.
- Search: \`?q=search+term\`.

## Checklist
- [ ] All endpoints follow RESTful conventions.
- [ ] Consistent response shape across all endpoints.
- [ ] Pagination on all list endpoints.
- [ ] Input validation with clear error messages.
- [ ] Rate limiting on public endpoints.
- [ ] API versioning strategy defined.
- [ ] Authentication/authorization on protected routes.
- [ ] OpenAPI/Swagger documentation generated.
