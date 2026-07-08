# Lab 681: Docker Network Basics

## LEARNING CONCEPT

Understanding Docker networking fundamentals.

### Network Drivers:
- bridge (default)
- host
- none
- overlay
- macvlan

## EXERCISE

1. Explore network types
2. Create custom networks
3. Connect containers

## SOLUTION

### List Networks

```bash
# List all networks
docker network ls

# Inspect network
docker network inspect bridge

# Filter networks
docker network ls --filter driver=bridge
```

### Default Bridge Network

```bash
# Containers on default bridge
docker run -d --name web1 nginx
docker run -d --name web2 nginx

# Get IP addresses
docker inspect --format='{{.NetworkSettings.IPAddress}}' web1
docker inspect --format='{{.NetworkSettings.IPAddress}}' web2

# Containers can communicate by IP (not name)
docker exec web1 ping <web2_ip>
```

### Custom Bridge Network

```bash
# Create custom network
docker network create my-network

# Run containers on custom network
docker run -d --name web1 --network my-network nginx
docker run -d --name web2 --network my-network nginx

# Containers can communicate by name!
docker exec web1 ping web2
```

### Host Network

```bash
# Container uses host network directly
docker run -d --network host nginx

# No port mapping needed
# Container binds directly to host ports
# Only works on Linux
```

### None Network

```bash
# Container has no network
docker run -d --network none nginx

# Completely isolated
# No external connectivity
```

### Connect/Disconnect Networks

```bash
# Connect container to network
docker network connect my-network my-container

# Disconnect from network
docker network disconnect my-network my-container

# Container can be on multiple networks
docker network connect network1 my-container
docker network connect network2 my-container
```

### Network Inspection

```bash
# Detailed network info
docker network inspect my-network

# List containers on network
docker network inspect my-network --format='{{range .Containers}}{{.Name}} {{end}}'

# Get network gateway
docker network inspect my-network --format='{{(index .IPAM.Config 0).Gateway}}'
```

### Remove Networks

```bash
# Remove specific network
docker network rm my-network

# Remove unused networks
docker network prune

# Force remove
docker network rm -f my-network
```

### Network Aliases

```bash
# Create container with alias
docker run -d \
    --name web \
    --network my-network \
    --network-alias webserver \
    --network-alias www \
    nginx

# Can be reached by name or aliases
docker exec app ping web
docker exec app ping webserver
docker exec app ping www
```

### Docker Compose Networks

```yaml
version: '3'
services:
  web:
    image: nginx
    networks:
      - frontend

  app:
    image: my-app
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

### Best Practices

```
✅ Use custom networks (not default bridge)
✅ Isolate services by network
✅ Use network aliases for flexibility
✅ Don't expose unnecessary ports
✅ Use internal networks for backend
```

