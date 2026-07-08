# Lab 691: Compose Services Configuration

## LEARNING CONCEPT

Configuring services in Docker Compose.

## EXERCISE

1. Configure service options
2. Use build configurations
3. Set resource limits

## SOLUTION

### Service Configuration

```yaml
version: '3.8'
services:
  api:
    # Image or build
    image: my-api:latest
    # Or
    build:
      context: ./api
      dockerfile: Dockerfile
    
    # Container name
    container_name: my-api
    
    # Restart policy
    restart: unless-stopped
    
    # Command override
    command: npm run start:prod
    
    # Entrypoint override
    entrypoint: /app/entrypoint.sh
    
    # Working directory
    working_dir: /app
    
    # User
    user: "1000:1000"
```

### Build Configuration

```yaml
version: '3.8'
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.prod
      args:
        - NODE_ENV=production
        - VERSION=1.0.0
      target: production
      cache_from:
        - my-api:latest
      labels:
        - "com.example.version=1.0.0"
```

### Environment Configuration

```yaml
version: '3.8'
services:
  api:
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://db:5432/mydb
      
    # Or from file
    env_file:
      - .env
      - .env.local
```

### Port Configuration

```yaml
version: '3.8'
services:
  api:
    ports:
      # host:container
      - "3000:3000"
      # localhost only
      - "127.0.0.1:3000:3000"
      # random host port
      - "3000"
      # port range
      - "3000-3005:3000-3005"
      # UDP
      - "53:53/udp"
```

### Volume Configuration

```yaml
version: '3.8'
services:
  api:
    volumes:
      # Named volume
      - data:/app/data
      # Bind mount
      - ./src:/app/src
      # Read-only
      - ./config:/app/config:ro
      # tmpfs
      - type: tmpfs
        target: /tmp
```

### Network Configuration

```yaml
version: '3.8'
services:
  api:
    networks:
      frontend:
      backend:
        aliases:
          - api-server
        ipv4_address: 172.20.0.10
```

### Resource Limits

```yaml
version: '3.8'
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Health Check

```yaml
version: '3.8'
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Logging Configuration

```yaml
version: '3.8'
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### Security Options

```yaml
version: '3.8'
services:
  api:
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### Complete Service Example

```yaml
version: '3.8'
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: production
    container_name: my-api
    restart: unless-stopped
    user: "1000:1000"
    read_only: true
    tmpfs:
      - /tmp
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - uploads:/app/uploads
    networks:
      - frontend
      - backend
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
    logging:
      driver: json-file
      options:
        max-size: "10m"
```

