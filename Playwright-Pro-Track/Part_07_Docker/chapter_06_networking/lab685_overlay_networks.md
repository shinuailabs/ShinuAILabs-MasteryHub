# Lab 685: Overlay Networks

## LEARNING CONCEPT

Using overlay networks for multi-host communication.

### Overlay Network Features:
- Multi-host networking
- Swarm mode integration
- Encrypted communication
- Service discovery

## EXERCISE

1. Create overlay networks
2. Connect services across hosts
3. Configure encryption

## SOLUTION

### Initialize Swarm

```bash
# Initialize swarm (required for overlay)
docker swarm init

# Or join existing swarm
docker swarm join --token <token> <manager-ip>:2377
```

### Create Overlay Network

```bash
# Create overlay network
docker network create \
    --driver overlay \
    my-overlay

# Create with encryption
docker network create \
    --driver overlay \
    --opt encrypted \
    secure-overlay

# Create attachable overlay (for standalone containers)
docker network create \
    --driver overlay \
    --attachable \
    attachable-overlay
```

### Deploy Services

```bash
# Create service on overlay network
docker service create \
    --name web \
    --network my-overlay \
    --replicas 3 \
    nginx

# Create another service
docker service create \
    --name api \
    --network my-overlay \
    --replicas 2 \
    my-api

# Services can communicate by name
```

### Attachable Overlay

```bash
# Create attachable network
docker network create \
    --driver overlay \
    --attachable \
    my-attachable

# Run standalone container on overlay
docker run -d \
    --name standalone \
    --network my-attachable \
    nginx
```

### Overlay Network Options

```bash
# Custom subnet
docker network create \
    --driver overlay \
    --subnet=10.0.9.0/24 \
    --gateway=10.0.9.1 \
    custom-overlay

# With IP range
docker network create \
    --driver overlay \
    --subnet=10.0.9.0/24 \
    --ip-range=10.0.9.0/25 \
    ranged-overlay
```

### Docker Compose with Overlay

```yaml
version: '3.8'
services:
  web:
    image: nginx
    deploy:
      replicas: 3
    networks:
      - frontend

  api:
    image: my-api
    deploy:
      replicas: 2
    networks:
      - frontend
      - backend

  db:
    image: postgres
    deploy:
      replicas: 1
    networks:
      - backend

networks:
  frontend:
    driver: overlay
  backend:
    driver: overlay
    internal: true
```

### Encrypted Overlay

```bash
# Create encrypted network
docker network create \
    --driver overlay \
    --opt encrypted \
    encrypted-overlay

# All traffic between nodes is encrypted
# Uses IPsec ESP
```

### Inspect Overlay Network

```bash
# Inspect network
docker network inspect my-overlay

# View on specific node
docker network inspect my-overlay --verbose

# List services on network
docker network inspect my-overlay \
    --format '{{range .Services}}{{.Name}} {{end}}'
```

### Troubleshooting

```bash
# Check network connectivity
docker exec <container> ping <service-name>

# Check DNS resolution
docker exec <container> nslookup <service-name>

# View network details
docker network inspect my-overlay

# Check swarm nodes
docker node ls
```

### Best Practices

```
✅ Use encryption for sensitive data
✅ Use internal networks for backend
✅ Plan subnet allocation
✅ Monitor network performance
✅ Use attachable for debugging
✅ Document network topology
```

