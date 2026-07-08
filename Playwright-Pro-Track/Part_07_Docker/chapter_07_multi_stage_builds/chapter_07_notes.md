# Part 07: Multi-Stage Builds

## 📚 Overview
Multi-stage builds create optimized images by separating build and runtime environments.

---

## 🎯 Key Concepts

### 1. Basic Multi-Stage Build

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
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### 2. Test Stage Build

```dockerfile
# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies
RUN npm ci

# Test stage
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS test
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
CMD ["npx", "playwright", "test"]

# Production stage
FROM base AS production
RUN npm ci --only=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

### 3. Building Specific Stages

```bash
# Build test stage
docker build --target test -t my-app:test .

# Build production stage
docker build --target production -t my-app:prod .

# Build all stages
docker build -t my-app .
```

### 4. Playwright Multi-Stage

```dockerfile
# Dependencies stage
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Test base stage
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS test-base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY playwright.config.ts ./
COPY tests/ ./tests/
COPY pages/ ./pages/

# Chromium tests
FROM test-base AS test-chromium
CMD ["npx", "playwright", "test", "--project=chromium"]

# Firefox tests
FROM test-base AS test-firefox
CMD ["npx", "playwright", "test", "--project=firefox"]

# All browsers
FROM test-base AS test-all
CMD ["npx", "playwright", "test"]
```

### 5. Optimized Layer Caching

```dockerfile
# Stage 1: Dependencies (cached)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build (cached if source unchanged)
FROM deps AS builder
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 3: Test dependencies
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS test-deps
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Stage 4: Tests
FROM test-deps AS tests
COPY playwright.config.ts ./
COPY tests/ ./tests/
CMD ["npx", "playwright", "test"]

# Stage 5: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### 6. Copying Between Stages

```dockerfile
FROM node:18 AS builder
WORKDIR /app
RUN npm run build

FROM nginx:alpine AS production
# Copy from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy from external image
COPY --from=mcr.microsoft.com/playwright:v1.40.0-jammy \
  /ms-playwright /ms-playwright
```

### 7. Development vs Production

```dockerfile
# Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Production dependencies
FROM base AS prod-deps
RUN npm ci --only=production

# Build
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]
```

### 8. Docker Compose with Stages

```yaml
# docker-compose.yml
version: '3.8'

services:
  app-dev:
    build:
      context: .
      target: development
    volumes:
      - .:/app
    ports:
      - "3000:3000"

  app-prod:
    build:
      context: .
      target: production
    ports:
      - "3000:3000"

  tests:
    build:
      context: .
      target: tests
    depends_on:
      - app-dev
```

### 9. Size Comparison

```dockerfile
# Single stage (large)
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/index.js"]
# Result: ~1GB

# Multi-stage (optimized)
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
# Result: ~200MB
```

---

## 💻 Practice Exercises

1. Create multi-stage Dockerfile
2. Build specific stages
3. Optimize layer caching
4. Separate dev and prod stages
5. Compare image sizes

---

## ✅ Best Practices

- ✅ Use alpine images for production
- ✅ Separate build and runtime
- ✅ Copy only necessary files
- ✅ Use specific stage names
- ❌ Don't include dev dependencies in prod
- ❌ Avoid copying entire node_modules

---

## 📝 Quick Reference

```dockerfile
# Multi-stage pattern
FROM image AS stage1
RUN build commands

FROM image AS stage2
COPY --from=stage1 /path /path

# Build specific stage
docker build --target stage -t name .

# Copy from external image
COPY --from=other-image /path /path
```

