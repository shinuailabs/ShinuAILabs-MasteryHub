# Part 05: Volumes and Networking

## 📚 Overview
Docker volumes persist data and networks enable container communication for test environments.

---

## 🎯 Key Concepts

### 1. Volume Types

```bash
# Bind mount - maps host directory
docker run -v /host/path:/container/path image

# Named volume - Docker managed
docker run -v myvolume:/container/path image

# Anonymous volume - temporary
docker run -v /container/path image

# Read-only mount
docker run -v /host/path:/container/path:ro image
```

### 2. Creating and Managing Volumes

```bash
# Create volume
docker volume create test-data

# List volumes
docker volume ls

# Inspect volume
docker volume inspect test-data

# Remove volume
docker volume rm test-data

# Remove unused volumes
docker volume prune
```

### 3. Volumes for Test Reports

```bash
# Mount test results directory
docker run --rm \
  -v $(pwd)/tests:/app/tests \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-tests

# Named volume for caching
docker run --rm \
  -v node_modules:/app/node_modules \
  -v $(pwd):/app \
  playwright-tests
```

### 4. Docker Compose Volumes

```yaml
version: '3.8'

services:
  tests:
    build: .
    volumes:
      # Bind mount for source
      - ./tests:/app/tests
      # Named volume for node_modules
      - node_modules:/app/node_modules
      # Bind mount for reports
      - ./test-results:/app/test-results

volumes:
  node_modules:
```

### 5. Network Types

```bash
# Bridge network (default)
docker network create my-network

# Host network (shares host network)
docker run --network host image

# None (no networking)
docker run --network none image

# Connect to existing network
docker run --network my-network image
```

### 6. Creating and Managing Networks

```bash
# Create network
docker network create test-network

# List networks
docker network ls

# Inspect network
docker network inspect test-network

# Connect container to network
docker network connect test-network container_name

# Disconnect from network
docker network disconnect test-network container_name

# Remove network
docker network rm test-network
```

### 7. Container Communication

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: ./web
    ports:
      - "3000:3000"
    networks:
      - app-network

  api:
    build: ./api
    ports:
      - "4000:4000"
    networks:
      - app-network

  tests:
    build: ./tests
    environment:
      # Use service names as hostnames
      - WEB_URL=http://web:3000
      - API_URL=http://api:4000
    networks:
      - app-network
    depends_on:
      - web
      - api

networks:
  app-network:
    driver: bridge
```

### 8. DNS Resolution

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Use Docker service name
    baseURL: process.env.BASE_URL || 'http://web:3000',
  },
});
```

```yaml
# docker-compose.yml
services:
  playwright:
    environment:
      - BASE_URL=http://app:3000
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

### 9. Network Isolation

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    networks:
      - frontend-network

  backend:
    build: ./backend
    networks:
      - frontend-network
      - backend-network

  database:
    image: postgres:15
    networks:
      - backend-network

  tests:
    build: ./tests
    networks:
      - frontend-network
    # Can only access frontend, not database

networks:
  frontend-network:
  backend-network:
```

### 10. Volume Caching for CI

```yaml
# docker-compose.ci.yml
version: '3.8'

services:
  tests:
    build: .
    volumes:
      # Cache npm packages
      - npm-cache:/root/.npm
      # Cache Playwright browsers
      - playwright-cache:/root/.cache/ms-playwright
      # Output reports
      - ./test-results:/app/test-results

volumes:
  npm-cache:
  playwright-cache:
```

---

## 💻 Practice Exercises

1. Create named volumes
2. Set up bind mounts
3. Create custom network
4. Configure container communication
5. Implement volume caching

---

## ✅ Best Practices

- ✅ Use named volumes for persistence
- ✅ Use bind mounts for development
- ✅ Create custom networks
- ✅ Use service names for DNS
- ❌ Don't store data in containers
- ❌ Avoid default bridge network

---

## 📝 Quick Reference

```bash
# Volumes
docker volume create name
docker run -v name:/path image
docker run -v /host:/container image

# Networks
docker network create name
docker run --network name image

# Compose
volumes:
  - ./local:/container
  - named:/container
networks:
  - custom-network
```

