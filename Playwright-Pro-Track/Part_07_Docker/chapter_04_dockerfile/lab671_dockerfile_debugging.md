# Lab 671: Dockerfile Debugging

## LEARNING CONCEPT

Debugging Dockerfile build issues.

### Common Issues:
- Build failures
- Cache problems
- Layer issues
- Runtime errors

## EXERCISE

1. Debug build failures
2. Inspect layers
3. Troubleshoot issues

## SOLUTION

### View Build Output

```bash
# Verbose build output
docker build --progress=plain -t my-app .

# No cache (see all steps)
docker build --no-cache --progress=plain -t my-app .
```

### Debug Failed Builds

```bash
# Build stops at failed step
# Run container from last successful layer
docker run -it <last-successful-image-id> sh

# Or use BuildKit debug
DOCKER_BUILDKIT=1 docker build --progress=plain -t my-app .
```

### Inspect Intermediate Layers

```bash
# Build with intermediate containers
DOCKER_BUILDKIT=0 docker build -t my-app .

# List all images including intermediate
docker images -a

# Run intermediate layer
docker run -it <intermediate-image-id> sh
```

### Debug RUN Commands

```dockerfile
# Add debugging to RUN
RUN set -x && \
    npm ci && \
    ls -la node_modules

# Or split into multiple RUN for debugging
RUN npm ci
RUN ls -la node_modules
```

### Check Build Context

```bash
# See what's being sent to daemon
docker build --progress=plain -t my-app . 2>&1 | head -20

# Check .dockerignore
cat .dockerignore

# List files in context
tar -cvf - . | tar -tvf - | head -50
```

### Debug COPY Issues

```dockerfile
# Verify files exist
RUN ls -la /app

# Check file permissions
RUN ls -la /app/script.sh

# Debug COPY
COPY . /app/
RUN find /app -type f | head -20
```

### Debug Environment Variables

```dockerfile
# Print environment
RUN env

# Print specific variable
RUN echo "NODE_ENV=$NODE_ENV"

# Debug ARG
ARG VERSION
RUN echo "Building version: $VERSION"
```

### Debug Network Issues

```dockerfile
# Test network connectivity
RUN curl -v https://registry.npmjs.org/

# Check DNS
RUN nslookup registry.npmjs.org

# Use verbose npm
RUN npm ci --verbose
```

### Debug Permission Issues

```dockerfile
# Check current user
RUN whoami
RUN id

# Check file ownership
RUN ls -la /app

# Fix permissions
RUN chown -R node:node /app
```

### Common Build Errors

```bash
# Error: COPY failed: file not found
# Solution: Check .dockerignore, verify file exists

# Error: npm ERR! code EACCES
# Solution: Don't run npm as root, or fix permissions

# Error: exec format error
# Solution: Check base image architecture, use --platform

# Error: no space left on device
# Solution: docker system prune -a
```

### Debug Running Container

```bash
# Shell into running container
docker exec -it my-container sh

# View logs
docker logs my-container
docker logs -f my-container

# Inspect container
docker inspect my-container

# View processes
docker top my-container

# View resource usage
docker stats my-container
```

### Debug Health Check

```bash
# View health status
docker inspect --format='{{json .State.Health}}' my-container | jq

# Run health check manually
docker exec my-container curl -f http://localhost:3000/health
```

### Debugging Checklist

```
□ Check build output with --progress=plain
□ Verify .dockerignore
□ Check file permissions
□ Verify environment variables
□ Test network connectivity
□ Check disk space
□ Inspect intermediate layers
□ Review logs
```

