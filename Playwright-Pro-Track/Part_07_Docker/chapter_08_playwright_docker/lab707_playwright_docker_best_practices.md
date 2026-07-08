# Lab 707: Playwright Docker Best Practices

## LEARNING CONCEPT

Comprehensive best practices for Playwright with Docker.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Optimize performance

## SOLUTION

### Dockerfile Best Practices

```dockerfile
# Use specific version
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files first (caching)
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

# Non-root user (if needed)
# USER pwuser

CMD ["npx", "playwright", "test"]
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
coverage
.nyc_output
```

### Docker Compose Best Practices

```yaml
version: '3.8'
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      # Source code
      - .:/app:ro
      # Writable artifacts
      - ./playwright-report:/app/playwright-report
      - ./test-results:/app/test-results
    environment:
      - CI=true
      - BASE_URL=${BASE_URL:-http://app:3000}
    depends_on:
      app:
        condition: service_healthy
    networks:
      - test-network

  app:
    build: ./app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks:
      - test-network

networks:
  test-network:
```

### Performance Optimization

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  
  // Faster retries
  retries: process.env.CI ? 2 : 0,
  
  // Timeouts
  timeout: 30000,
  expect: { timeout: 5000 },
  
  // Artifacts only on failure
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});
```

### CI/CD Best Practices

```yaml
# GitHub Actions
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      - run: npm ci
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Security Best Practices

```yaml
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    volumes:
      - .:/app:ro
      - ./playwright-report:/app/playwright-report
```

### Environment Management

```bash
# .env.example
BASE_URL=http://localhost:3000
CI=true
PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Use in compose
services:
  playwright:
    env_file:
      - .env
      - .env.${ENVIRONMENT:-development}
```

### Debugging Setup

```yaml
services:
  playwright-debug:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
    environment:
      - CI=false
      - PWDEBUG=1
    stdin_open: true
    tty: true
    command: bash
    profiles:
      - debug
```

### Checklist

```
Dockerfile:
□ Use specific image version
□ Copy package.json first
□ Use .dockerignore
□ Set CI=true
□ Configure artifact directories

Docker Compose:
□ Use health checks
□ Configure depends_on
□ Mount artifact volumes
□ Use environment variables
□ Set up networks properly

CI/CD:
□ Cache dependencies
□ Upload artifacts
□ Use matrix for sharding
□ Set appropriate timeouts
□ Handle failures gracefully

Performance:
□ Enable parallel execution
□ Use sharding for large suites
□ Optimize timeouts
□ Capture artifacts only on failure
```

### Common Mistakes

```
❌ Using :latest tag
❌ Not mounting artifact volumes
❌ Missing health checks
❌ Hardcoding URLs
❌ Not setting CI=true
❌ Ignoring .dockerignore
❌ Not caching dependencies
```

