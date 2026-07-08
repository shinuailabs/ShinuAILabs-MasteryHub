# Lab 697: Compose for Production

## LEARNING CONCEPT

Using Docker Compose in production environments.

## EXERCISE

1. Configure for production
2. Implement security
3. Set up monitoring

## SOLUTION

### Production Configuration

```yaml
version: '3.8'
services:
  api:
    image: myregistry/api:${VERSION:-latest}
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### Security Configuration

```yaml
version: '3.8'
services:
  api:
    image: myregistry/api:${VERSION}
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    networks:
      - frontend
      - backend
    ports:
      - "127.0.0.1:3000:3000"
```

### Complete Production Setup

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      api:
        condition: service_healthy
    networks:
      - frontend
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  api:
    image: myregistry/api:${VERSION}
    restart: unless-stopped
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - frontend
      - backend
    deploy:
      resources:
        limits:
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 2G

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  frontend:
  backend:
    internal: true

volumes:
  pgdata:
  redisdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

VERSION=${1:-latest}
COMPOSE_FILE="docker-compose.yml"
PROD_FILE="docker-compose.prod.yml"

echo "Deploying version: $VERSION"

# Pull latest images
VERSION=$VERSION docker compose -f $COMPOSE_FILE -f $PROD_FILE pull

# Deploy with zero downtime
VERSION=$VERSION docker compose -f $COMPOSE_FILE -f $PROD_FILE up -d --no-deps --scale api=2 api

# Wait for health
sleep 10

# Remove old containers
docker compose -f $COMPOSE_FILE -f $PROD_FILE up -d --remove-orphans

echo "Deployment complete"
```

### Monitoring Integration

```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - monitoring
    profiles:
      - monitoring

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - monitoring
    profiles:
      - monitoring

networks:
  monitoring:

volumes:
  prometheus-data:
  grafana-data:
```

### Production Checklist

```
□ Use specific image versions
□ Set resource limits
□ Configure health checks
□ Set up logging
□ Use secrets for sensitive data
□ Configure restart policies
□ Use read-only filesystem
□ Drop capabilities
□ Use internal networks
□ Set up monitoring
```

