# Lab 676: tmpfs Mounts

## LEARNING CONCEPT

Using tmpfs mounts for temporary in-memory storage.

### tmpfs Characteristics:
- Stored in memory
- Not persisted
- Fast access
- Good for sensitive data

## EXERCISE

1. Create tmpfs mounts
2. Configure options
3. Use appropriately

## SOLUTION

### Basic tmpfs Mount

```bash
# Mount tmpfs
docker run -d \
    --tmpfs /tmp \
    nginx

# With --mount syntax
docker run -d \
    --mount type=tmpfs,destination=/tmp \
    nginx
```

### tmpfs Options

```bash
# Set size limit
docker run -d \
    --mount type=tmpfs,destination=/tmp,tmpfs-size=100m \
    nginx

# Set mode (permissions)
docker run -d \
    --mount type=tmpfs,destination=/tmp,tmpfs-mode=1777 \
    nginx

# Combined options
docker run -d \
    --mount type=tmpfs,destination=/tmp,tmpfs-size=100m,tmpfs-mode=1777 \
    nginx
```

### Use Cases

```bash
# Temporary files
docker run -d \
    --tmpfs /tmp \
    my-app

# Session storage
docker run -d \
    --tmpfs /var/lib/php/sessions \
    php:apache

# Sensitive data (not persisted)
docker run -d \
    --tmpfs /run/secrets \
    my-app

# Build cache (ephemeral)
docker run -d \
    --tmpfs /app/.cache \
    my-build
```

### Read-Only with tmpfs

```bash
# Read-only filesystem with writable tmpfs
docker run -d \
    --read-only \
    --tmpfs /tmp \
    --tmpfs /var/run \
    nginx
```

### Multiple tmpfs Mounts

```bash
docker run -d \
    --tmpfs /tmp \
    --tmpfs /var/cache \
    --tmpfs /var/log \
    my-app
```

### Docker Compose tmpfs

```yaml
version: '3'
services:
  app:
    image: my-app
    tmpfs:
      - /tmp
      - /var/cache
    
  web:
    image: nginx
    tmpfs:
      - /tmp:size=100m,mode=1777
```

### Performance Comparison

```bash
# tmpfs (memory) - fastest
docker run --rm \
    --tmpfs /data \
    alpine dd if=/dev/zero of=/data/test bs=1M count=100

# Volume (disk)
docker run --rm \
    -v test-vol:/data \
    alpine dd if=/dev/zero of=/data/test bs=1M count=100

# Bind mount (disk)
docker run --rm \
    -v $(pwd)/data:/data \
    alpine dd if=/dev/zero of=/data/test bs=1M count=100
```

### Security Use Case

```bash
# Store secrets in tmpfs (not persisted to disk)
docker run -d \
    --tmpfs /run/secrets:size=1m,mode=0700 \
    -e SECRET_FILE=/run/secrets/api_key \
    my-app

# Data disappears when container stops
```

### Comparison Table

```
Type        Storage    Persists    Speed    Use Case
---------------------------------------------------------
Volume      Disk       Yes         Medium   Production data
Bind Mount  Disk       Yes         Medium   Development
tmpfs       Memory     No          Fast     Temp/sensitive
```

### Best Practices

```
✅ Use for temporary data
✅ Use for sensitive data
✅ Set appropriate size limits
✅ Combine with read-only filesystem
✅ Don't use for data that needs persistence
✅ Monitor memory usage
```

### Limitations

```
❌ Data lost on container stop
❌ Uses host memory
❌ Not shared between containers
❌ Linux only (not Windows containers)
```

