# Lab 672: Dockerfile Best Practices

## LEARNING CONCEPT

Comprehensive Dockerfile best practices.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Validate compliance

## SOLUTION

### Base Image Best Practices

```dockerfile
# ✅ Use specific versions
FROM node:18.19.0-alpine3.19

# ✅ Use minimal images
FROM node:18-alpine

# ✅ Use official images
FROM nginx:1.25

# ❌ Avoid latest
FROM node:latest
```

### Layer Optimization

```dockerfile
# ✅ Order by change frequency
COPY package*.json ./
RUN npm ci
COPY . .

# ✅ Combine RUN commands
RUN apt-get update && \
    apt-get install -y package && \
    rm -rf /var/lib/apt/lists/*

# ✅ Clean up in same layer
RUN npm ci && npm cache clean --force
```

### Security Best Practices

```dockerfile
# ✅ Run as non-root
RUN addgroup -S app && adduser -S app -G app
USER app

# ✅ Use COPY instead of ADD
COPY file.txt /app/

# ✅ Don't store secrets
# Use runtime environment variables
```

### Build Optimization

```dockerfile
# ✅ Use multi-stage builds
FROM node:18 AS builder
RUN npm run build

FROM node:18-alpine
COPY --from=builder /app/dist ./dist

# ✅ Use .dockerignore
# node_modules, .git, *.md
```

### Documentation

```dockerfile
# ✅ Add labels
LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL description="My application"

# ✅ Document ports
EXPOSE 3000

# ✅ Add health check
HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1
```

### Complete Best Practice Dockerfile

```dockerfile
# syntax=docker/dockerfile:1

# Build stage
FROM node:18.19.0-alpine3.19 AS builder

WORKDIR /app

# Dependencies (cached)
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build && npm prune --production

# Production stage
FROM node:18.19.0-alpine3.19

# Labels
LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/org/repo"

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy built application
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER app

# Document port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/app.js"]
```

### Checklist

```
Base Image:
□ Use specific version tag
□ Use minimal base image
□ Use official images

Layers:
□ Order by change frequency
□ Combine RUN commands
□ Clean up in same layer

Security:
□ Run as non-root user
□ Use COPY instead of ADD
□ Don't store secrets
□ Scan for vulnerabilities

Build:
□ Use multi-stage builds
□ Use .dockerignore
□ Optimize for caching

Documentation:
□ Add labels
□ Document exposed ports
□ Add health check
□ Include README
```

### Anti-Patterns to Avoid

```dockerfile
# ❌ Using latest tag
FROM node:latest

# ❌ Running as root
# (no USER instruction)

# ❌ Storing secrets
ENV API_KEY=secret123

# ❌ Not using .dockerignore
COPY . .  # Includes node_modules, .git

# ❌ Multiple RUN for related commands
RUN apt-get update
RUN apt-get install -y curl

# ❌ Not cleaning up
RUN apt-get install -y curl
# (no cleanup)
```

