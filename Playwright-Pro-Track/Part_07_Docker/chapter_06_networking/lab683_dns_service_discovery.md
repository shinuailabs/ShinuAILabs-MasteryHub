# Lab 683: DNS and Service Discovery

## LEARNING CONCEPT

Using Docker's built-in DNS for service discovery.

## EXERCISE

1. Understand Docker DNS
2. Use service discovery
3. Configure DNS options

## SOLUTION

### Docker DNS Basics

```bash
# Custom networks have built-in DNS
docker network create my-network

# Containers can resolve each other by name
docker run -d --name web --network my-network nginx
docker run -d --name app --network my-network alpine sleep infinity

# DNS resolution works
docker exec app nslookup web
docker exec app ping web
```

### Service Discovery

```bash
# Create services
docker run -d --name db --network my-network postgres:15
docker run -d --name cache --network my-network redis:7
docker run -d --name api --network my-network \
    -e DATABASE_HOST=db \
    -e CACHE_HOST=cache \
    my-api

# API can connect to db and cache by name
```

### Network Aliases

```bash
# Multiple aliases for same container
docker run -d \
    --name postgres-primary \
    --network my-network \
    --network-alias db \
    --network-alias database \
    --network-alias postgres \
    postgres:15

# All aliases resolve to same container
docker exec app ping db
docker exec app ping database
docker exec app ping postgres
```

### DNS Round Robin

```bash
# Multiple containers with same alias
docker run -d --name web1 --network my-network --network-alias web nginx
docker run -d --name web2 --network my-network --network-alias web nginx
docker run -d --name web3 --network my-network --network-alias web nginx

# DNS returns all IPs (round robin)
docker exec app nslookup web
```

### Custom DNS Configuration

```bash
# Custom DNS server
docker run -d \
    --dns 8.8.8.8 \
    --dns 8.8.4.4 \
    nginx

# Custom DNS search domain
docker run -d \
    --dns-search example.com \
    nginx

# Custom DNS options
docker run -d \
    --dns-opt timeout:3 \
    --dns-opt attempts:2 \
    nginx
```

### Docker Compose DNS

```yaml
version: '3'
services:
  web:
    image: nginx
    networks:
      frontend:
        aliases:
          - webserver
          - www

  api:
    image: my-api
    networks:
      frontend:
      backend:
        aliases:
          - api-server

  db:
    image: postgres
    networks:
      backend:
        aliases:
          - database
          - postgres

networks:
  frontend:
  backend:
```

### DNS Debugging

```bash
# Check DNS resolution
docker exec my-container nslookup service-name

# Check /etc/resolv.conf
docker exec my-container cat /etc/resolv.conf

# Check /etc/hosts
docker exec my-container cat /etc/hosts

# Test connectivity
docker exec my-container ping service-name
docker exec my-container curl http://service-name
```

### External DNS

```bash
# Add external hostname
docker run -d \
    --add-host myhost:192.168.1.100 \
    nginx

# Multiple hosts
docker run -d \
    --add-host db:192.168.1.10 \
    --add-host cache:192.168.1.11 \
    my-app
```

### Best Practices

```
✅ Use custom networks for DNS
✅ Use meaningful service names
✅ Use aliases for flexibility
✅ Don't hardcode IPs
✅ Test DNS resolution
✅ Document service dependencies
```

