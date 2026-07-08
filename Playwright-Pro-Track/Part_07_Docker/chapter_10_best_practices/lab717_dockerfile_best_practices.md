# Lab 717: Dockerfile Best Practices

## LEARNING CONCEPT

Writing efficient and secure Dockerfiles.

## EXERCISE

1. Apply Dockerfile best practices
2. Optimize for production
3. Implement security measures

## SOLUTION

### Use Specific Base Images

```dockerfile
# ❌ Bad - unpredictable
FROM node:latest

# ✅ Good - specific version
FROM node:18.19.0-alpine3.19
```

### Minimize Layers

```dockerfile
# ❌ Bad - multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Good - single layer
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Order for Caching

```dockerfile
# ✅ Good - dependencies first (change less often)
FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (cached if package.json unchanged)
RUN npm ci

# Copy source code (changes frequently)
COPY . .

RUN npm run build
```

### Use Multi-Stage Builds

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/index.js"]
```

### Run as Non-Root

```dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

COPY --chown=appuser:appgroup . .

USER appuser

CMD ["node", "index.js"]
```

### Use .dockerignore

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
*.md
.env*
coverage
test-results
```

### Set Proper Labels

```dockerfile
FROM node:18-alpine

LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL description="My application"
LABEL org.opencontainers.image.source="https://github.com/user/repo"
```

### Health Checks

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm ci

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
```

### Security Best Practices

```dockerfile
FROM node:18-alpine

# Don't run as root
USER node

# Read-only filesystem (use tmpfs for writable)
# docker run --read-only --tmpfs /tmp myapp

# Drop capabilities
# docker run --cap-drop=ALL myapp

# No new privileges
# docker run --security-opt=no-new-privileges myapp

WORKDIR /app
COPY --chown=node:node . .
RUN npm ci --only=production

CMD ["node", "index.js"]
```

### Environment Variables

```dockerfile
# Use ARG for build-time variables
ARG NODE_ENV=production

# Use ENV for runtime variables
ENV NODE_ENV=${NODE_ENV}

# Don't hardcode secrets
# Use docker secrets or environment variables at runtime
```

### Complete Example

```dockerfile
FROM node:18.19.0-alpine3.19 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18.19.0-alpine3.19

LABEL maintainer="team@example.com"
LABEL version="1.0.0"

RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

