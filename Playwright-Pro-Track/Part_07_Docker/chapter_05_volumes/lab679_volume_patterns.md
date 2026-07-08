# Lab 679: Volume Patterns

## LEARNING CONCEPT

Common patterns for using Docker volumes effectively.

## EXERCISE

1. Learn volume patterns
2. Apply to projects
3. Choose appropriate pattern

## SOLUTION

### Data Container Pattern

```bash
# Create data-only container
docker create \
    --name data \
    -v /var/lib/postgresql/data \
    -v /var/log \
    busybox

# Use data container
docker run -d \
    --name db \
    --volumes-from data \
    postgres:15

# Backup data container
docker run --rm \
    --volumes-from data \
    -v $(pwd):/backup \
    alpine tar czf /backup/data.tar.gz /var/lib/postgresql/data
```

### Sidecar Pattern

```yaml
version: '3'
services:
  app:
    image: my-app
    volumes:
      - logs:/var/log/app

  log-shipper:
    image: fluentd
    volumes:
      - logs:/var/log/app:ro
    depends_on:
      - app

volumes:
  logs:
```

### Init Container Pattern

```yaml
version: '3'
services:
  init:
    image: alpine
    volumes:
      - config:/config
    command: sh -c "cp /defaults/* /config/"
    
  app:
    image: my-app
    volumes:
      - config:/app/config:ro
    depends_on:
      init:
        condition: service_completed_successfully

volumes:
  config:
```

### Ambassador Pattern

```yaml
version: '3'
services:
  app:
    image: my-app
    volumes:
      - socket:/var/run/app

  ambassador:
    image: nginx
    volumes:
      - socket:/var/run/app:ro
    ports:
      - "80:80"

volumes:
  socket:
```

### Backup Sidecar Pattern

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
      - pgdata:/data:ro
      - ./backups:/backups
    entrypoint: /bin/sh
    command: >
      -c "while true; do
        PGPASSWORD=secret pg_dump -h postgres -U postgres > /backups/backup.sql;
        sleep 86400;
      done"

volumes:
  pgdata:
```

### Development Pattern

```yaml
version: '3'
services:
  app:
    image: node:18
    volumes:
      # Source code (bind mount)
      - ./src:/app/src
      # Dependencies (named volume)
      - node_modules:/app/node_modules
      # Config (bind mount, read-only)
      - ./config:/app/config:ro
    command: npm run dev

volumes:
  node_modules:
```

### Multi-Environment Pattern

```yaml
# docker-compose.yml (base)
version: '3'
services:
  app:
    image: my-app
    volumes:
      - app-data:/data

volumes:
  app-data:

# docker-compose.dev.yml
version: '3'
services:
  app:
    volumes:
      - ./data:/data  # Bind mount for dev

# docker-compose.prod.yml
version: '3'
services:
  app:
    volumes:
      - app-data:/data  # Named volume for prod
```

### Shared Cache Pattern

```yaml
version: '3'
services:
  build1:
    image: node:18
    volumes:
      - npm-cache:/root/.npm
    command: npm ci

  build2:
    image: node:18
    volumes:
      - npm-cache:/root/.npm
    command: npm ci

volumes:
  npm-cache:
```

### Pattern Selection Guide

```
Pattern              Use Case
-----------------------------------------
Data Container       Legacy, data isolation
Sidecar              Log shipping, monitoring
Init Container       Configuration, setup
Ambassador           Protocol translation
Backup Sidecar       Automated backups
Development          Local development
Multi-Environment    Dev/prod differences
Shared Cache         Build optimization
```

