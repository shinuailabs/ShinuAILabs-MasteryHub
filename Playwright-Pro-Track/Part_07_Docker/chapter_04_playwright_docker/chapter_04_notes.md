# Part 04: Playwright with Docker

## 📚 Overview
Running Playwright tests in Docker ensures consistent test environments across all machines.

---

## 🎯 Key Concepts

### 1. Official Playwright Image

```bash
# Pull official Playwright image
docker pull mcr.microsoft.com/playwright:v1.40.0-jammy

# Run tests
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.40.0-jammy \
  npx playwright test
```

### 2. Playwright Dockerfile

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test files
COPY . .

# Default command
CMD ["npx", "playwright", "test"]
```

### 3. Custom Playwright Image

```dockerfile
# Dockerfile.playwright
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Install additional tools
RUN apt-get update && apt-get install -y \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY playwright.config.ts ./
COPY tests/ ./tests/
COPY pages/ ./pages/

# Create directories for reports
RUN mkdir -p test-results playwright-report

# Set environment
ENV CI=true

CMD ["npx", "playwright", "test"]
```

### 4. Docker Compose for Playwright

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: ./app
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 5s
      timeout: 3s
      retries: 10

  playwright:
    build:
      context: .
      dockerfile: Dockerfile.playwright
    depends_on:
      app:
        condition: service_healthy
    environment:
      - BASE_URL=http://app:3000
      - CI=true
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
```

### 5. Running Tests

```bash
# Build and run
docker build -t playwright-tests .
docker run --rm playwright-tests

# Run with volume for reports
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-tests

# Run specific tests
docker run --rm playwright-tests npx playwright test login.spec.ts

# Run with grep
docker run --rm playwright-tests npx playwright test --grep "login"

# Run in headed mode (requires X11)
docker run --rm \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  playwright-tests npx playwright test --headed
```

### 6. Playwright Config for Docker

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Increase timeout for Docker
  timeout: 60000,
  
  // Use base URL from environment
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Headless in Docker
    headless: true,
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  // Output directory
  outputDir: 'test-results',
  
  // Retry on CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers
  workers: process.env.CI ? 4 : undefined,
});
```

### 7. Multi-Browser Testing

```dockerfile
# Dockerfile with all browsers
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Run all browsers
CMD ["npx", "playwright", "test", "--project=chromium", "--project=firefox", "--project=webkit"]
```

```yaml
# docker-compose.yml for parallel browsers
version: '3.8'

services:
  chromium:
    build: .
    command: npx playwright test --project=chromium
    volumes:
      - ./results/chromium:/app/test-results

  firefox:
    build: .
    command: npx playwright test --project=firefox
    volumes:
      - ./results/firefox:/app/test-results

  webkit:
    build: .
    command: npx playwright test --project=webkit
    volumes:
      - ./results/webkit:/app/test-results
```

### 8. CI Integration

```yaml
# .github/workflows/test.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and run tests
        run: |
          docker-compose up --build --abort-on-container-exit
      
      - name: Upload reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 💻 Practice Exercises

1. Create Playwright Dockerfile
2. Set up Docker Compose
3. Configure for CI
4. Run multi-browser tests
5. Extract test reports

---

## ✅ Best Practices

- ✅ Use official Playwright images
- ✅ Pin image versions
- ✅ Use health checks
- ✅ Mount volumes for reports
- ❌ Don't run headed in Docker
- ❌ Avoid large images

---

## 📝 Quick Reference

```bash
# Run Playwright in Docker
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.40.0-jammy \
  npx playwright test

# With reports
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  playwright-tests

# Docker Compose
docker-compose up --build --abort-on-container-exit
```

