# Lab 693: Compose Volumes

## LEARNING CONCEPT

Managing volumes in Docker Compose.

## EXERCISE

1. Configure named volumes
2. Use bind mounts
3. Share volumes between services

## SOLUTION

### Named Volumes

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Volume Configuration

```yaml
version: '3.8'
volumes:
  pgdata:
    driver: local
    driver_opts:
      type: none
      device: /data/postgres
      o: bind
    
  nfs-data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.100,rw
      device: ":/path/to/share"
```

### Bind Mounts

```yaml
version: '3.8'
services:
  api:
    image: node:18
    volumes:
      # Short syntax
      - ./src:/app/src
      - ./config:/app/config:ro
      
      # Long syntax
      - type: bind
        source: ./data
        target: /app/data
        read_only: true
```

### tmpfs Mounts

```yaml
version: '3.8'
services:
  api:
    image: my-api
    tmpfs:
      - /tmp
      - /var/cache
    
    # Or with options
    volumes:
      - type: tmpfs
        target: /tmp
        tmpfs:
          size: 100000000  # 100MB
          mode: 1777
```

### Shared Volumes

```yaml
version: '3.8'
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

volumes:
  shared-data:
```

### External Volumes

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    volumes:
      - existing-volume:/var/lib/postgresql/data

volumes:
  existing-volume:
    external: true
    name: my-existing-volume
```

### Development vs Production

```yaml
# docker-compose.yml (base)
version: '3.8'
services:
  api:
    image: my-api
    volumes:
      - uploads:/app/uploads

volumes:
  uploads:

# docker-compose.override.yml (development)
version: '3.8'
services:
  api:
    volumes:
      - ./src:/app/src
      - node_modules:/app/node_modules

volumes:
  node_modules:

# docker-compose.prod.yml (production)
version: '3.8'
services:
  api:
    volumes:
      - uploads:/app/uploads

volumes:
  uploads:
    driver: local
```

### Volume Labels

```yaml
version: '3.8'
volumes:
  pgdata:
    labels:
      - "com.example.description=PostgreSQL data"
      - "com.example.backup=daily"
```

### Volume with Name

```yaml
version: '3.8'
volumes:
  pgdata:
    name: myapp-pgdata
    # Creates volume named 'myapp-pgdata' instead of 'projectname_pgdata'
```

### Complete Example

```yaml
version: '3.8'
services:
  api:
    build: ./api
    volumes:
      # Named volume for uploads
      - uploads:/app/uploads
      # Bind mount for config
      - ./config:/app/config:ro
      # tmpfs for temp files
      - type: tmpfs
        target: /tmp

  db:
    image: postgres:15
    volumes:
      # Named volume for data
      - pgdata:/var/lib/postgresql/data
      # Init scripts
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

  backup:
    image: postgres:15
    volumes:
      # Shared volume (read-only)
      - pgdata:/data:ro
      # Backup output
      - ./backups:/backups
    command: pg_dump -h db -U postgres > /backups/backup.sql

volumes:
  uploads:
    name: myapp-uploads
  pgdata:
    name: myapp-pgdata
```

### Best Practices

```
✅ Use named volumes for persistent data
✅ Use bind mounts for development
✅ Use tmpfs for temporary data
✅ Use read-only when possible
✅ Name volumes explicitly
✅ Document volume purpose
```

