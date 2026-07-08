# Lab 706: Managing Playwright Artifacts in Docker

## LEARNING CONCEPT

Handling test artifacts (reports, screenshots, videos) in Docker.

## EXERCISE

1. Configure artifact output
2. Mount volumes for artifacts
3. Upload to CI systems

## SOLUTION

### Volume Mounts for Artifacts

```bash
# Mount artifact directories
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -v $(pwd)/playwright-report:/app/playwright-report \
    -v $(pwd)/test-results:/app/test-results \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test
```

### Docker Compose Artifacts

```yaml
version: '3.8'
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./playwright-report:/app/playwright-report
      - ./test-results:/app/test-results
      - ./coverage:/app/coverage
    environment:
      - CI=true
    command: npx playwright test
```

### Playwright Config for Artifacts

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  outputDir: 'test-results',
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});
```

### Artifact Structure

```
project/
├── playwright-report/
│   ├── index.html
│   └── data/
├── test-results/
│   ├── results.json
│   ├── junit.xml
│   └── test-name/
│       ├── screenshot.png
│       ├── video.webm
│       └── trace.zip
└── coverage/
    └── lcov-report/
```

### GitHub Actions Artifacts

```yaml
name: Playwright Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

### GitLab CI Artifacts

```yaml
playwright:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: test-results/junit.xml
    expire_in: 1 week
```

### Copy Artifacts from Container

```bash
# Run tests in named container
docker run --name playwright-tests \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test || true

# Copy artifacts
docker cp playwright-tests:/app/playwright-report ./playwright-report
docker cp playwright-tests:/app/test-results ./test-results

# Cleanup
docker rm playwright-tests
```

### Artifact Cleanup

```bash
# Clean before run
rm -rf playwright-report test-results

# Docker Compose cleanup
docker compose down -v
rm -rf playwright-report test-results

# In CI
- name: Clean artifacts
  run: rm -rf playwright-report test-results
```

### Serve Report

```bash
# After tests complete
npx playwright show-report

# Or with http-server
npx http-server playwright-report -p 9323
```

### Archive Artifacts

```bash
# Create archive
tar -czvf test-artifacts.tar.gz playwright-report test-results

# Upload to S3
aws s3 cp test-artifacts.tar.gz s3://my-bucket/reports/
```

### Dockerfile with Artifact Handling

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Create artifact directories
RUN mkdir -p playwright-report test-results

# Set permissions
RUN chmod -R 777 playwright-report test-results

CMD ["npx", "playwright", "test"]
```

### Best Practices

```
✅ Mount volumes for artifacts
✅ Use consistent output paths
✅ Configure multiple reporters
✅ Upload artifacts in CI
✅ Set retention policies
✅ Clean artifacts before runs
✅ Archive for long-term storage
```

