# Lab 718: Image Optimization

## LEARNING CONCEPT

Optimizing Docker images for size and performance.

## EXERCISE

1. Reduce image size
2. Optimize build time
3. Improve runtime performance

## SOLUTION

### Use Alpine Base Images

```dockerfile
# ❌ Large image (~900MB)
FROM node:18

# ✅ Small image (~120MB)
FROM node:18-alpine

# ✅ Even smaller with slim (~200MB)
FROM node:18-slim
```

### Multi-Stage Builds

```dockerfile
# Build stage with all dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - minimal
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### Production Dependencies Only

```dockerfile
# Install only production dependencies
RUN npm ci --only=production

# Or with npm prune
RUN npm ci && npm run build && npm prune --production
```

### Remove Unnecessary Files

```dockerfile
RUN npm ci && \
    npm run build && \
    npm prune --production && \
    rm -rf src tests *.md .git
```

### Use Distroless Images

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Distroless runtime
FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/index.js"]
```

### Optimize Layer Order

```dockerfile
# ✅ Optimal order (least to most frequently changed)
FROM node:18-alpine

# 1. System dependencies (rarely change)
RUN apk add --no-cache curl

# 2. Package files (change occasionally)
COPY package*.json ./
RUN npm ci

# 3. Source code (changes frequently)
COPY . .
RUN npm run build
```

### Combine Commands

```dockerfile
# ❌ Multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# ✅ Single layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Use BuildKit

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Or in docker build
docker buildx build -t myapp .
```

### Cache Mounts

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Cache npm packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build
```

### Analyze Image Size

```bash
# View layer sizes
docker history myapp

# Detailed analysis with dive
docker run --rm -it \
    -v /var/run/docker.sock:/var/run/docker.sock \
    wagoodman/dive myapp
```

### Size Comparison

```bash
# Check image sizes
docker images --format "{{.Repository}}:{{.Tag}} {{.Size}}"

# Example sizes:
# node:18           ~900MB
# node:18-slim      ~200MB
# node:18-alpine    ~120MB
# distroless        ~100MB
```

### Best Practices Summary

```
✅ Use Alpine or slim base images
✅ Multi-stage builds
✅ Production dependencies only
✅ Remove unnecessary files
✅ Combine RUN commands
✅ Optimize layer order
✅ Use BuildKit
✅ Analyze with dive
```

