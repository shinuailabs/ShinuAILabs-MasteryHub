# Lab 650: Image Optimization

## LEARNING CONCEPT

Optimizing Docker images for size and performance.

### Optimization Goals:
- Reduce image size
- Improve build speed
- Enhance security
- Better caching

## EXERCISE

1. Analyze image size
2. Apply optimizations
3. Measure improvements

## SOLUTION

### Analyze Image Size

```bash
# Check image size
docker images my-app

# Detailed size breakdown
docker history my-app

# System disk usage
docker system df -v

# Use dive tool for analysis
# brew install dive
dive my-app:latest
```

### Use Smaller Base Images

```dockerfile
# Before: 1.1GB
FROM node:18

# After: 180MB
FROM node:18-alpine
```

### Multi-Stage Builds

```dockerfile
# Build stage
FROM node:18 AS builder
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
CMD ["node", "dist/app.js"]
```

### Minimize Layers

```dockerfile
# ❌ Multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# ✅ Single layer with cleanup
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        git && \
    rm -rf /var/lib/apt/lists/*
```

### Use .dockerignore

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
tests
coverage
.nyc_output
```

### Remove Unnecessary Files

```dockerfile
# Remove package manager cache
RUN npm ci && npm cache clean --force

# Remove build dependencies
RUN apk add --no-cache --virtual .build-deps \
        python3 \
        make \
        g++ && \
    npm ci && \
    apk del .build-deps

# Remove unnecessary files
RUN rm -rf /tmp/* /var/tmp/*
```

### Optimize for Caching

```dockerfile
# Order by change frequency
FROM node:18-alpine

# Rarely changes
WORKDIR /app

# Changes occasionally
COPY package*.json ./
RUN npm ci --only=production

# Changes frequently
COPY . .

CMD ["node", "app.js"]
```

### Production Optimizations

```dockerfile
FROM node:18-alpine

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

COPY . .

# Run as non-root
USER node

CMD ["node", "app.js"]
```

### Size Comparison Example

```bash
# Before optimization
# my-app:unoptimized  1.2GB

# After optimization
# my-app:optimized    150MB

# Savings: ~90%
```

### Optimization Checklist

```
□ Use minimal base image (alpine/slim)
□ Use multi-stage builds
□ Combine RUN commands
□ Clean up in same layer
□ Use .dockerignore
□ Remove dev dependencies
□ Remove cache files
□ Order layers by change frequency
□ Use --no-install-recommends
□ Run as non-root user
```

