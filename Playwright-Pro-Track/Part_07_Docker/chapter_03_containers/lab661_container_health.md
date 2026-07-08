# Lab 661: Container Health Checks

## LEARNING CONCEPT

Implementing health checks for container monitoring.

### Health Check Benefits:
- Automatic restart on failure
- Load balancer integration
- Orchestrator awareness
- Proactive monitoring

## EXERCISE

1. Add health checks
2. Configure check parameters
3. Monitor health status

## SOLUTION

### Dockerfile Health Check

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm ci

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
```

### Health Check Options

```dockerfile
# All options
HEALTHCHECK \
    --interval=30s \      # Time between checks (default: 30s)
    --timeout=30s \       # Timeout for check (default: 30s)
    --start-period=0s \   # Grace period for startup (default: 0s)
    --retries=3 \         # Failures before unhealthy (default: 3)
    CMD command
```

### Health Check Commands

```dockerfile
# Using curl
HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1

# Using wget
HEALTHCHECK CMD wget -q --spider http://localhost:3000/health || exit 1

# Using custom script
HEALTHCHECK CMD /app/healthcheck.sh

# Check file exists
HEALTHCHECK CMD test -f /tmp/healthy

# Check process
HEALTHCHECK CMD pgrep -x node || exit 1
```

### Runtime Health Check

```bash
# Override Dockerfile health check
docker run -d \
    --health-cmd="curl -f http://localhost:3000/health || exit 1" \
    --health-interval=30s \
    --health-timeout=3s \
    --health-retries=3 \
    --health-start-period=5s \
    my-app

# Disable health check
docker run -d --no-healthcheck my-app
```

### Check Health Status

```bash
# View health status
docker ps
# Shows (healthy), (unhealthy), or (starting)

# Detailed health info
docker inspect --format='{{.State.Health.Status}}' my-container

# Health check logs
docker inspect --format='{{json .State.Health}}' my-container | jq

# Last health check result
docker inspect --format='{{(index .State.Health.Log 0).Output}}' my-container
```

### Health Check Script

```bash
#!/bin/sh
# healthcheck.sh

# Check HTTP endpoint
if ! curl -sf http://localhost:3000/health > /dev/null; then
    exit 1
fi

# Check database connection
if ! pg_isready -h localhost -p 5432 > /dev/null; then
    exit 1
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    exit 1
fi

exit 0
```

### Application Health Endpoint

```javascript
// Express.js health endpoint
app.get('/health', (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {
            database: checkDatabase(),
            cache: checkCache(),
            memory: checkMemory()
        }
    };
    
    const isHealthy = Object.values(health.checks)
        .every(check => check.status === 'ok');
    
    res.status(isHealthy ? 200 : 503).json(health);
});

function checkDatabase() {
    // Check database connection
    return { status: 'ok', latency: '5ms' };
}

function checkCache() {
    // Check cache connection
    return { status: 'ok', latency: '1ms' };
}

function checkMemory() {
    const used = process.memoryUsage();
    return {
        status: used.heapUsed < 500 * 1024 * 1024 ? 'ok' : 'warning',
        heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB'
    };
}
```

### Docker Compose Health Check

```yaml
version: '3'
services:
  app:
    image: my-app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s
```

### Best Practices

```
✅ Always add health checks
✅ Use appropriate intervals
✅ Set start_period for slow-starting apps
✅ Check critical dependencies
✅ Return meaningful status codes
✅ Keep checks lightweight
✅ Log health check failures
```

