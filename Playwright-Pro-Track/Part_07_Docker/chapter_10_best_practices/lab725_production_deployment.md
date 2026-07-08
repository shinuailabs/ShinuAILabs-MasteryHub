# Lab 725: Production Deployment

## LEARNING CONCEPT

Deploying Docker containers to production.

## EXERCISE

1. Prepare for production
2. Implement deployment strategies
3. Configure for reliability

## SOLUTION

### Production Dockerfile

```dockerfile
FROM node:18.19.0-alpine3.19 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18.19.0-alpine3.19

RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

### Production Compose

```yaml
version: '3.8'
services:
  api:
    image: myregistry/api:${VERSION}
    restart: unless-stopped
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '2'
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - frontend
      - backend

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
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s

networks:
  frontend:
  backend:
    internal: true

volumes:
  pgdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### Zero-Downtime Deployment

```bash
#!/bin/bash
# deploy.sh

VERSION=$1
COMPOSE_FILE="docker-compose.prod.yml"

echo "Deploying version: $VERSION"

# Pull new images
VERSION=$VERSION docker compose -f $COMPOSE_FILE pull

# Scale up new containers
VERSION=$VERSION docker compose -f $COMPOSE_FILE up -d --no-deps --scale api=2 api

# Wait for health
sleep 30

# Remove old containers
VERSION=$VERSION docker compose -f $COMPOSE_FILE up -d --remove-orphans

echo "Deployment complete"
```

### Rolling Update

```yaml
# Docker Swarm
services:
  api:
    image: myregistry/api:${VERSION}
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      rollback_config:
        parallelism: 1
        delay: 10s
```

### Health Check Endpoint

```javascript
// health.js
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: checkDatabase(),
      redis: checkRedis()
    }
  };
  
  const isHealthy = Object.values(health.checks).every(c => c);
  res.status(isHealthy ? 200 : 503).json(health);
});
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker exec postgres pg_dump -U postgres mydb > backups/db_$DATE.sql

# Volume backup
docker run --rm \
    -v myapp_pgdata:/data \
    -v $(pwd)/backups:/backup \
    alpine tar cvf /backup/volume_$DATE.tar /data

# Upload to S3
aws s3 cp backups/ s3://my-bucket/backups/ --recursive
```

### Monitoring Setup

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - monitoring

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - monitoring
```

### Production Checklist

```
Pre-deployment:
□ Image built and tested
□ Security scan passed
□ Configuration reviewed
□ Secrets configured
□ Backups verified

Deployment:
□ Health checks passing
□ Zero-downtime strategy
□ Rollback plan ready
□ Monitoring active

Post-deployment:
□ Verify functionality
□ Check logs
□ Monitor metrics
□ Update documentation
```

