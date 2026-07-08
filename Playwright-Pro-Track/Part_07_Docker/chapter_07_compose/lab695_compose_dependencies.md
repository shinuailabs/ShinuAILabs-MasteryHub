# Lab 695: Compose Service Dependencies

## LEARNING CONCEPT

Managing service dependencies in Docker Compose.

## EXERCISE

1. Configure dependencies
2. Use health checks
3. Control startup order

## SOLUTION

### Basic Dependencies

```yaml
version: '3.8'
services:
  web:
    image: nginx
    depends_on:
      - api

  api:
    image: my-api
    depends_on:
      - db
      - redis

  db:
    image: postgres:15

  redis:
    image: redis:7
```

### Health Check Dependencies

```yaml
version: '3.8'
services:
  api:
    image: my-api
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
```

### Dependency Conditions

```yaml
version: '3.8'
services:
  api:
    depends_on:
      db:
        condition: service_healthy      # Wait for healthy
      cache:
        condition: service_started      # Wait for started
      init:
        condition: service_completed_successfully  # Wait for completion
```

### Init Container Pattern

```yaml
version: '3.8'
services:
  init-db:
    image: postgres:15
    command: >
      sh -c "until pg_isready -h db; do sleep 1; done &&
             psql -h db -U postgres -f /init.sql"
    volumes:
      - ./init.sql:/init.sql
    depends_on:
      db:
        condition: service_healthy

  api:
    image: my-api
    depends_on:
      init-db:
        condition: service_completed_successfully

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s
```

### Wait Script Pattern

```yaml
version: '3.8'
services:
  api:
    image: my-api
    command: >
      sh -c "./wait-for-it.sh db:5432 --timeout=60 &&
             ./wait-for-it.sh redis:6379 --timeout=60 &&
             npm start"
    depends_on:
      - db
      - redis
```

### Startup Order Control

```yaml
version: '3.8'
services:
  # Layer 1: Infrastructure
  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s

  redis:
    image: redis:7
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s

  # Layer 2: Application
  api:
    image: my-api
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  worker:
    image: my-worker
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  # Layer 3: Frontend
  web:
    image: nginx
    depends_on:
      - api
```

### Graceful Shutdown

```yaml
version: '3.8'
services:
  api:
    image: my-api
    stop_grace_period: 30s
    stop_signal: SIGTERM
```

### Restart Dependencies

```yaml
version: '3.8'
services:
  api:
    image: my-api
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
        restart: true  # Restart if db restarts
```

### Complex Dependency Graph

```yaml
version: '3.8'
services:
  nginx:
    depends_on:
      - api
      - static

  api:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully

  worker:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  migrations:
    depends_on:
      db:
        condition: service_healthy

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]

  static:
    image: nginx
```

### Best Practices

```
✅ Use health checks for critical dependencies
✅ Use service_healthy condition
✅ Implement proper health check commands
✅ Set appropriate timeouts
✅ Handle startup failures gracefully
✅ Document dependency graph
```

