# Lab 698: Compose Best Practices

## LEARNING CONCEPT

Comprehensive Docker Compose best practices.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Validate compliance

## SOLUTION

### File Organization

```bash
# Recommended structure
project/
├── docker-compose.yml          # Base configuration
├── docker-compose.override.yml # Development overrides
├── docker-compose.prod.yml     # Production overrides
├── docker-compose.test.yml     # Testing overrides
├── .env                        # Default environment
├── .env.example                # Example environment
├── .dockerignore
├── services/
│   ├── api/
│   │   ├── Dockerfile
│   │   └── ...
│   └── web/
│       ├── Dockerfile
│       └── ...
└── config/
    ├── nginx.conf
    └── ...
```

### Service Configuration

```yaml
version: '3.8'
services:
  api:
    # Use specific versions
    image: myregistry/api:1.0.0
    
    # Meaningful container name
    container_name: myapp-api
    
    # Always set restart policy
    restart: unless-stopped
    
    # Set resource limits
    deploy:
      resources:
        limits:
          memory: 1G
    
    # Health checks
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    
    # Logging
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### Security Best Practices

```yaml
version: '3.8'
services:
  api:
    # Run as non-root
    user: "1000:1000"
    
    # Read-only filesystem
    read_only: true
    tmpfs:
      - /tmp
    
    # Security options
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    
    # Use secrets
    secrets:
      - db_password
    
    # Internal networks
    networks:
      - backend
```

### Network Best Practices

```yaml
version: '3.8'
services:
  web:
    networks:
      - frontend
    ports:
      - "127.0.0.1:80:80"  # Localhost only

  api:
    networks:
      - frontend
      - backend
    # No ports exposed

  db:
    networks:
      - backend
    # No ports exposed

networks:
  frontend:
  backend:
    internal: true
```

### Volume Best Practices

```yaml
version: '3.8'
services:
  db:
    volumes:
      # Named volumes for data
      - pgdata:/var/lib/postgresql/data
      # Read-only for config
      - ./config:/etc/postgresql:ro

volumes:
  pgdata:
    name: myapp-pgdata  # Explicit name
```

### Environment Management

```yaml
# Use env_file for multiple variables
services:
  api:
    env_file:
      - .env
      - .env.${ENVIRONMENT:-development}
    
    # Use variable substitution
    environment:
      - VERSION=${VERSION:-latest}
      - DATABASE_URL=${DATABASE_URL:?Required}
```

### Dependencies

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s
      timeout: 5s
      retries: 5
```

### Documentation

```yaml
version: '3.8'

# Project: MyApp
# Description: Multi-service application
# Maintainer: team@example.com

services:
  api:
    # API service - handles HTTP requests
    # Ports: 3000 (internal)
    # Dependencies: db, redis
    image: myregistry/api:${VERSION}
```

### Checklist

```
File Organization:
□ Separate base and override files
□ Use .env for variables
□ Include .env.example
□ Document configuration

Services:
□ Use specific image versions
□ Set container names
□ Configure restart policies
□ Set resource limits
□ Add health checks
□ Configure logging

Security:
□ Run as non-root
□ Use read-only filesystem
□ Drop capabilities
□ Use secrets for sensitive data
□ Use internal networks

Networks:
□ Create custom networks
□ Use internal for backend
□ Bind to localhost
□ Document network topology

Volumes:
□ Use named volumes
□ Use explicit names
□ Use read-only when possible
□ Document volume purpose
```

### Anti-Patterns

```yaml
# ❌ Avoid
services:
  api:
    image: myapi:latest           # Use specific version
    ports:
      - "3000:3000"               # Bind to localhost
    volumes:
      - .:/app                    # Too broad
    environment:
      - PASSWORD=secret           # Use secrets

# ✅ Better
services:
  api:
    image: myapi:1.0.0
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - ./src:/app/src:ro
    secrets:
      - password
```

