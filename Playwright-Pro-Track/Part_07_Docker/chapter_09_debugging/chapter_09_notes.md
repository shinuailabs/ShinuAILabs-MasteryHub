# Part 09: Debugging Docker

## 📚 Overview
Debugging Docker containers helps identify and resolve issues in containerized test environments.

---

## 🎯 Key Concepts

### 1. Container Logs

```bash
# View logs
docker logs <container_id>

# Follow logs
docker logs -f <container_id>

# Last N lines
docker logs --tail 100 <container_id>

# With timestamps
docker logs -t <container_id>

# Since specific time
docker logs --since 10m <container_id>

# Docker Compose logs
docker-compose logs
docker-compose logs -f tests
docker-compose logs --tail 50 app
```

### 2. Interactive Shell

```bash
# Enter running container
docker exec -it <container_id> bash
docker exec -it <container_id> sh

# Run as specific user
docker exec -it -u root <container_id> bash

# With environment variable
docker exec -it -e DEBUG=true <container_id> bash

# Docker Compose
docker-compose exec tests bash
docker-compose exec app sh
```

### 3. Container Inspection

```bash
# Full inspection
docker inspect <container_id>

# Specific fields
docker inspect --format='{{.State.Status}}' <container_id>
docker inspect --format='{{.NetworkSettings.IPAddress}}' <container_id>
docker inspect --format='{{json .Config.Env}}' <container_id>

# View mounted volumes
docker inspect --format='{{json .Mounts}}' <container_id> | jq

# View network settings
docker inspect --format='{{json .NetworkSettings}}' <container_id> | jq
```

### 4. Debugging Failed Tests

```bash
# Run container without default command
docker run -it --entrypoint bash playwright-tests

# Inside container, run tests manually
npx playwright test --debug

# Run specific test
npx playwright test login.spec.ts --debug

# With trace
npx playwright test --trace on
```

### 5. Playwright Debug Mode

```dockerfile
# Dockerfile.debug
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY . .
RUN npm ci

# Enable debug mode
ENV PWDEBUG=1
ENV DEBUG=pw:api

CMD ["npx", "playwright", "test"]
```

```bash
# Run with debug environment
docker run -it \
  -e PWDEBUG=1 \
  -e DEBUG=pw:api \
  playwright-tests
```

### 6. Network Debugging

```bash
# Check container network
docker exec -it <container_id> ping app
docker exec -it <container_id> curl http://app:3000

# View network
docker network inspect bridge

# Check DNS resolution
docker exec -it <container_id> nslookup app

# Test connectivity
docker exec -it tests curl -v http://app:3000/health
```

### 7. Volume Debugging

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect <volume_name>

# Check mounted files
docker exec -it <container_id> ls -la /app

# Verify file contents
docker exec -it <container_id> cat /app/playwright.config.ts

# Check permissions
docker exec -it <container_id> stat /app/test-results
```

### 8. Resource Monitoring

```bash
# Container stats
docker stats

# Specific container
docker stats <container_id>

# Top processes
docker top <container_id>

# System info
docker system df
docker system info
```

### 9. Debugging Docker Compose

```yaml
# docker-compose.debug.yml
version: '3.8'

services:
  tests:
    build: .
    environment:
      - PWDEBUG=1
      - DEBUG=pw:api
    # Keep container running
    command: tail -f /dev/null
    # Or use sleep
    # command: sleep infinity
```

```bash
# Start with debug compose
docker-compose -f docker-compose.debug.yml up -d

# Enter container
docker-compose exec tests bash

# Run tests manually
npx playwright test --debug

# View real-time logs
docker-compose logs -f tests
```

### 10. Common Issues

```bash
# Permission denied
docker exec -it -u root <container_id> chown -R node:node /app

# Out of memory
docker run --memory=4g playwright-tests

# Timeout issues
docker run -e TIMEOUT=60000 playwright-tests

# Browser not found
docker exec -it <container_id> npx playwright install

# Network unreachable
docker network connect <network> <container>
```

---

## 💻 Practice Exercises

1. Debug container logs
2. Enter running container
3. Inspect container details
4. Debug network issues
5. Monitor resources

---

## ✅ Best Practices

- ✅ Use structured logging
- ✅ Keep containers running for debug
- ✅ Check network connectivity
- ✅ Monitor resource usage
- ❌ Don't ignore error logs
- ❌ Avoid running as root

---

## 📝 Quick Reference

```bash
# Logs
docker logs -f <id>
docker-compose logs -f

# Shell
docker exec -it <id> bash
docker-compose exec svc bash

# Inspect
docker inspect <id>
docker inspect --format='{{.State}}' <id>

# Network
docker exec -it <id> curl http://app:3000
docker network inspect <network>

# Debug mode
docker run -e PWDEBUG=1 image
```

