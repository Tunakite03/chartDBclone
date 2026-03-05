# Skill: Docker & Deployment

## Dockerfile Best Practices
\`\`\`dockerfile
# Multi-stage build for minimal production image
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]
\`\`\`

## Docker Rules
- Use multi-stage builds to minimize image size.
- Pin base image versions (e.g., \`node:20.11-alpine\`, not \`node:latest\`).
- Run as non-root user. Never run containers as root in production.
- Use \`.dockerignore\` to exclude: \`node_modules\`, \`.git\`, \`.env\`, tests, docs.
- One process per container. Use Docker Compose for multi-service setups.
- Health checks: \`HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1\`.

## Docker Compose Template
\`\`\`yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on:
      db: { condition: service_healthy }
    restart: unless-stopped
  db:
    image: postgres:16-alpine
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myapp"]
      interval: 5s
      timeout: 3s
      retries: 5
volumes:
  pgdata:
\`\`\`

## CI/CD Checklist
- [ ] Linting and type checking pass.
- [ ] All tests pass (unit + integration).
- [ ] Docker image builds successfully.
- [ ] Security scanning on image (Trivy, Snyk).
- [ ] Environment variables documented and validated.
- [ ] Database migrations run before deployment.
- [ ] Health check endpoint verified post-deploy.
- [ ] Rollback plan documented and tested.
