# Lab 645: Docker Introduction Best Practices

## LEARNING CONCEPT

Best practices for getting started with Docker.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Avoid common mistakes

## SOLUTION

### Image Best Practices

```dockerfile
# ✅ Use specific version tags
FROM node:18.19.0-alpine

# ❌ Avoid latest tag in production
FROM node:latest

# ✅ Use minimal base images
FROM node:18-alpine    # ~180MB
# vs
FROM node:18           # ~1GB

# ✅ Use official images
FROM nginx:1.25

# ❌ Avoid unknown sources
FROM random-user/nginx
```

### Dockerfile Best Practices

```dockerfile
# ✅ Order instructions by change frequency
# (least changing first for better caching)

FROM node:18-alpine

# Rarely changes
WORKDIR /app

# Changes occasionally
COPY package*.json ./
RUN npm ci --only=production

# Changes frequently
COPY . .

CMD ["node", "app.js"]
```

### Security Best Practices

```dockerfile
# ✅ Run as non-root user
FROM node:18-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ✅ Don't store secrets in images
# Use environment variables or secrets management

# ✅ Scan images for vulnerabilities
# docker scout cves my-image
```

### Container Best Practices

```bash
# ✅ Use named containers
docker run -d --name my-app nginx

# ✅ Set resource limits
docker run -d --memory=512m --cpus=1 nginx

# ✅ Use restart policies
docker run -d --restart unless-stopped nginx

# ✅ Use health checks
docker run -d --health-cmd="curl -f http://localhost/" nginx
```

### Development Best Practices

```bash
# ✅ Use .dockerignore
# .dockerignore
node_modules
.git
*.log
.env

# ✅ Use bind mounts for development
docker run -v $(pwd):/app my-app

# ✅ Use docker-compose for multi-container
docker-compose up -d
```

### Cleanup Best Practices

```bash
# ✅ Regular cleanup
docker system prune -a

# ✅ Remove unused volumes
docker volume prune

# ✅ Remove dangling images
docker image prune

# ✅ Set log limits
docker run --log-opt max-size=10m --log-opt max-file=3 nginx
```

### Common Mistakes to Avoid

```
❌ Using latest tag in production
❌ Running as root
❌ Storing secrets in images
❌ Not using .dockerignore
❌ Installing unnecessary packages
❌ Not setting resource limits
❌ Ignoring security updates
❌ Not cleaning up unused resources
❌ Using bind mounts in production
❌ Not using health checks
```

### Checklist for New Projects

```
□ Choose appropriate base image
□ Use specific version tags
□ Create .dockerignore file
□ Run as non-root user
□ Set up health checks
□ Configure logging
□ Set resource limits
□ Use multi-stage builds
□ Scan for vulnerabilities
□ Document with README
```

