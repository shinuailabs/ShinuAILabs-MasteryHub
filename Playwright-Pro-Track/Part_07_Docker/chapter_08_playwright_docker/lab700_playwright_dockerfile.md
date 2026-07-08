# Lab 700: Playwright Dockerfile

## LEARNING CONCEPT

Creating optimized Dockerfiles for Playwright tests.

## EXERCISE

1. Create production Dockerfile
2. Optimize for CI
3. Implement multi-stage builds

## SOLUTION

### Basic Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

### Optimized Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
COPY playwright.config.ts ./

# Install dependencies
RUN npm ci

# Copy test files
COPY tests/ ./tests/
COPY pages/ ./pages/

# Set environment
ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Run tests
CMD ["npx", "playwright", "test"]
```

### Multi-Stage Build

```dockerfile
# Stage 1: Install dependencies
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Run tests
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy test files
COPY . .

ENV CI=true

CMD ["npx", "playwright", "test"]
```

### TypeScript Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY tests/ ./tests/
COPY pages/ ./pages/
COPY fixtures/ ./fixtures/
COPY playwright.config.ts ./

ENV CI=true

CMD ["npx", "playwright", "test"]
```

### With Custom Browser Installation

```dockerfile
FROM node:18-slim

# Install dependencies for browsers
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npx playwright install chromium

COPY . .

CMD ["npx", "playwright", "test", "--project=chromium"]
```

### Development Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Don't copy files - use volume mount
# COPY . .

# Keep container running for development
CMD ["tail", "-f", "/dev/null"]
```

### .dockerignore

```
node_modules
playwright-report
test-results
.git
.gitignore
*.md
.env*
```

### Build Arguments

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

ARG NODE_ENV=production
ARG BASE_URL=https://example.com

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=${NODE_ENV}
ENV BASE_URL=${BASE_URL}
ENV CI=true

CMD ["npx", "playwright", "test"]
```

```bash
# Build with arguments
docker build \
    --build-arg NODE_ENV=test \
    --build-arg BASE_URL=https://staging.example.com \
    -t playwright-tests .
```

### Health Check

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

CMD ["npx", "playwright", "test"]
```

### Best Practices

```
✅ Use official Playwright images
✅ Copy package.json first for caching
✅ Use .dockerignore
✅ Set CI=true
✅ Use specific image versions
✅ Multi-stage for smaller images
```

