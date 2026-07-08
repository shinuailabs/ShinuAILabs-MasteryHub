# Part 06: Environment Variables

## 📚 Overview
Environment variables configure containers dynamically for different environments and test scenarios.

---

## 🎯 Key Concepts

### 1. Setting Environment Variables

```bash
# Single variable
docker run -e NODE_ENV=production image

# Multiple variables
docker run \
  -e NODE_ENV=production \
  -e API_KEY=secret123 \
  -e DEBUG=true \
  image

# From host environment
docker run -e API_KEY image

# From file
docker run --env-file .env image
```

### 2. Environment File

```bash
# .env
NODE_ENV=development
BASE_URL=http://localhost:3000
API_KEY=test-api-key
DEBUG=true
HEADLESS=true
WORKERS=4
```

```bash
# Run with env file
docker run --env-file .env playwright-tests
```

### 3. Docker Compose Environment

```yaml
# docker-compose.yml
version: '3.8'

services:
  tests:
    build: .
    environment:
      - NODE_ENV=test
      - BASE_URL=http://app:3000
      - CI=true
    env_file:
      - .env
      - .env.test
```

### 4. Variable Substitution

```yaml
# docker-compose.yml
version: '3.8'

services:
  tests:
    build: .
    environment:
      - API_KEY=${API_KEY}
      - BASE_URL=${BASE_URL:-http://localhost:3000}
      - DEBUG=${DEBUG:-false}
```

```bash
# Set variables before running
export API_KEY=my-secret-key
docker-compose up
```

### 5. Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.HEADLESS !== 'false',
  },
  
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : undefined,
  retries: process.env.CI ? 2 : 0,
  
  reporter: process.env.CI 
    ? [['junit', { outputFile: 'results.xml' }]]
    : [['html']],
});
```

### 6. Test Data Configuration

```typescript
// config/test-config.ts
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000',
  
  users: {
    admin: {
      email: process.env.ADMIN_EMAIL || 'admin@test.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    },
    user: {
      email: process.env.USER_EMAIL || 'user@test.com',
      password: process.env.USER_PASSWORD || 'user123',
    },
  },
  
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    navigation: parseInt(process.env.NAV_TIMEOUT || '60000'),
  },
};
```

### 7. Environment-Specific Compose Files

```yaml
# docker-compose.yml (base)
version: '3.8'
services:
  tests:
    build: .

# docker-compose.dev.yml
version: '3.8'
services:
  tests:
    environment:
      - NODE_ENV=development
      - DEBUG=true
      - HEADLESS=false

# docker-compose.ci.yml
version: '3.8'
services:
  tests:
    environment:
      - NODE_ENV=production
      - CI=true
      - HEADLESS=true
      - WORKERS=4
```

```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# CI
docker-compose -f docker-compose.yml -f docker-compose.ci.yml up
```

### 8. Secrets Management

```yaml
# docker-compose.yml
version: '3.8'

services:
  tests:
    build: .
    secrets:
      - api_key
      - db_password
    environment:
      - API_KEY_FILE=/run/secrets/api_key

secrets:
  api_key:
    file: ./secrets/api_key.txt
  db_password:
    file: ./secrets/db_password.txt
```

```typescript
// Read secret in code
import * as fs from 'fs';

const apiKey = process.env.API_KEY_FILE 
  ? fs.readFileSync(process.env.API_KEY_FILE, 'utf8').trim()
  : process.env.API_KEY;
```

### 9. CI Environment Variables

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      CI: true
      BASE_URL: http://localhost:3000
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          docker-compose up --build --abort-on-container-exit
```

---

## 💻 Practice Exercises

1. Create environment files
2. Use variable substitution
3. Configure Playwright with env vars
4. Set up environment-specific configs
5. Implement secrets management

---

## ✅ Best Practices

- ✅ Use .env files for local dev
- ✅ Provide default values
- ✅ Use secrets for sensitive data
- ✅ Document required variables
- ❌ Don't commit secrets
- ❌ Avoid hardcoding values

---

## 📝 Quick Reference

```bash
# Docker run
docker run -e VAR=value image
docker run --env-file .env image

# Compose
environment:
  - VAR=value
  - VAR=${HOST_VAR:-default}
env_file:
  - .env

# Access in code
process.env.VAR_NAME
```

