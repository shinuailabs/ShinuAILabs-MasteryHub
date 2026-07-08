# Lab 689: Network Best Practices

## LEARNING CONCEPT

Comprehensive Docker networking best practices.

## EXERCISE

1. Review best practices
2. Apply to projects
3. Validate compliance

## SOLUTION

### Network Design

```yaml
# Three-tier architecture
version: '3.8'
services:
  # Presentation tier
  nginx:
    image: nginx
    networks:
      - frontend
    ports:
      - "80:80"

  # Application tier
  api:
    image: my-api
    networks:
      - frontend
      - backend

  # Data tier
  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
```

### Naming Conventions

```bash
# Use descriptive network names
docker network create app-frontend
docker network create app-backend
docker network create app-monitoring

# Include environment
docker network create app-frontend-prod
docker network create app-frontend-dev
```

### Security Best Practices

```yaml
# Secure network configuration
networks:
  frontend:
    driver: bridge
    
  backend:
    driver: bridge
    internal: true  # No external access
    
  secure:
    driver: overlay
    driver_opts:
      encrypted: "true"  # Encrypted traffic
```

### Port Exposure

```bash
# ✅ Bind to localhost
docker run -p 127.0.0.1:8080:80 nginx

# ✅ Use reverse proxy
# Only expose proxy, not backend services

# ❌ Avoid exposing to all interfaces
docker run -p 8080:80 nginx
```

### Service Discovery

```yaml
# Use DNS for service discovery
services:
  api:
    environment:
      - DATABASE_HOST=db
      - CACHE_HOST=redis
    networks:
      - backend

  db:
    networks:
      backend:
        aliases:
          - database
          - postgres
```

### Network Isolation

```yaml
# Isolate by function
networks:
  web-tier:
  app-tier:
    internal: true
  data-tier:
    internal: true
  monitoring:
    internal: true
```

### Performance Optimization

```bash
# Use host network for performance-critical apps
docker run --network host my-app

# Use macvlan for direct network access
docker network create --driver macvlan ...

# Minimize network hops
```

### Documentation

```yaml
# Document networks in compose file
networks:
  frontend:
    # Public-facing network
    # Connected services: nginx, api
    # Exposed ports: 80, 443
    
  backend:
    # Internal application network
    # Connected services: api, db, cache
    # No external access
    internal: true
```

### Monitoring

```bash
# Monitor network usage
docker stats --format "{{.Name}}: {{.NetIO}}"

# Check network events
docker events --filter type=network

# Inspect network details
docker network inspect my-network
```

### Troubleshooting Preparation

```yaml
# Include debug tools in development
services:
  debug:
    image: nicolaka/netshoot
    networks:
      - frontend
      - backend
    profiles:
      - debug
    command: sleep infinity
```

### Checklist

```
Design:
□ Plan network topology
□ Use appropriate drivers
□ Implement segmentation
□ Document architecture

Security:
□ Use internal networks
□ Bind to localhost
□ Encrypt sensitive traffic
□ Minimize exposed ports

Operations:
□ Use DNS for discovery
□ Monitor network usage
□ Plan for troubleshooting
□ Regular security audits

Performance:
□ Minimize network hops
□ Use appropriate driver
□ Monitor latency
□ Optimize for use case
```

### Common Mistakes

```
❌ Using default bridge network
❌ Exposing all ports to 0.0.0.0
❌ Not using internal networks
❌ Hardcoding IP addresses
❌ Not documenting network design
❌ Ignoring network security
❌ Not testing connectivity
```

