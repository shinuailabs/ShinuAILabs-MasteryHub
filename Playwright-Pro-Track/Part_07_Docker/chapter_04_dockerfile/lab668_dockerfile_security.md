# Lab 668: Dockerfile Security

## LEARNING CONCEPT

Writing secure Dockerfiles.

### Security Concerns:
- Running as root
- Exposed secrets
- Vulnerable packages
- Unnecessary tools

## EXERCISE

1. Apply security best practices
2. Scan for vulnerabilities
3. Harden Dockerfile

## SOLUTION

### Run as Non-Root User

```dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy with correct ownership
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

CMD ["node", "app.js"]
```

### Don't Store Secrets

```dockerfile
# ❌ Bad: Secret in image
ENV API_KEY=secret123
COPY .env /app/.env

# ✅ Good: Use runtime secrets
# Pass at runtime: docker run -e API_KEY=secret my-app

# ✅ Good: Use BuildKit secrets
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=api_key \
    cat /run/secrets/api_key > /app/config
```

### Use Specific Versions

```dockerfile
# ❌ Bad: Unpredictable
FROM node:latest

# ✅ Good: Specific version
FROM node:18.19.0-alpine3.19

# ✅ Best: Pin by digest
FROM node@sha256:abc123...
```

### Minimize Attack Surface

```dockerfile
# Use minimal base image
FROM node:18-alpine

# Remove unnecessary packages
RUN apk add --no-cache --virtual .build-deps \
        python3 make g++ && \
    npm ci && \
    apk del .build-deps

# Don't install unnecessary tools
# No curl, wget, etc. unless needed
```

### Use COPY Instead of ADD

```dockerfile
# ❌ ADD can download URLs and extract archives
ADD https://example.com/file /app/
ADD archive.tar.gz /app/

# ✅ COPY is more explicit and secure
COPY file.txt /app/
```

### Scan for Vulnerabilities

```bash
# Docker Scout
docker scout cves my-app:latest

# Trivy
trivy image my-app:latest

# Snyk
snyk container test my-app:latest
```

### Read-Only Filesystem

```dockerfile
# Design for read-only filesystem
FROM node:18-alpine

WORKDIR /app
COPY . .

# Use tmpfs for writable directories
# docker run --read-only --tmpfs /tmp my-app
```

### Drop Capabilities

```bash
# Run with minimal capabilities
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE my-app
```

### Security-Hardened Dockerfile

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18.19.0-alpine3.19

# Security labels
LABEL org.opencontainers.image.source="https://github.com/org/repo"
LABEL org.opencontainers.image.vendor="Company"

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy with ownership
COPY --chown=app:app package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

COPY --chown=app:app . .

# Use non-root user
USER app

# Document port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "app.js"]
```

### Security Checklist

```
□ Use specific base image version
□ Run as non-root user
□ Don't store secrets in image
□ Use COPY instead of ADD
□ Remove unnecessary packages
□ Scan for vulnerabilities
□ Use multi-stage builds
□ Set read-only filesystem
□ Drop unnecessary capabilities
□ Add health checks
```

### CI Security Scanning

```yaml
# GitHub Actions
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'my-app:${{ github.sha }}'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

