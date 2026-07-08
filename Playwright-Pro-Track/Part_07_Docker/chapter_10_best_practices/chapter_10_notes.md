# Part 10: Docker Best Practices

## 📚 Overview
Following Docker best practices ensures efficient, secure, and maintainable containerized test environments.

---

## 🎯 Key Concepts

### 1. Image Optimization

```dockerfile
# ✅ Good: Use specific tags
FROM node:18.19-alpine

# ❌ Bad: Use latest tag
FROM node:latest

# ✅ Good: Use slim/alpine images
FROM node:18-alpine          # ~180MB
FROM node:18-slim            # ~240MB

# ❌ Bad: Use full images
FROM node:18                 # ~1GB
```

### 2. Layer Optimization

```dockerfile
# ✅ Good: Combine RUN commands
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# ❌ Bad: Separate RUN commands
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# ✅ Good: Order by change frequency
COPY package*.json ./
RUN npm ci
COPY . .

# ❌ Bad: Copy everything first
COPY . .
RUN npm ci
```

### 3. Security Best Practices

```dockerfile
# ✅ Good: Run as non-root user
FROM node:18-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app

# ✅ Good: Use specific versions
FROM node:18.19.0-alpine3.19

# ✅ Good: Scan for vulnerabilities
# docker scan my-image

# ❌ Bad: Run as root
FROM node:18
WORKDIR /app
# Running as root by default
```

### 4. .dockerignore

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
Dockerfile*
docker-compose*
README.md
.vscode
.idea
coverage
test-results
playwright-report
*.log
```

### 5. Health Checks

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
services:
  app:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
```

### 6. Resource Limits

```yaml
# docker-compose.yml
services:
  tests:
    build: .
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

```bash
# Command line
docker run --memory=4g --cpus=2 playwright-tests
```

### 7. Logging Best Practices

```yaml
# docker-compose.yml
services:
  app:
    build: .
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

```dockerfile
# Use structured logging
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV LOG_FORMAT=json
```

### 8. Multi-Stage for Production

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### 9. Cleanup and Maintenance

```bash
# Remove unused resources
docker system prune -a

# Remove dangling images
docker image prune

# Remove stopped containers
docker container prune

# Remove unused volumes
docker volume prune

# Scheduled cleanup in CI
docker system prune -af --volumes
```

### 10. Documentation

```dockerfile
# Dockerfile
# Description: Playwright test container
# Author: Team Name
# Version: 1.0.0

FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Labels for metadata
LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL description="Playwright E2E tests"

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy test files
COPY . .

# Default command
CMD ["npx", "playwright", "test"]
```

---

## 💻 Practice Exercises

1. Optimize Dockerfile layers
2. Implement security practices
3. Add health checks
4. Set resource limits
5. Create comprehensive .dockerignore

---

## ✅ Best Practices Summary

- ✅ Use specific image tags
- ✅ Use alpine/slim images
- ✅ Run as non-root user
- ✅ Optimize layer caching
- ✅ Use multi-stage builds
- ✅ Add health checks
- ✅ Set resource limits
- ✅ Use .dockerignore
- ❌ Don't use `latest` tag
- ❌ Don't run as root
- ❌ Don't include secrets
- ❌ Don't skip cleanup

---

## 📝 Quick Reference

```dockerfile
# Optimized Dockerfile
FROM node:18-alpine
RUN adduser -S app
USER app
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
HEALTHCHECK CMD curl -f http://localhost:3000
CMD ["node", "index.js"]
```

```bash
# Maintenance
docker system prune -a
docker image prune
docker volume prune
```