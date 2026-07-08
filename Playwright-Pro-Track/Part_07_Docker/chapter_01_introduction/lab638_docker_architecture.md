# Lab 638: Docker Architecture

## LEARNING CONCEPT

Understanding Docker's client-server architecture.

### Components:
- **Docker Client**: CLI tool for interacting with Docker
- **Docker Daemon**: Background service managing containers
- **Docker Registry**: Stores Docker images (Docker Hub)
- **Docker Objects**: Images, containers, networks, volumes

### Architecture Flow:
```
Client (docker CLI) → Docker Daemon → Container Runtime → Containers
                           ↓
                      Registry (Docker Hub)
```

## EXERCISE

1. Understand Docker components
2. Explore Docker daemon
3. Work with registries

## SOLUTION

### Step 1: Docker Client Commands

```bash
# Client communicates with daemon
docker version

# Shows both client and server versions
# Client: Docker CLI
# Server: Docker Daemon (dockerd)
```

### Step 2: Docker Daemon

```bash
# Check daemon status (Linux)
sudo systemctl status docker

# View daemon logs
sudo journalctl -u docker

# Daemon configuration
# /etc/docker/daemon.json
```

### Step 3: Docker Registry

```bash
# Login to Docker Hub
docker login

# Pull from registry
docker pull nginx:latest

# Tag image for registry
docker tag my-image:latest username/my-image:latest

# Push to registry
docker push username/my-image:latest

# Pull from private registry
docker pull registry.example.com/my-image:latest
```

### Step 4: Docker Objects

```bash
# Images
docker images
docker image ls

# Containers
docker container ls -a

# Networks
docker network ls

# Volumes
docker volume ls
```

### Step 5: Docker Info

```bash
# Detailed system info
docker info

# Shows:
# - Server version
# - Storage driver
# - Logging driver
# - Cgroup driver
# - Plugins
# - Registry
```

### Step 6: Docker Events

```bash
# Monitor Docker events in real-time
docker events

# Filter events
docker events --filter 'type=container'
docker events --filter 'event=start'
```

### Architecture Diagram:
```
┌─────────────────────────────────────────────────┐
│                  Docker Host                     │
│  ┌─────────────────────────────────────────┐    │
│  │           Docker Daemon                  │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │Container│ │Container│ │Container│   │    │
│  │  └─────────┘ └─────────┘ └─────────┘   │    │
│  │  ┌─────────────────────────────────┐   │    │
│  │  │           Images                 │   │    │
│  │  └─────────────────────────────────┘   │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
         ↑                        ↑
    Docker CLI              Docker Registry
```

