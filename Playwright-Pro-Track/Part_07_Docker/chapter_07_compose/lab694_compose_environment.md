# Lab 694: Compose Environment Management

## LEARNING CONCEPT

Managing environments with Docker Compose.

## EXERCISE

1. Use environment variables
2. Create multiple environments
3. Use override files

## SOLUTION

### Environment Variables

```yaml
version: '3.8'
services:
  api:
    image: my-api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/mydb
      - API_KEY=${API_KEY}  # From shell
```

### Environment File

```bash
# .env
NODE_ENV=production
DATABASE_URL=postgres://db:5432/mydb
API_KEY=secret123
```

```yaml
version: '3.8'
services:
  api:
    image: my-api
    env_file:
      - .env
```

### Multiple Environment Files

```yaml
version: '3.8'
services:
  api:
    image: my-api
    env_file:
      - .env
      - .env.local
      - .env.${ENVIRONMENT:-development}
```

### Compose Override Files

```yaml
# docker-compose.yml (base)
version: '3.8'
services:
  api:
    image: my-api
    ports:
      - "3000:3000"

# docker-compose.override.yml (auto-loaded for development)
version: '3.8'
services:
  api:
    build: ./api
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
```

### Multiple Compose Files

```bash
# Development
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Testing
docker compose -f docker-compose.yml -f docker-compose.test.yml up
```

### Environment-Specific Files

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    image: my-api

# docker-compose.dev.yml
version: '3.8'
services:
  api:
    build: ./api
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
      - DEBUG=true

# docker-compose.prod.yml
version: '3.8'
services:
  api:
    image: my-api:${VERSION:-latest}
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          memory: 1G
```

### Variable Substitution

```yaml
version: '3.8'
services:
  api:
    image: my-api:${VERSION:-latest}
    environment:
      - DATABASE_URL=${DATABASE_URL:?Database URL required}
      - LOG_LEVEL=${LOG_LEVEL:-info}
```

### .env File for Compose

```bash
# .env (for Compose variables)
COMPOSE_PROJECT_NAME=myapp
COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml
VERSION=1.0.0
```

### Profiles

```yaml
version: '3.8'
services:
  api:
    image: my-api
    
  db:
    image: postgres:15
    
  debug:
    image: nicolaka/netshoot
    profiles:
      - debug
    
  monitoring:
    image: prometheus
    profiles:
      - monitoring
```

```bash
# Start without profiles
docker compose up

# Start with debug profile
docker compose --profile debug up

# Start with multiple profiles
docker compose --profile debug --profile monitoring up
```

### Secrets

```yaml
version: '3.8'
services:
  api:
    image: my-api
    secrets:
      - db_password
      - api_key

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    environment: API_KEY
```

### Complete Multi-Environment Setup

```bash
# Directory structure
├── docker-compose.yml
├── docker-compose.override.yml  # Development (auto-loaded)
├── docker-compose.prod.yml
├── docker-compose.test.yml
├── .env
├── .env.development
├── .env.production
└── .env.test
```

```bash
# Development
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Testing
docker compose -f docker-compose.yml -f docker-compose.test.yml up
```

