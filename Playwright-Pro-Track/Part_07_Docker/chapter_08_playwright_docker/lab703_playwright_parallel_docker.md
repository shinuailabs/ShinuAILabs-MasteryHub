# Lab 703: Parallel Testing with Docker

## LEARNING CONCEPT

Running Playwright tests in parallel using Docker.

## EXERCISE

1. Configure parallel execution
2. Shard tests across containers
3. Aggregate results

## SOLUTION

### Sharding with Docker

```bash
# Run shard 1 of 4
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --shard=1/4

# Run shard 2 of 4
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --shard=2/4
```

### Docker Compose Sharding

```yaml
version: '3.8'
services:
  shard1:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./results/shard1:/app/test-results
    command: sh -c "npm ci && npx playwright test --shard=1/4"
    environment:
      - CI=true

  shard2:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./results/shard2:/app/test-results
    command: sh -c "npm ci && npx playwright test --shard=2/4"
    environment:
      - CI=true

  shard3:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./results/shard3:/app/test-results
    command: sh -c "npm ci && npx playwright test --shard=3/4"
    environment:
      - CI=true

  shard4:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./results/shard4:/app/test-results
    command: sh -c "npm ci && npx playwright test --shard=4/4"
    environment:
      - CI=true
```

### GitHub Actions Matrix

```yaml
name: Playwright Sharded Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test --shard=${{ matrix.shard }}/4

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: blob-report-${{ matrix.shard }}
          path: blob-report/
          retention-days: 1

  merge-reports:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci

      - uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - run: npx playwright merge-reports --reporter html ./all-blob-reports

      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### Browser Parallel Testing

```yaml
version: '3.8'
services:
  chromium:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./reports/chromium:/app/playwright-report
    command: sh -c "npm ci && npx playwright test --project=chromium"

  firefox:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./reports/firefox:/app/playwright-report
    command: sh -c "npm ci && npx playwright test --project=firefox"

  webkit:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./reports/webkit:/app/playwright-report
    command: sh -c "npm ci && npx playwright test --project=webkit"
```

### Parallel Script

```bash
#!/bin/bash
# parallel-tests.sh

SHARDS=4
PIDS=()

for i in $(seq 1 $SHARDS); do
    docker run --rm \
        -v $(pwd):/app \
        -w /app \
        -v $(pwd)/results/shard$i:/app/test-results \
        mcr.microsoft.com/playwright:v1.40.0-jammy \
        sh -c "npm ci && npx playwright test --shard=$i/$SHARDS" &
    PIDS+=($!)
done

# Wait for all shards
EXIT_CODE=0
for pid in ${PIDS[@]}; do
    wait $pid || EXIT_CODE=1
done

exit $EXIT_CODE
```

### Merge Results

```bash
# Merge blob reports
npx playwright merge-reports --reporter html ./all-blob-reports

# Merge JUnit reports
npm install -g junit-merge
junit-merge -o merged-results.xml results/*/junit.xml
```

### Playwright Config for Sharding

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['blob'],  // For merging
    ['html'],
  ],
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
});
```

### Best Practices

```
✅ Use blob reporter for merging
✅ Set fullyParallel: true
✅ Use matrix strategy in CI
✅ Aggregate results after shards
✅ Handle failures gracefully
✅ Use consistent shard count
```

