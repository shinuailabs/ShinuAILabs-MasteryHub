# Lab 705: Playwright Network in Docker

## LEARNING CONCEPT

Configuring network for Playwright tests in Docker.

## EXERCISE

1. Connect to local services
2. Configure network settings
3. Handle network isolation

## SOLUTION

### Connect to Host Services

```bash
# Linux: Use host.docker.internal
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    --add-host=host.docker.internal:host-gateway \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test

# In tests, use http://host.docker.internal:3000
```

### Docker Compose Network

```yaml
version: '3.8'
services:
  app:
    build: ./app
    networks:
      - test-network

  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - ./tests:/app
    environment:
      - BASE_URL=http://app:3000
    networks:
      - test-network
    depends_on:
      - app

networks:
  test-network:
```

### Playwright Config for Docker

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  webServer: process.env.CI ? undefined : {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

### Network Mocking

```typescript
// tests/api-mock.spec.ts
import { test, expect } from '@playwright/test';

test('mock API response', async ({ page }) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'Test User' }]),
    });
  });

  await page.goto('/users');
  await expect(page.locator('.user')).toHaveCount(1);
});
```

### External Service Testing

```yaml
version: '3.8'
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
    environment:
      - BASE_URL=https://staging.example.com
    # No network restrictions for external access
```

### Internal Network Testing

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    networks:
      - frontend-net

  api:
    build: ./api
    networks:
      - frontend-net
      - backend-net

  db:
    image: postgres:15
    networks:
      - backend-net

  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - ./e2e:/app
    environment:
      - BASE_URL=http://frontend:3000
    networks:
      - frontend-net
    depends_on:
      - frontend

networks:
  frontend-net:
  backend-net:
    internal: true
```

### Proxy Configuration

```bash
# Use proxy
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -e HTTP_PROXY=http://proxy:8080 \
    -e HTTPS_PROXY=http://proxy:8080 \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test
```

### DNS Configuration

```yaml
version: '3.8'
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    dns:
      - 8.8.8.8
      - 8.8.4.4
    extra_hosts:
      - "myapp.local:192.168.1.100"
```

### Wait for Services

```yaml
version: '3.8'
services:
  app:
    build: ./app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 5s
      timeout: 5s
      retries: 10

  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    depends_on:
      app:
        condition: service_healthy
    environment:
      - BASE_URL=http://app:3000
```

### Network Debugging

```bash
# Check connectivity from container
docker run --rm \
    --network mynetwork \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    curl -v http://app:3000

# Check DNS resolution
docker run --rm \
    --network mynetwork \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    nslookup app
```

### Best Practices

```
✅ Use service names for URLs
✅ Configure health checks
✅ Use depends_on with conditions
✅ Test network connectivity first
✅ Use environment variables for URLs
✅ Document network topology
```

