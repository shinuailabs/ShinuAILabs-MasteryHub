# Part 03: Docker Compose

## 📚 Overview
Docker Compose orchestrates multi-container applications with a single configuration file.

---

## 🎯 Key Concepts

### 1. Basic docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

### 2. Multi-Service Setup

```yaml
version: '3.8'

services:
  web:
    build: ./web
    ports:
      - "3000:3000"
    depends_on:
      - api
      - db

  api:
    build: ./api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Test Environment Setup

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  tests:
    build:
      context: .
      dockerfile: Dockerfile.test
    depends_on:
      app:
        condition: service_healthy
    environment:
      - BASE_URL=http://app:3000
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
```

### 4. Playwright with Docker Compose

```yaml
# docker-compose.playwright.yml
version: '3.8'

services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - CI=true
    command: npx playwright test
    depends_on:
      - web

  web:
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 5s
      timeout: 3s
      retries: 10
```

### 5. Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Start specific service
docker-compose up web

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs web

# Execute command in service
docker-compose exec web bash

# Run one-off command
docker-compose run tests npm test
```

### 6. Environment Variables

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - API_KEY=${API_KEY}
    env_file:
      - .env
      - .env.local
```

```bash
# .env
NODE_ENV=development
API_KEY=secret123
DATABASE_URL=postgres://localhost:5432/db
```

### 7. Networks

```yaml
version: '3.8'

services:
  web:
    build: ./web
    networks:
      - frontend
      - backend

  api:
    build: ./api
    networks:
      - backend

  db:
    image: postgres:15
    networks:
      - backend

networks:
  frontend:
  backend:
```

### 8. Volumes

```yaml
version: '3.8'

services:
  app:
    build: .
    volumes:
      # Bind mount
      - ./src:/app/src
      # Named volume
      - node_modules:/app/node_modules
      # Anonymous volume
      - /app/temp

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  node_modules:
  postgres_data:
```

### 9. Override Files

```yaml
# docker-compose.yml (base)
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"

# docker-compose.override.yml (development)
version: '3.8'
services:
  app:
    volumes:
      - .:/app
    environment:
      - DEBUG=true

# docker-compose.prod.yml (production)
version: '3.8'
services:
  app:
    environment:
      - NODE_ENV=production
```

```bash
# Uses docker-compose.yml + docker-compose.override.yml
docker-compose up

# Uses docker-compose.yml + docker-compose.prod.yml
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## 💻 Practice Exercises

1. Create multi-service compose file
2. Set up test environment
3. Configure Playwright with Compose
4. Use environment variables
5. Implement health checks

---

## ✅ Best Practices

- ✅ Use health checks
- ✅ Define dependencies properly
- ✅ Use named volumes
- ✅ Separate configs per environment
- ❌ Don't hardcode secrets
- ❌ Avoid using `latest` tags

---

## 📝 Quick Reference

```yaml
# Basic structure
version: '3.8'
services:
  name:
    build: .
    image: image:tag
    ports:
      - "host:container"
    environment:
      - KEY=value
    volumes:
      - ./local:/container
    depends_on:
      - other_service
```

```bash
docker-compose up -d      # Start
docker-compose down       # Stop
docker-compose logs -f    # Logs
docker-compose exec svc   # Execute
docker-compose run svc    # Run command
```

