# Lab 699: Playwright Docker Basics

## LEARNING CONCEPT

Running Playwright tests in Docker containers.

### Benefits:
- Consistent test environment
- No local browser installation
- CI/CD integration
- Parallel execution

## EXERCISE

1. Use official Playwright image
2. Run tests in container
3. Configure for CI

## SOLUTION

### Official Playwright Images

```bash
# Available images
mcr.microsoft.com/playwright:v1.40.0-jammy      # Ubuntu 22.04
mcr.microsoft.com/playwright:v1.40.0-focal      # Ubuntu 20.04

# Pull image
docker pull mcr.microsoft.com/playwright:v1.40.0-jammy
```

### Run Tests with Docker

```bash
# Run tests directly
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test

# With specific browser
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --project=chromium
```

### Basic Dockerfile

```dockerfile
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

### Build and Run

```bash
# Build image
docker build -t my-playwright-tests .

# Run tests
docker run --rm my-playwright-tests

# Run with report output
docker run --rm \
    -v $(pwd)/playwright-report:/app/playwright-report \
    my-playwright-tests
```

### Docker Compose Setup

```yaml
version: '3.8'
services:
  playwright:
    build: .
    volumes:
      - ./playwright-report:/app/playwright-report
      - ./test-results:/app/test-results
    environment:
      - CI=true
```

### Run Specific Tests

```bash
# Run specific test file
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test tests/login.spec.ts

# Run with grep
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --grep "login"
```

### Interactive Mode

```bash
# Run shell in container
docker run -it --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    bash

# Inside container
npx playwright test --debug
npx playwright codegen
```

### Environment Variables

```bash
# Pass environment variables
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -e BASE_URL=https://example.com \
    -e CI=true \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test
```

### View Reports

```bash
# Generate HTML report
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --reporter=html

# Serve report locally
npx playwright show-report
```

### Best Practices

```
✅ Use specific image versions
✅ Mount volumes for reports
✅ Set CI=true in CI environments
✅ Use multi-stage builds
✅ Cache npm dependencies
✅ Run headless mode
```

