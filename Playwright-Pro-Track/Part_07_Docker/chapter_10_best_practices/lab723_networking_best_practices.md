# Lab 723: Networking Best Practices

## LEARNING CONCEPT

Implementing Docker networking best practices.

## EXERCISE

1. Design network architecture
2. Implement security
3. Optimize performance

## SOLUTION

### Use Custom Networks

```bash
# ❌ Don't use default bridge
docker run myapp

# ✅ Use custom networks
docker network create mynetwork
docker run --network mynetwork myapp
```

### Network Segmentation

```yaml
version: '3.8'
services:
  nginx:
    image: nginx
    networks:
      - frontend
    ports:
      - "80:80"

  api:
    image: myapi
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
    internal: true
```

### Port Binding Security

```bash
# ❌ Binds to all interfaces
docker run -p 8080:80 nginx

# ✅ Binds to localhost only
docker run -p 127.0.0.1:8080:80 nginx
```

### DNS and Service Discovery

```yaml
version: '3.8'
services:
  api:
    image: myapi
    networks:
      backend:
        aliases:
          - api-server
          - backend-api

  db:
    image: postgres
    networks:
      backend:
        aliases:
          - database
          - postgres

networks:
  backend:
```

### Internal Networks

```yaml
networks:
  backend:
    internal: true  # No external access
```

### Network Encryption

```bash
# Encrypted overlay network
docker network create \
    --driver overlay \
    --opt encrypted \
    secure-network
```

### IP Address Management

```yaml
networks:
  custom:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
          gateway: 172.28.0.1
```

### Static IP Assignment

```yaml
services:
  db:
    image: postgres
    networks:
      custom:
        ipv4_address: 172.28.0.10

networks:
  custom:
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### Network Troubleshooting

```bash
# Inspect network
docker network inspect mynetwork

# Test connectivity
docker exec container1 ping container2

# Check DNS
docker exec container1 nslookup service-name

# Debug with netshoot
docker run -it --rm --network mynetwork nicolaka/netshoot
```

### Performance Optimization

```bash
# Use host network for performance
docker run --network host myapp

# Use macvlan for direct network access
docker network create \
    --driver macvlan \
    --subnet=192.168.1.0/24 \
    --gateway=192.168.1.1 \
    -o parent=eth0 \
    macvlan-net
```

### Load Balancing

```yaml
version: '3.8'
services:
  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

  api:
    image: myapi
    deploy:
      replicas: 3
```

```nginx
# nginx.conf
upstream api {
    server api:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://api;
    }
}
```

### Best Practices Summary

```yaml
version: '3.8'
services:
  web:
    networks:
      - frontend
    ports:
      - "127.0.0.1:80:80"

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

### Checklist

```
Design:
□ Use custom networks
□ Implement segmentation
□ Use internal networks

Security:
□ Bind to localhost
□ Use encryption
□ Minimize exposed ports

Operations:
□ Use DNS for discovery
□ Document topology
□ Monitor connectivity
```

