# Lab 657: Container Storage

## LEARNING CONCEPT

Managing data persistence in Docker containers.

### Storage Types:
- Volumes (managed by Docker)
- Bind mounts (host filesystem)
- tmpfs mounts (memory)

## EXERCISE

1. Use volumes
2. Use bind mounts
3. Understand persistence

## SOLUTION

### Docker Volumes

```bash
# Create volume
docker volume create my-volume

# List volumes
docker volume ls

# Inspect volume
docker volume inspect my-volume

# Use volume in container
docker run -d \
    --name db \
    -v my-volume:/var/lib/postgresql/data \
    postgres:15

# Remove volume
docker volume rm my-volume

# Remove unused volumes
docker volume prune
```

### Named Volumes

```bash
# Create and use named volume
docker run -d \
    --name db \
    -v postgres-data:/var/lib/postgresql/data \
    postgres:15

# Volume persists after container removal
docker rm -f db

# Data still exists
docker volume ls
# postgres-data still there

# Reuse volume
docker run -d \
    --name db2 \
    -v postgres-data:/var/lib/postgresql/data \
    postgres:15
```

### Bind Mounts

```bash
# Mount host directory
docker run -d \
    --name web \
    -v $(pwd)/html:/usr/share/nginx/html \
    nginx

# Read-only mount
docker run -d \
    --name web \
    -v $(pwd)/html:/usr/share/nginx/html:ro \
    nginx

# Using --mount syntax (more explicit)
docker run -d \
    --name web \
    --mount type=bind,source=$(pwd)/html,target=/usr/share/nginx/html \
    nginx
```

### tmpfs Mounts

```bash
# Mount tmpfs (memory)
docker run -d \
    --name app \
    --tmpfs /tmp \
    my-app

# With size limit
docker run -d \
    --name app \
    --mount type=tmpfs,destination=/tmp,tmpfs-size=100m \
    my-app
```

### Volume vs Bind Mount

```
Volumes:
✅ Managed by Docker
✅ Easy to backup
✅ Works on all platforms
✅ Can be shared between containers
✅ Better for production

Bind Mounts:
✅ Direct access to host files
✅ Real-time sync
✅ Good for development
❌ Platform-dependent paths
❌ Security concerns
```

### Sharing Volumes

```bash
# Create shared volume
docker volume create shared-data

# Container 1 writes
docker run -d \
    --name writer \
    -v shared-data:/data \
    alpine sh -c "while true; do date >> /data/log.txt; sleep 1; done"

# Container 2 reads
docker run -it \
    --name reader \
    -v shared-data:/data \
    alpine tail -f /data/log.txt
```

### Backup and Restore

```bash
# Backup volume
docker run --rm \
    -v my-volume:/data \
    -v $(pwd):/backup \
    alpine tar czf /backup/backup.tar.gz -C /data .

# Restore volume
docker run --rm \
    -v my-volume:/data \
    -v $(pwd):/backup \
    alpine tar xzf /backup/backup.tar.gz -C /data
```

### Volume Drivers

```bash
# Use specific driver
docker volume create \
    --driver local \
    --opt type=nfs \
    --opt o=addr=192.168.1.1,rw \
    --opt device=:/path/to/dir \
    nfs-volume
```

### Development Setup

```bash
# Development with bind mount
docker run -d \
    --name dev \
    -v $(pwd):/app \
    -v /app/node_modules \
    -p 3000:3000 \
    node:18 npm run dev

# Exclude node_modules from bind mount
# by creating anonymous volume
```

