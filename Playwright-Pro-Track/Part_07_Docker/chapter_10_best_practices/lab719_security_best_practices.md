# Lab 719: Security Best Practices

## LEARNING CONCEPT

Implementing Docker security best practices.

## EXERCISE

1. Secure container runtime
2. Implement image security
3. Configure network security

## SOLUTION

### Run as Non-Root

```dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app
COPY --chown=appuser:appgroup . .

USER appuser
CMD ["node", "index.js"]
```

### Read-Only Filesystem

```bash
# Run with read-only filesystem
docker run --read-only \
    --tmpfs /tmp \
    --tmpfs /var/run \
    myapp
```

```yaml
# Docker Compose
services:
  app:
    image: myapp
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

### Drop Capabilities

```bash
# Drop all capabilities
docker run --cap-drop=ALL myapp

# Add only needed capabilities
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp
```

```yaml
# Docker Compose
services:
  app:
    image: myapp
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### No New Privileges

```bash
docker run --security-opt=no-new-privileges myapp
```

```yaml
services:
  app:
    image: myapp
    security_opt:
      - no-new-privileges:true
```

### Resource Limits

```bash
docker run \
    --memory=512m \
    --memory-swap=512m \
    --cpus=1 \
    --pids-limit=100 \
    myapp
```

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          memory: 256M
```

### Network Security

```yaml
services:
  app:
    networks:
      - frontend
    ports:
      - "127.0.0.1:3000:3000"  # Localhost only

  db:
    networks:
      - backend
    # No ports exposed

networks:
  frontend:
  backend:
    internal: true  # No external access
```

### Secrets Management

```bash
# Create secret
echo "my-password" | docker secret create db_password -

# Use in service
docker service create \
    --name db \
    --secret db_password \
    postgres:15
```

```yaml
services:
  app:
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### Image Scanning

```bash
# Scan with Trivy
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image myapp

# Scan with Snyk
snyk container test myapp
```

### Secure Base Images

```dockerfile
# Use official images
FROM node:18-alpine

# Use specific versions
FROM node:18.19.0-alpine3.19

# Use distroless for minimal attack surface
FROM gcr.io/distroless/nodejs18-debian11
```

### Content Trust

```bash
# Enable content trust
export DOCKER_CONTENT_TRUST=1

# Sign images
docker trust sign myregistry/myapp:latest
```

### Security Checklist

```
Runtime:
□ Run as non-root
□ Read-only filesystem
□ Drop capabilities
□ No new privileges
□ Resource limits

Images:
□ Use specific versions
□ Scan for vulnerabilities
□ Use minimal base images
□ Sign images

Network:
□ Use internal networks
□ Bind to localhost
□ Encrypt traffic
□ Minimize exposed ports

Secrets:
□ Use Docker secrets
□ Don't hardcode credentials
□ Rotate secrets regularly
```

### Complete Secure Setup

```yaml
version: '3.8'
services:
  app:
    image: myapp:1.0.0
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    deploy:
      resources:
        limits:
          memory: 512M
    networks:
      - frontend
    secrets:
      - api_key

networks:
  frontend:

secrets:
  api_key:
    external: true
```

