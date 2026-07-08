# Lab 656: Container Networking

## LEARNING CONCEPT

Understanding Docker container networking.

### Network Types:
- Bridge (default)
- Host
- None
- Overlay (Swarm)
- Macvlan

## EXERCISE

1. Explore network types
2. Connect containers
3. Configure networking

## SOLUTION

### List Networks

```bash
# List all networks
docker network ls

# Inspect network
docker network inspect bridge
```

### Bridge Network (Default)

```bash
# Containers on bridge can communicate via IP
docker run -d --name web nginx
docker run -d --name app node:18-alpine sleep infinity

# Get container IP
docker inspect --format='{{.NetworkSettings.IPAddress}}' web

# Ping from app to web (by IP)
docker exec app ping <web_ip>
```

### Custom Bridge Network

```bash
# Create custom network
docker network create my-network

# Run containers on custom network
docker run -d --name web --network my-network nginx
docker run -d --name app --network my-network node:18-alpine sleep infinity

# Containers can communicate by name
docker exec app ping web  # Works!

# Connect existing container to network
docker network connect my-network existing-container

# Disconnect from network
docker network disconnect my-network existing-container
```

### Host Network

```bash
# Container shares host network
docker run -d --network host nginx

# No port mapping needed
# Container uses host's network directly
# Only works on Linux
```

### None Network

```bash
# Container has no network
docker run -d --network none nginx

# Completely isolated
# No external connectivity
```

### Port Mapping

```bash
# Map specific port
docker run -d -p 8080:80 nginx

# Map to specific interface
docker run -d -p 127.0.0.1:8080:80 nginx

# Map random port
docker run -d -P nginx

# Map multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx

# Map UDP port
docker run -d -p 53:53/udp dns-server
```

### Container Communication

```bash
# Create network
docker network create app-network

# Run database
docker run -d \
    --name db \
    --network app-network \
    -e POSTGRES_PASSWORD=secret \
    postgres:15

# Run application
docker run -d \
    --name app \
    --network app-network \
    -e DATABASE_URL=postgres://postgres:secret@db:5432/postgres \
    my-app

# App can connect to db using hostname 'db'
```

### DNS Resolution

```bash
# Custom network provides DNS
docker network create my-net

docker run -d --name service1 --network my-net nginx
docker run -d --name service2 --network my-net nginx

# service1 can resolve service2 by name
docker exec service1 nslookup service2
```

### Network Aliases

```bash
# Create container with alias
docker run -d \
    --name web \
    --network my-network \
    --network-alias webserver \
    nginx

# Can be reached by name or alias
docker exec app ping web
docker exec app ping webserver
```

### Remove Networks

```bash
# Remove specific network
docker network rm my-network

# Remove unused networks
docker network prune
```

