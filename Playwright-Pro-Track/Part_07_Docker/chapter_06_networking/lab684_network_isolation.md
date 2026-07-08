# Lab 684: Network Isolation

## LEARNING CONCEPT

Isolating containers using Docker networks.

## EXERCISE

1. Create isolated networks
2. Implement network segmentation
3. Control container communication

## SOLUTION

### Basic Isolation

```bash
# Create separate networks
docker network create frontend
docker network create backend

# Frontend containers
docker run -d --name web --network frontend nginx

# Backend containers
docker run -d --name db --network backend postgres:15

# web cannot reach db (different networks)
docker exec web ping db  # Fails
```

### Multi-Network Container

```bash
# API connects both networks
docker run -d --name api --network frontend my-api
docker network connect backend api

# API can reach both web and db
docker exec api ping web  # Works
docker exec api ping db   # Works

# web still cannot reach db
docker exec web ping db   # Fails
```

### Internal Networks

```bash
# Create internal network (no external access)
docker network create --internal backend-internal

# Containers on internal network
docker run -d --name db --network backend-internal postgres:15

# db cannot access internet
docker exec db ping google.com  # Fails
```

### Network Segmentation Pattern

```yaml
version: '3'
services:
  # Public-facing
  nginx:
    image: nginx
    networks:
      - frontend
    ports:
      - "80:80"

  # Application layer
  api:
    image: my-api
    networks:
      - frontend
      - backend

  # Data layer (isolated)
  db:
    image: postgres
    networks:
      - backend

  cache:
    image: redis
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### DMZ Pattern

```yaml
version: '3'
services:
  # DMZ - public facing
  loadbalancer:
    image: nginx
    networks:
      - dmz
    ports:
      - "80:80"
      - "443:443"

  # Application zone
  app1:
    image: my-app
    networks:
      - dmz
      - app-zone

  app2:
    image: my-app
    networks:
      - dmz
      - app-zone

  # Data zone - most restricted
  database:
    image: postgres
    networks:
      - data-zone

  # Bridge between zones
  api-gateway:
    image: my-gateway
    networks:
      - app-zone
      - data-zone

networks:
  dmz:
  app-zone:
    internal: true
  data-zone:
    internal: true
```

### IP Restrictions

```bash
# Create network with specific subnet
docker network create \
    --subnet=172.20.0.0/16 \
    --ip-range=172.20.240.0/20 \
    my-network

# Assign specific IP
docker run -d \
    --name web \
    --network my-network \
    --ip 172.20.240.10 \
    nginx
```

### Firewall Rules

```bash
# Docker manages iptables rules
# View Docker rules
sudo iptables -L DOCKER

# Custom rules (advanced)
# Block specific container communication
sudo iptables -I DOCKER-USER -s 172.17.0.2 -d 172.17.0.3 -j DROP
```

### Verify Isolation

```bash
# Test connectivity
docker exec container1 ping container2

# Test port access
docker exec container1 nc -zv container2 5432

# Check network membership
docker network inspect my-network
```

### Best Practices

```
✅ Use separate networks for different tiers
✅ Use internal networks for backend services
✅ Minimize cross-network connections
✅ Document network architecture
✅ Test isolation regularly
✅ Use least privilege principle
```

