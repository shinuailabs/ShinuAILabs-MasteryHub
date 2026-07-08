# Lab 655: Container Basics

## LEARNING CONCEPT

Understanding Docker containers and their lifecycle.

### Container Characteristics:
- Running instance of an image
- Isolated environment
- Ephemeral by default
- Has own filesystem, network, processes

## EXERCISE

1. Create and run containers
2. Manage container lifecycle
3. Inspect containers

## SOLUTION

### Run Containers

```bash
# Basic run
docker run nginx

# Run in detached mode
docker run -d nginx

# Run with name
docker run -d --name my-nginx nginx

# Run with port mapping
docker run -d -p 8080:80 nginx

# Run interactively
docker run -it ubuntu bash

# Run and remove after exit
docker run --rm nginx
```

### Container Lifecycle

```bash
# Create container (without starting)
docker create --name my-container nginx

# Start container
docker start my-container

# Stop container (graceful)
docker stop my-container

# Kill container (force)
docker kill my-container

# Restart container
docker restart my-container

# Pause container
docker pause my-container

# Unpause container
docker unpause my-container

# Remove container
docker rm my-container

# Force remove running container
docker rm -f my-container
```

### List Containers

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# List container IDs only
docker ps -q

# List with size
docker ps -s

# Filter containers
docker ps --filter "status=running"
docker ps --filter "name=nginx"
```

### Inspect Containers

```bash
# Detailed container info
docker inspect my-container

# Get specific field
docker inspect --format='{{.State.Status}}' my-container
docker inspect --format='{{.NetworkSettings.IPAddress}}' my-container

# View container logs
docker logs my-container
docker logs -f my-container  # Follow
docker logs --tail 100 my-container

# View running processes
docker top my-container

# View resource usage
docker stats my-container
docker stats --no-stream
```

### Execute Commands in Container

```bash
# Execute command
docker exec my-container ls -la

# Interactive shell
docker exec -it my-container bash
docker exec -it my-container sh

# Execute as specific user
docker exec -u root my-container whoami

# Set environment variable
docker exec -e MY_VAR=value my-container env
```

### Container States

```
Created  → docker create
Running  → docker start / docker run
Paused   → docker pause
Stopped  → docker stop
Removed  → docker rm

State Diagram:
┌─────────┐
│ Created │
└────┬────┘
     │ start
     ▼
┌─────────┐  pause   ┌────────┐
│ Running │ ───────► │ Paused │
└────┬────┘ ◄─────── └────────┘
     │       unpause
     │ stop/kill
     ▼
┌─────────┐
│ Stopped │
└────┬────┘
     │ rm
     ▼
┌─────────┐
│ Removed │
└─────────┘
```

### Container Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove all containers
docker rm -f $(docker ps -aq)

# Remove containers older than 24h
docker container prune --filter "until=24h"
```

