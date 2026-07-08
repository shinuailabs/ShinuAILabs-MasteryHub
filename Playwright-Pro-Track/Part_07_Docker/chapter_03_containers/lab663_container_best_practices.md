# Lab 663: Container Best Practices

## LEARNING CONCEPT

Comprehensive best practices for running containers.

## EXERCISE

1. Review best practices
2. Apply to deployments
3. Validate compliance

## SOLUTION

### Running Containers

```bash
# ✅ Use named containers
docker run -d --name my-app nginx

# ✅ Set resource limits
docker run -d \
    --memory=512m \
    --cpus=1 \
    nginx

# ✅ Use restart policies
docker run -d --restart=unless-stopped nginx

# ✅ Use health checks
docker run -d \
    --health-cmd="curl -f http://localhost/ || exit 1" \
    nginx
```

### Security Best Practices

```bash
# ✅ Run as non-root
docker run -d --user 1000:1000 nginx

# ✅ Read-only filesystem
docker run -d --read-only nginx

# ✅ Drop capabilities
docker run -d --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# ✅ No new privileges
docker run -d --security-opt=no-new-privileges nginx

# ✅ Use seccomp profile
docker run -d --security-opt seccomp=default.json nginx
```

### Networking Best Practices

```bash
# ✅ Use custom networks
docker network create app-network
docker run -d --network=app-network nginx

# ✅ Don't expose unnecessary ports
docker run -d -p 127.0.0.1:8080:80 nginx

# ✅ Use internal networks for backend services
docker network create --internal backend-network
```

### Storage Best Practices

```bash
# ✅ Use volumes for persistent data
docker run -d -v data:/var/lib/data nginx

# ✅ Use bind mounts for development only
docker run -d -v $(pwd):/app nginx

# ✅ Use tmpfs for sensitive temporary data
docker run -d --tmpfs /tmp nginx
```

### Logging Best Practices

```bash
# ✅ Configure log rotation
docker run -d \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    nginx

# ✅ Use appropriate log driver
docker run -d --log-driver=json-file nginx
```

### Production Checklist

```bash
# Complete production container
docker run -d \
    --name my-app \
    --restart=unless-stopped \
    --memory=1g \
    --memory-swap=1g \
    --cpus=2 \
    --user 1000:1000 \
    --read-only \
    --tmpfs /tmp \
    --cap-drop=ALL \
    --security-opt=no-new-privileges \
    --network=app-network \
    -p 127.0.0.1:8080:8080 \
    --health-cmd="curl -f http://localhost:8080/health || exit 1" \
    --health-interval=30s \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    -e NODE_ENV=production \
    my-app:v1.0.0
```

### Docker Compose Best Practices

```yaml
version: '3.8'
services:
  app:
    image: my-app:v1.0.0
    container_name: my-app
    restart: unless-stopped
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    networks:
      - app-network
    ports:
      - "127.0.0.1:8080:8080"
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '2'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    environment:
      - NODE_ENV=production

networks:
  app-network:
    driver: bridge
```

### Monitoring Checklist

```
□ Health checks configured
□ Resource limits set
□ Logging configured
□ Metrics collection enabled
□ Alerting set up
□ Restart policy defined
```

### Security Checklist

```
□ Running as non-root
□ Read-only filesystem
□ Capabilities dropped
□ No new privileges
□ Network isolated
□ Secrets managed properly
□ Images scanned
```

