# Lab 673: Docker Volume Basics

## LEARNING CONCEPT

Understanding Docker volumes for persistent data.

### Volume Types:
- Named volumes
- Anonymous volumes
- Bind mounts
- tmpfs mounts

## EXERCISE

1. Create and use volumes
2. Understand persistence
3. Manage volume lifecycle

## SOLUTION

### Create Volumes

```bash
# Create named volume
docker volume create my-volume

# List volumes
docker volume ls

# Inspect volume
docker volume inspect my-volume

# Remove volume
docker volume rm my-volume
```

### Use Volumes

```bash
# Mount named volume
docker run -d \
    --name db \
    -v my-volume:/var/lib/postgresql/data \
    postgres:15

# Mount with --mount syntax
docker run -d \
    --name db \
    --mount source=my-volume,target=/var/lib/postgresql/data \
    postgres:15

# Anonymous volume
docker run -d \
    -v /var/lib/postgresql/data \
    postgres:15
```

### Volume Persistence

```bash
# Create container with volume
docker run -d --name db1 -v pgdata:/var/lib/postgresql/data postgres:15

# Add data
docker exec db1 psql -U postgres -c "CREATE TABLE test (id INT);"

# Remove container
docker rm -f db1

# Create new container with same volume
docker run -d --name db2 -v pgdata:/var/lib/postgresql/data postgres:15

# Data persists!
docker exec db2 psql -U postgres -c "SELECT * FROM test;"
```

### Volume Options

```bash
# Read-only volume
docker run -d \
    -v my-volume:/data:ro \
    nginx

# With --mount syntax
docker run -d \
    --mount source=my-volume,target=/data,readonly \
    nginx
```

### Volume Drivers

```bash
# Create with specific driver
docker volume create \
    --driver local \
    --opt type=nfs \
    --opt o=addr=192.168.1.1,rw \
    --opt device=:/path/to/dir \
    nfs-volume

# List available drivers
docker plugin ls
```

### Volume Cleanup

```bash
# Remove specific volume
docker volume rm my-volume

# Remove unused volumes
docker volume prune

# Remove all unused volumes (force)
docker volume prune -f

# Remove volumes with container
docker rm -v my-container
```

### Inspect Volume Data

```bash
# Find volume location
docker volume inspect my-volume --format '{{.Mountpoint}}'

# On Linux, typically:
# /var/lib/docker/volumes/my-volume/_data

# List files in volume
docker run --rm -v my-volume:/data alpine ls -la /data
```

### Copy Data to/from Volume

```bash
# Copy to volume
docker run --rm \
    -v my-volume:/data \
    -v $(pwd):/source \
    alpine cp -r /source/. /data/

# Copy from volume
docker run --rm \
    -v my-volume:/data \
    -v $(pwd):/dest \
    alpine cp -r /data/. /dest/
```

### Volume in Dockerfile

```dockerfile
# Declare volume mount point
FROM postgres:15

VOLUME /var/lib/postgresql/data

# Data at this path will be persisted
```

### Best Practices

```
✅ Use named volumes for important data
✅ Use volumes for databases
✅ Backup volumes regularly
✅ Use read-only when possible
✅ Clean up unused volumes
✅ Document volume usage
```

