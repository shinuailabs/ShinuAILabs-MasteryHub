# Lab 654: Image Best Practices

## LEARNING CONCEPT

Comprehensive best practices for Docker images.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Validate compliance

## SOLUTION

### Base Image Best Practices

```dockerfile
# ✅ Use specific versions
FROM node:18.19.0-alpine3.19

# ✅ Use official images
FROM nginx:1.25

# ✅ Use minimal images
FROM node:18-alpine  # Not node:18

# ✅ Pin digest for critical apps
FROM node@sha256:abc123...
```

### Build Best Practices

```dockerfile
# ✅ Use multi-stage builds
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/app.js"]

# ✅ Order layers by change frequency
COPY package*.json ./  # Changes less often
RUN npm ci
COPY . .               # Changes more often

# ✅ Combine RUN commands
RUN apt-get update && \
    apt-get install -y package && \
    rm -rf /var/lib/apt/lists/*
```

### Security Best Practices

```dockerfile
# ✅ Run as non-root
RUN addgroup -S app && adduser -S app -G app
USER app

# ✅ Don't store secrets
# Use runtime environment variables instead

# ✅ Use COPY instead of ADD
COPY . .  # Not ADD . .

# ✅ Scan images regularly
# docker scout cves my-app
```

### Size Best Practices

```dockerfile
# ✅ Use .dockerignore
# node_modules, .git, *.md, tests

# ✅ Clean up in same layer
RUN npm ci && npm cache clean --force

# ✅ Remove unnecessary files
RUN rm -rf /tmp/* /var/tmp/*

# ✅ Use --no-install-recommends
RUN apt-get install -y --no-install-recommends package
```

### Tagging Best Practices

```bash
# ✅ Use semantic versioning
docker tag my-app:latest my-app:1.2.3

# ✅ Include git hash
docker tag my-app:latest my-app:$(git rev-parse --short HEAD)

# ✅ Avoid 'latest' in production
docker pull my-app:1.2.3  # Not my-app:latest
```

### Documentation Best Practices

```dockerfile
# ✅ Add labels
LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL description="My application"

# ✅ Document exposed ports
EXPOSE 3000

# ✅ Add health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3000/health || exit 1
```

### Complete Example

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18.19.0-alpine3.19 AS builder

LABEL maintainer="team@example.com"
LABEL version="1.0.0"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --production

FROM node:18.19.0-alpine3.19

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/app.js"]
```

### Checklist

```
□ Use specific base image version
□ Use minimal base image
□ Use multi-stage builds
□ Run as non-root user
□ Use .dockerignore
□ Combine RUN commands
□ Clean up in same layer
□ Add health check
□ Add labels
□ Scan for vulnerabilities
□ Use semantic versioning
□ Document the image
```

