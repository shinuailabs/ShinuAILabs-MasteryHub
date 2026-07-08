# Lab 640: Docker CLI Commands

## LEARNING CONCEPT

Mastering essential Docker CLI commands.

### Command Categories:
- Container management
- Image management
- System commands
- Information commands

## EXERCISE

1. Practice container commands
2. Practice image commands
3. Use system commands

## SOLUTION

### Container Commands

```bash
# Run container
docker run nginx
docker run -d nginx                    # Detached mode
docker run -d -p 8080:80 nginx        # Port mapping
docker run -d --name my-nginx nginx   # Named container
docker run -it ubuntu bash            # Interactive

# List containers
docker ps                              # Running only
docker ps -a                           # All containers
docker ps -q                           # IDs only

# Container lifecycle
docker start <container>
docker stop <container>
docker restart <container>
docker pause <container>
docker unpause <container>
docker kill <container>

# Remove containers
docker rm <container>
docker rm -f <container>               # Force remove running
docker container prune                 # Remove all stopped

# Container info
docker logs <container>
docker logs -f <container>             # Follow logs
docker inspect <container>
docker stats <container>
docker top <container>

# Execute in container
docker exec -it <container> bash
docker exec <container> ls -la
```

### Image Commands

```bash
# List images
docker images
docker image ls

# Pull images
docker pull nginx
docker pull nginx:1.21
docker pull nginx:latest

# Build images
docker build -t my-image .
docker build -t my-image:v1 .
docker build -f Dockerfile.dev -t my-image .

# Tag images
docker tag my-image:latest my-image:v1
docker tag my-image username/my-image:latest

# Push images
docker push username/my-image:latest

# Remove images
docker rmi <image>
docker image prune                     # Remove unused
docker image prune -a                  # Remove all unused

# Image info
docker inspect <image>
docker history <image>
```

### System Commands

```bash
# System info
docker info
docker version

# Disk usage
docker system df
docker system df -v                    # Verbose

# Clean up
docker system prune                    # Remove unused data
docker system prune -a                 # Remove all unused
docker system prune --volumes          # Include volumes

# Events
docker events
docker events --filter 'type=container'
```

### Network Commands

```bash
# List networks
docker network ls

# Create network
docker network create my-network

# Connect container to network
docker network connect my-network <container>

# Disconnect
docker network disconnect my-network <container>

# Inspect network
docker network inspect my-network

# Remove network
docker network rm my-network
```

### Volume Commands

```bash
# List volumes
docker volume ls

# Create volume
docker volume create my-volume

# Inspect volume
docker volume inspect my-volume

# Remove volume
docker volume rm my-volume
docker volume prune                    # Remove unused
```

