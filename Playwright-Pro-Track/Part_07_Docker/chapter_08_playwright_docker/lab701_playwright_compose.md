# Lab 701: Playwright with Docker Compose

## LEARNING CONCEPT

Using Docker Compose for Playwright test environments.

## EXERCISE

1. Create compose setup
2. Test against local services
3. Manage test environments

## SOLUTION

### Basic Compose Setup

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
    command: npx playwright test
    environment:
      - CI=true
```

### Test Against Local App

```yaml
version: '3.8'
services:
  app:
    build: ./app
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 5s
      timeout: 5s
      retries: 10

  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - ./tests:/app/tests
      - ./playwright.config.ts:/app/playwright.config.ts
      - ./package.json:/app/package.json
      - ./playwright-report:/app/playwright-report
    depends_on:
      app:
        condition: service_healthy
    environment:
      - CI=true
      - BASE_URL=http://app:3000
    command: sh -c "npm ci && npx playwright test"
```

### Full Stack Testing

```yaml
version: '3.8'
services:
  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 5s

  # Backend API
  api:
    build: ./api
    ports:
      - "4000:4000"
    depends_on:
      db:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/testdb

  # Database
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: testdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s

  # Playwright tests
  playwright:
    build:
      context: ./e2e
      dockerfile: Dockerfile
    volumes:
      - ./e2e/playwright-report:/app/playwright-report
      - ./e2e/test-results:/app/test-results
    depends_on:
      frontend:
        condition: service_healthy
    environment:
      - CI=true
      - BASE_URL=http://frontend:3000
      - API_URL=http://api:4000
    command: npx playwright test

networks:
  default:
    name: e2e-network
```

### Development Setup

```yaml
version: '3.8'
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    environment:
      - CI=false
    command: tail -f /dev/null
    profiles:
      - dev

volumes:
  node_modules:
```

```bash
# Start development container
docker compose --profile dev up -d

# Run tests interactively
docker compose exec playwright npx playwright test

# Run codegen
docker compose exec playwright npx playwright codegen
```

### Parallel Testing

```yaml
version: '3.8'
services:
  playwright-chromium:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./reports/chromium:/app/playwright-report
    environment:
      - CI=true
    command: npx playwright test --project=chromium

  playwright-firefox:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./reports/firefox:/app/playwright-report
    environment:
      - CI=true
    command: npx playwright test --project=firefox

  playwright-webkit:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./reports/webkit:/app/playwright-report
    environment:
      - CI=true
    command: npx playwright test --project=webkit
```

### Run Commands

```bash
# Run all tests
docker compose up playwright

# Run specific service
docker compose run --rm playwright npx playwright test tests/login.spec.ts

# Run with environment
docker compose run --rm -e BASE_URL=https://staging.example.com playwright npx playwright test

# View logs
docker compose logs -f playwright
```

### Cleanup

```bash
# Stop and remove
docker compose down

# Remove volumes
docker compose down -v

# Remove reports
rm -rf playwright-report test-results
```

