# Lab 714: Docker Testing in CI

## LEARNING CONCEPT

Running tests in Docker containers in CI/CD pipelines.

## EXERCISE

1. Run unit tests in containers
2. Run integration tests with services
3. Generate test reports

## SOLUTION

### Unit Tests in Container

```yaml
# GitHub Actions
name: Unit Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build test image
        run: docker build -t myapp:test --target test .

      - name: Run tests
        run: |
          docker run --rm \
            -v $(pwd)/coverage:/app/coverage \
            myapp:test npm test

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```

### Integration Tests with Services

```yaml
name: Integration Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Run integration tests
        run: |
          docker run --rm \
            --network host \
            -e DATABASE_URL=postgres://postgres:password@localhost:5432/postgres \
            myapp:test npm run test:integration
```

### Docker Compose Testing

```yaml
name: E2E Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start services
        run: docker compose -f docker-compose.test.yml up -d

      - name: Wait for services
        run: |
          docker compose -f docker-compose.test.yml exec -T app \
            curl --retry 10 --retry-delay 5 http://localhost:3000/health

      - name: Run tests
        run: docker compose -f docker-compose.test.yml run --rm test

      - name: Get logs on failure
        if: failure()
        run: docker compose -f docker-compose.test.yml logs

      - name: Cleanup
        if: always()
        run: docker compose -f docker-compose.test.yml down -v
```

### Test Compose File

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgres://postgres:password@db:5432/testdb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: testdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s

  test:
    build:
      context: .
      target: test
    environment:
      - BASE_URL=http://app:3000
    depends_on:
      - app
    volumes:
      - ./test-results:/app/test-results
```

### Parallel Testing

```yaml
name: Parallel Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: |
          docker run --rm \
            -v $(pwd)/results:/app/results \
            myapp:test npm test -- --shard=${{ matrix.shard }}/4

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: results-${{ matrix.shard }}
          path: results/
```

### Test Reports

```yaml
- name: Run tests with JUnit output
  run: |
    docker run --rm \
      -v $(pwd)/test-results:/app/test-results \
      myapp:test npm test -- --reporter=junit

- name: Publish Test Results
  uses: EnricoMi/publish-unit-test-result-action@v2
  if: always()
  with:
    files: test-results/*.xml
```

### Code Coverage

```yaml
- name: Run tests with coverage
  run: |
    docker run --rm \
      -v $(pwd)/coverage:/app/coverage \
      myapp:test npm run test:coverage

- name: Upload to Codecov
  uses: codecov/codecov-action@v4
  with:
    directory: ./coverage
```

### Multi-Stage Test Dockerfile

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS test
COPY . .
CMD ["npm", "test"]

FROM base AS build
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### Best Practices

```
✅ Use dedicated test stage
✅ Mount volumes for results
✅ Use health checks
✅ Clean up after tests
✅ Parallelize when possible
✅ Generate coverage reports
```

