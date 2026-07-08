# Lab 677: Volume Sharing Between Containers

## LEARNING CONCEPT

Sharing data between containers using volumes.

## EXERCISE

1. Share volumes between containers
2. Use volumes-from
3. Implement data patterns

## SOLUTION

### Share Named Volume

```bash
# Create shared volume
docker volume create shared-data

# Container 1: Writer
docker run -d \
    --name writer \
    -v shared-data:/data \
    alpine sh -c "while true; do date >> /data/log.txt; sleep 1; done"

# Container 2: Reader
docker run -it \
    --name reader \
    -v shared-data:/data \
    alpine tail -f /data/log.txt
```

### Volumes From

```bash
# Create data container
docker create \
    --name data-container \
    -v /data \
    alpine

# Use volumes from data container
docker run -d \
    --name app1 \
    --volumes-from data-container \
    my-app

docker run -d \
    --name app2 \
    --volumes-from data-container \
    my-app
```

### Read-Only Sharing

```bash
# Writer container
docker run -d \
    --name writer \
    -v shared-data:/data \
    alpine sh -c "while true; do date >> /data/log.txt; sleep 1; done"

# Reader container (read-only)
docker run -d \
    --name reader \
    -v shared-data:/data:ro \
    alpine tail -f /data/log.txt
```

### Sidecar Pattern

```bash
# Main application
docker run -d \
    --name app \
    -v app-logs:/var/log/app \
    my-app

# Log shipper sidecar
docker run -d \
    --name log-shipper \
    -v app-logs:/logs:ro \
    log-shipper
```

### Init Container Pattern

```bash
# Init container prepares data
docker run --rm \
    -v app-data:/data \
    alpine sh -c "echo 'initialized' > /data/init.txt"

# Main container uses prepared data
docker run -d \
    --name app \
    -v app-data:/data \
    my-app
```

### Docker Compose Sharing

```yaml
version: '3'
services:
  writer:
    image: alpine
    volumes:
      - shared-data:/data
    command: sh -c "while true; do date >> /data/log.txt; sleep 1; done"

  reader:
    image: alpine
    volumes:
      - shared-data:/data:ro
    command: tail -f /data/log.txt
    depends_on:
      - writer

volumes:
  shared-data:
```

### Database with Backup Sidecar

```yaml
version: '3'
services:
  postgres:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret

  backup:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data:ro
      - ./backups:/backups
    command: >
      sh -c "while true; do
        pg_dump -h postgres -U postgres mydb > /backups/backup.sql;
        sleep 3600;
      done"
    depends_on:
      - postgres

volumes:
  pgdata:
```

### File Upload Pattern

```yaml
version: '3'
services:
  api:
    image: my-api
    volumes:
      - uploads:/app/uploads

  processor:
    image: my-processor
    volumes:
      - uploads:/data/uploads:ro

  cdn:
    image: nginx
    volumes:
      - uploads:/usr/share/nginx/html/uploads:ro

volumes:
  uploads:
```

### Best Practices

```
✅ Use named volumes for sharing
✅ Use read-only when possible
✅ Consider data ownership
✅ Handle concurrent access
✅ Document volume dependencies
✅ Use appropriate patterns
```

### Concurrent Access Considerations

```
- Multiple readers: Safe
- Single writer, multiple readers: Generally safe
- Multiple writers: Requires coordination
- Database files: Use database replication instead
```

