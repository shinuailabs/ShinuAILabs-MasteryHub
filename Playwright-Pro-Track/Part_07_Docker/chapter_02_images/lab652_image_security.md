# Lab 652: Image Security

## LEARNING CONCEPT

Securing Docker images against vulnerabilities.

### Security Concerns:
- Vulnerable base images
- Exposed secrets
- Running as root
- Unnecessary packages

## EXERCISE

1. Scan for vulnerabilities
2. Apply security best practices
3. Harden images

## SOLUTION

### Scan Images for Vulnerabilities

```bash
# Docker Scout (built-in)
docker scout cves my-app:latest
docker scout quickview my-app:latest

# Trivy (popular scanner)
# brew install trivy
trivy image my-app:latest

# Snyk
snyk container test my-app:latest
```

### Use Minimal Base Images

```dockerfile
# ❌ Full image with many packages
FROM node:18

# ✅ Minimal image
FROM node:18-alpine

# ✅ Distroless (no shell, minimal attack surface)
FROM gcr.io/distroless/nodejs18-debian11
```

### Run as Non-Root User

```dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

CMD ["node", "app.js"]
```

### Don't Store Secrets in Images

```dockerfile
# ❌ Bad: Secret in image
ENV API_KEY=secret123
COPY .env /app/.env

# ✅ Good: Use runtime secrets
# Pass at runtime: docker run -e API_KEY=secret123 my-app

# ✅ Good: Use Docker secrets (Swarm)
# docker secret create api_key secret.txt
```

### Remove Unnecessary Packages

```dockerfile
# Install only what's needed
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        package1 \
        package2 && \
    rm -rf /var/lib/apt/lists/*

# Remove build dependencies
RUN apk add --no-cache --virtual .build-deps \
        python3 make g++ && \
    npm ci && \
    apk del .build-deps
```

### Use Specific Versions

```dockerfile
# ❌ Unpredictable
FROM node:latest

# ✅ Specific and reproducible
FROM node:18.19.0-alpine3.19
```

### Read-Only Filesystem

```bash
# Run with read-only filesystem
docker run --read-only my-app

# Allow specific writable directories
docker run --read-only \
    --tmpfs /tmp \
    -v /app/data:/app/data \
    my-app
```

### Security Scanning in CI

```yaml
# GitHub Actions example
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'my-app:${{ github.sha }}'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### Dockerfile Security Checklist

```dockerfile
# Security-hardened Dockerfile
FROM node:18.19.0-alpine3.19

# Don't run as root
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy with correct ownership
COPY --chown=app:app package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --chown=app:app . .

# Use non-root user
USER app

# Don't expose unnecessary ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
```

### Security Best Practices

```
✅ Use minimal base images
✅ Run as non-root user
✅ Don't store secrets in images
✅ Scan images regularly
✅ Use specific version tags
✅ Remove unnecessary packages
✅ Use read-only filesystem when possible
✅ Sign images (Docker Content Trust)
✅ Keep base images updated
```

