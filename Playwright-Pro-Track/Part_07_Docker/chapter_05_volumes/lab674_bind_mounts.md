# Lab 674: Bind Mounts

## LEARNING CONCEPT

Using bind mounts to share host filesystem with containers.

### Bind Mount Characteristics:
- Maps host path to container
- Real-time synchronization
- Host filesystem dependent
- Good for development

## EXERCISE

1. Create bind mounts
2. Use for development
3. Understand limitations

## SOLUTION

### Basic Bind Mount

```bash
# Mount current directory
docker run -d \
    -v $(pwd):/app \
    node:18 npm start

# Mount specific directory
docker run -d \
    -v /home/user/project:/app \
    node:18 npm start

# Using --mount syntax (more explicit)
docker run -d \
    --mount type=bind,source=$(pwd),target=/app \
    node:18 npm start
```

### Read-Only Bind Mount

```bash
# Read-only mount
docker run -d \
    -v $(pwd):/app:ro \
    nginx

# With --mount syntax
docker run -d \
    --mount type=bind,source=$(pwd),target=/app,readonly \
    nginx
```

### Development Setup

```bash
# Node.js development
docker run -d \
    --name dev \
    -v $(pwd):/app \
    -v /app/node_modules \
    -p 3000:3000 \
    node:18 npm run dev

# Exclude node_modules with anonymous volume
# This prevents host node_modules from overwriting container's
```

### Multiple Bind Mounts

```bash
# Mount multiple directories
docker run -d \
    -v $(pwd)/src:/app/src \
    -v $(pwd)/config:/app/config \
    -v $(pwd)/public:/app/public \
    my-app
```

### Bind Mount vs Volume

```
Bind Mount:
- Maps host path directly
- Host filesystem dependent
- Good for development
- Real-time sync

Volume:
- Managed by Docker
- Platform independent
- Good for production
- Better performance
```

### File Permissions

```bash
# Run as current user
docker run -d \
    -v $(pwd):/app \
    --user $(id -u):$(id -g) \
    node:18 npm start

# Fix permission issues
docker run -d \
    -v $(pwd):/app \
    -e CHOWN_USER=$(id -u) \
    my-app
```

### Development Workflow

```bash
# Start development container
docker run -d \
    --name dev \
    -v $(pwd):/app \
    -v /app/node_modules \
    -p 3000:3000 \
    -p 9229:9229 \
    node:18 npm run dev

# Changes on host reflect immediately in container
# Edit files locally, see changes in container
```

### Docker Compose Bind Mount

```yaml
version: '3'
services:
  app:
    image: node:18
    volumes:
      - ./src:/app/src
      - ./package.json:/app/package.json
      - node_modules:/app/node_modules
    ports:
      - "3000:3000"
    command: npm run dev

volumes:
  node_modules:
```

### Bind Mount Gotchas

```bash
# ❌ Path doesn't exist - creates empty directory
docker run -v /nonexistent:/app nginx

# ❌ File vs directory confusion
# If target is file, source must be file
docker run -v ./config.json:/app/config.json nginx

# ✅ Ensure source exists
mkdir -p ./data
docker run -v ./data:/app/data nginx
```

### Best Practices

```
✅ Use for development only
✅ Use absolute paths
✅ Handle permissions properly
✅ Exclude dependency directories
✅ Use volumes for production
✅ Document mount points
```

### Platform Differences

```bash
# macOS/Windows: Performance can be slow
# Use cached or delegated options
docker run -v $(pwd):/app:cached my-app

# Linux: Native performance
docker run -v $(pwd):/app my-app
```

