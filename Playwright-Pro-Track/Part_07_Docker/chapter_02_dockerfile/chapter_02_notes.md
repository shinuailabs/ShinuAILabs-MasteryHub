# Part 02: Dockerfile

## 📚 Overview
Dockerfile defines instructions to build custom Docker images for your applications.

---

## 🎯 Key Concepts

### 1. Basic Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Dockerfile Instructions

```dockerfile
# FROM - Base image
FROM node:18-alpine

# WORKDIR - Set working directory
WORKDIR /app

# COPY - Copy files from host to container
COPY package.json ./
COPY src/ ./src/

# ADD - Copy with URL support and auto-extract
ADD https://example.com/file.tar.gz /app/

# RUN - Execute commands during build
RUN npm install
RUN apt-get update && apt-get install -y curl

# ENV - Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# ARG - Build-time variables
ARG VERSION=1.0
RUN echo "Building version $VERSION"

# EXPOSE - Document exposed ports
EXPOSE 3000

# CMD - Default command to run
CMD ["npm", "start"]

# ENTRYPOINT - Main executable
ENTRYPOINT ["node", "server.js"]
```

### 3. Playwright Dockerfile

```dockerfile
# Dockerfile for Playwright tests
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]
```

### 4. Multi-Stage Build

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
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### 5. Test Stage Dockerfile

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
COPY . .
CMD ["npm", "start"]
```

### 6. Optimized Dockerfile

```dockerfile
FROM node:18-alpine

# Install system dependencies first (cached layer)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Playwright to use installed Chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy package files (cached if unchanged)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files (changes frequently)
COPY . .

CMD ["npx", "playwright", "test"]
```

### 7. .dockerignore

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
Dockerfile
docker-compose.yml
README.md
.vscode
coverage
test-results
playwright-report
```

### 8. Build Commands

```bash
# Build image
docker build -t my-tests .

# Build with tag
docker build -t my-tests:v1.0 .

# Build with build args
docker build --build-arg VERSION=1.0 -t my-tests .

# Build specific stage
docker build --target test -t my-tests:test .

# Build without cache
docker build --no-cache -t my-tests .

# Build with different Dockerfile
docker build -f Dockerfile.test -t my-tests .
```

### 9. Layer Caching

```dockerfile
# ✅ Good: Leverage layer caching
FROM node:18-alpine
WORKDIR /app

# Dependencies change less frequently
COPY package*.json ./
RUN npm ci

# Source changes frequently
COPY . .

# ❌ Bad: Invalidates cache on any change
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
```

---

## 💻 Practice Exercises

1. Create basic Dockerfile
2. Build Playwright test image
3. Use multi-stage builds
4. Optimize layer caching
5. Create .dockerignore

---

## ✅ Best Practices

- ✅ Use specific base image tags
- ✅ Minimize layers
- ✅ Use multi-stage builds
- ✅ Leverage layer caching
- ✅ Use .dockerignore
- ❌ Don't include secrets
- ❌ Avoid running as root

---

## 📝 Quick Reference

```dockerfile
# Essential instructions
FROM image:tag          # Base image
WORKDIR /app            # Working directory
COPY src dest           # Copy files
RUN command             # Execute command
ENV KEY=value           # Environment variable
EXPOSE port             # Document port
CMD ["cmd", "arg"]      # Default command

# Build
docker build -t name:tag .
docker build --target stage -t name .
```

