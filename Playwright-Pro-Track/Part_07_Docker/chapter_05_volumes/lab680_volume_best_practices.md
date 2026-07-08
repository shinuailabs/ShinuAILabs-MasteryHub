# Lab 680: Volume Best Practices

## LEARNING CONCEPT

Comprehensive best practices for Docker volumes.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Validate compliance

## SOLUTION

### Choosing Volume Type

```
Use Named Volumes for:
✅ Database data
✅ Application state
✅ Shared data between containers
✅ Production environments

Use Bind Mounts for:
✅ Development (source code)
✅ Configuration files
✅ Build contexts

Use tmpfs for:
✅ Temporary data
✅ Sensitive data
✅ Cache that doesn't need persistence
```

### Naming Conventions

```bash
# Use descriptive names
docker volume create postgres-data
docker volume create app-uploads
docker volume create redis-cache

# Include environment
docker volume create postgres-data-prod
docker volume create postgres-data-dev

# Include version if needed
docker volume create postgres-data-v15
```

### Security Best Practices

```bash
# Use read-only when possible
docker run -v data:/data:ro my-app

# Limit volume scope
docker run -v data:/app/data my-app  # Not /data

# Don't mount sensitive host paths
# ❌ docker run -v /etc:/etc my-app
# ❌ docker run -v /var/run/docker.sock:/var/run/docker.sock my-app
```

### Backup Strategy

```bash
# Regular backups
#!/bin/bash
VOLUMES=$(docker volume ls -q)
for vol in $VOLUMES; do
    docker run --rm \
        -v $vol:/data \
        -v /backups:/backup \
        alpine tar czf /backup/${vol}_$(date +%Y%m%d).tar.gz -C /data .
done

# Retention policy
find /backups -name "*.tar.gz" -mtime +30 -delete
```

### Cleanup Strategy

```bash
# Remove unused volumes
docker volume prune

# Remove specific volumes
docker volume rm old-volume

# Remove volumes with containers
docker rm -v my-container

# Automated cleanup
docker system prune --volumes
```

### Performance Optimization

```bash
# Use volumes over bind mounts for performance
docker run -v my-volume:/data my-app

# Use tmpfs for temporary data
docker run --tmpfs /tmp my-app

# Avoid bind mounts on macOS/Windows for heavy I/O
```

### Docker Compose Best Practices

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    volumes:
      - type: volume
        source: pgdata
        target: /var/lib/postgresql/data
    
  app:
    image: my-app
    volumes:
      # Named volume for persistent data
      - type: volume
        source: uploads
        target: /app/uploads
      # tmpfs for temp data
      - type: tmpfs
        target: /tmp

volumes:
  pgdata:
    name: myapp-pgdata
  uploads:
    name: myapp-uploads
```

### Documentation

```yaml
# Document volumes in docker-compose.yml
volumes:
  pgdata:
    # PostgreSQL data directory
    # Backup: daily at 2 AM
    # Retention: 30 days
    name: myapp-pgdata
    
  uploads:
    # User uploaded files
    # Backup: hourly
    # Max size: 10GB
    name: myapp-uploads
```

### Monitoring

```bash
# Check volume disk usage
docker system df -v

# Monitor specific volume
du -sh /var/lib/docker/volumes/my-volume/_data

# Alert on high usage
USAGE=$(docker system df --format '{{.Size}}' | head -1)
```

### Checklist

```
Planning:
□ Choose appropriate volume type
□ Use descriptive names
□ Document volume purpose

Security:
□ Use read-only when possible
□ Limit volume scope
□ Don't mount sensitive paths

Operations:
□ Implement backup strategy
□ Set up retention policy
□ Monitor disk usage
□ Plan for cleanup

Performance:
□ Use volumes over bind mounts
□ Use tmpfs for temp data
□ Consider I/O patterns
```

### Common Mistakes

```
❌ Not backing up volumes
❌ Using bind mounts in production
❌ Mounting entire host directories
❌ Not cleaning up unused volumes
❌ Not documenting volume usage
❌ Ignoring volume permissions
❌ Not testing restore procedures
```

