# Lab 722: Data Management

## LEARNING CONCEPT

Managing persistent data in Docker containers.

## EXERCISE

1. Use volumes effectively
2. Implement backup strategies
3. Handle data migrations

## SOLUTION

### Volume Types

```bash
# Named volume
docker run -v mydata:/data myapp

# Bind mount
docker run -v $(pwd)/data:/data myapp

# tmpfs mount
docker run --tmpfs /tmp myapp

# Read-only
docker run -v mydata:/data:ro myapp
```

### Create and Manage Volumes

```bash
# Create volume
docker volume create mydata

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata

# Prune unused volumes
docker volume prune
```

### Docker Compose Volumes

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  pgdata:
    name: myapp-pgdata
```

### Backup Volumes

```bash
# Backup to tar
docker run --rm \
    -v mydata:/data \
    -v $(pwd):/backup \
    alpine tar cvf /backup/backup.tar /data

# Restore from tar
docker run --rm \
    -v mydata:/data \
    -v $(pwd):/backup \
    alpine tar xvf /backup/backup.tar -C /
```

### Database Backup

```bash
# PostgreSQL backup
docker exec postgres pg_dump -U postgres mydb > backup.sql

# PostgreSQL restore
docker exec -i postgres psql -U postgres mydb < backup.sql

# MySQL backup
docker exec mysql mysqldump -u root -p mydb > backup.sql
```

### Volume Drivers

```bash
# Local driver (default)
docker volume create --driver local mydata

# NFS volume
docker volume create \
    --driver local \
    --opt type=nfs \
    --opt o=addr=192.168.1.100,rw \
    --opt device=:/path/to/share \
    nfs-data
```

### Data Migration

```bash
# Copy data between volumes
docker run --rm \
    -v source-vol:/source \
    -v dest-vol:/dest \
    alpine cp -a /source/. /dest/

# Copy from container to host
docker cp container:/data ./data

# Copy from host to container
docker cp ./data container:/data
```

### Volume Permissions

```dockerfile
# Set ownership in Dockerfile
FROM node:18-alpine

RUN mkdir -p /app/data && chown -R node:node /app/data

USER node
WORKDIR /app

VOLUME /app/data
```

### Shared Volumes

```yaml
version: '3.8'
services:
  writer:
    image: alpine
    volumes:
      - shared:/data
    command: sh -c "while true; do date >> /data/log.txt; sleep 1; done"

  reader:
    image: alpine
    volumes:
      - shared:/data:ro
    command: tail -f /data/log.txt

volumes:
  shared:
```

### Volume Labels

```bash
docker volume create \
    --label project=myapp \
    --label environment=production \
    mydata
```

### Cleanup Strategy

```bash
# Remove unused volumes
docker volume prune

# Remove specific volumes
docker volume rm mydata

# Remove volumes with containers
docker rm -v mycontainer

# List dangling volumes
docker volume ls -f dangling=true
```

### Best Practices

```
✅ Use named volumes for persistence
✅ Use bind mounts for development
✅ Use tmpfs for sensitive data
✅ Regular backups
✅ Document volume purpose
✅ Set proper permissions
✅ Clean up unused volumes
```

### Checklist

```
□ Use named volumes for data
□ Implement backup strategy
□ Test restore procedures
□ Set proper permissions
□ Document data locations
□ Regular cleanup
□ Monitor disk usage
```

