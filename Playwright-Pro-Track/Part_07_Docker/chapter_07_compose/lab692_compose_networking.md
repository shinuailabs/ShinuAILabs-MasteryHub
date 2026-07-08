# Lab 692: Compose Networking

## LEARNING CONCEPT

Configuring networks in Docker Compose.

## EXERCISE

1. Create custom networks
2. Configure network options
3. Implement network isolation

## SOLUTION

### Default Network

```yaml
# Compose creates default network automatically
version: '3.8'
services:
  web:
    image: nginx
  api:
    image: my-api
  db:
    image: postgres

# All services on same network
# Can communicate by service name
```

### Custom Networks

```yaml
version: '3.8'
services:
  web:
    image: nginx
    networks:
      - frontend

  api:
    image: my-api
    networks:
      - frontend
      - backend

  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
  backend:
```

### Network Configuration

```yaml
version: '3.8'
networks:
  frontend:
    driver: bridge
    
  backend:
    driver: bridge
    internal: true  # No external access
    
  custom:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: custom-bridge
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
          gateway: 172.28.0.1
```

### Network Aliases

```yaml
version: '3.8'
services:
  db:
    image: postgres
    networks:
      backend:
        aliases:
          - database
          - postgres
          - pg

# Can be reached by: db, database, postgres, pg
```

### Static IP Assignment

```yaml
version: '3.8'
services:
  web:
    image: nginx
    networks:
      custom:
        ipv4_address: 172.28.0.10

networks:
  custom:
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### External Networks

```yaml
version: '3.8'
services:
  api:
    image: my-api
    networks:
      - existing-network

networks:
  existing-network:
    external: true
    name: my-existing-network
```

### Network Isolation Pattern

```yaml
version: '3.8'
services:
  # Public tier
  nginx:
    image: nginx
    ports:
      - "80:80"
    networks:
      - public

  # Application tier
  api:
    image: my-api
    networks:
      - public
      - private

  # Data tier (isolated)
  db:
    image: postgres
    networks:
      - private

  redis:
    image: redis
    networks:
      - private

networks:
  public:
    driver: bridge
  private:
    driver: bridge
    internal: true
```

### Multiple Compose Files

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    image: my-api
    networks:
      - shared

networks:
  shared:
    name: shared-network

# docker-compose.other.yml
version: '3.8'
services:
  worker:
    image: my-worker
    networks:
      - shared

networks:
  shared:
    external: true
    name: shared-network
```

### DNS Configuration

```yaml
version: '3.8'
services:
  api:
    image: my-api
    dns:
      - 8.8.8.8
      - 8.8.4.4
    dns_search:
      - example.com
```

### Link Services (Legacy)

```yaml
# Deprecated, use networks instead
version: '3.8'
services:
  api:
    image: my-api
    links:
      - db:database
```

### Best Practices

```yaml
version: '3.8'
services:
  web:
    networks:
      - frontend
    ports:
      - "127.0.0.1:80:80"  # Localhost only

  api:
    networks:
      - frontend
      - backend
    # No ports exposed

  db:
    networks:
      - backend
    # No ports exposed

networks:
  frontend:
  backend:
    internal: true
```

