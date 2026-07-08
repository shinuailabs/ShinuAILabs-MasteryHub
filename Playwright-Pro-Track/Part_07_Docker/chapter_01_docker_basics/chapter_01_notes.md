# Part 01: Docker Basics

## 📚 Overview
Docker enables containerization, providing consistent environments for running applications and tests.

---

## 🎯 Key Concepts

### 1. What is Docker?

```bash
# Docker = Containerization platform
# - Packages applications with dependencies
# - Consistent environments across machines
# - Lightweight compared to VMs
# - Isolation between containers
# - Easy to share and deploy
```

### 2. Docker Architecture

```
┌─────────────────────────────────────┐
│           Docker Client             │
│         (docker commands)           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           Docker Daemon             │
│         (dockerd service)           │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│     Images    │    Containers       │
│   (templates) │ (running instances) │
└─────────────────────────────────────┘
```

### 3. Installation

```bash
# macOS
brew install --cask docker

# Ubuntu
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Verify installation
docker --version
docker run hello-world
```

### 4. Basic Commands

```bash
# Pull an image
docker pull node:18

# List images
docker images

# Run a container
docker run -it node:18 bash

# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# Remove an image
docker rmi <image_id>
```

### 5. Running Containers

```bash
# Run in detached mode
docker run -d nginx

# Run with port mapping
docker run -d -p 8080:80 nginx

# Run with name
docker run -d --name my-nginx -p 8080:80 nginx

# Run with environment variables
docker run -d -e NODE_ENV=production node:18

# Run with volume mount
docker run -d -v $(pwd):/app node:18

# Run interactively
docker run -it ubuntu bash
```

### 6. Container Management

```bash
# View container logs
docker logs <container_id>

# Follow logs
docker logs -f <container_id>

# Execute command in running container
docker exec -it <container_id> bash

# Copy files to/from container
docker cp file.txt <container_id>:/app/
docker cp <container_id>:/app/file.txt ./

# Inspect container
docker inspect <container_id>

# View container stats
docker stats
```

### 7. Image Management

```bash
# Search for images
docker search node

# Pull specific version
docker pull node:18-alpine

# Tag an image
docker tag myapp:latest myapp:v1.0

# Push to registry
docker push username/myapp:v1.0

# Build from Dockerfile
docker build -t myapp:latest .

# View image history
docker history node:18
```

### 8. Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune

# Remove everything including volumes
docker system prune -a --volumes

# Remove specific container
docker rm -f <container_id>

# Remove all containers
docker rm -f $(docker ps -aq)
```

### 9. Docker for Testing

```bash
# Run Playwright tests in container
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.40.0-jammy \
  npx playwright test

# Run with display for headed mode
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  -e DISPLAY=:0 \
  mcr.microsoft.com/playwright:v1.40.0-jammy \
  npx playwright test --headed
```

---

## 💻 Practice Exercises

1. Install Docker
2. Pull and run images
3. Manage containers
4. Use port mapping
5. Mount volumes

---

## ✅ Best Practices

- ✅ Use specific image tags
- ✅ Clean up unused resources
- ✅ Use meaningful container names
- ✅ Mount volumes for persistence
- ❌ Don't use `latest` tag in production
- ❌ Avoid running as root

---

## 📝 Quick Reference

```bash
# Essential commands
docker pull <image>           # Download image
docker run <image>            # Run container
docker ps                     # List containers
docker stop <id>              # Stop container
docker rm <id>                # Remove container
docker images                 # List images
docker rmi <id>               # Remove image
docker logs <id>              # View logs
docker exec -it <id> bash     # Enter container
docker build -t name .        # Build image
```

