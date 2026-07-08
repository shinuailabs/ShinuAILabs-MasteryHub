# Lab 637: Docker Basics

## LEARNING CONCEPT

Docker is a platform for developing, shipping, and running applications in containers.

### Key Concepts:
- **Container**: Lightweight, standalone executable package
- **Image**: Read-only template for creating containers
- **Dockerfile**: Script to build images
- **Registry**: Storage for Docker images

### Benefits:
- Consistent environments
- Isolation
- Portability
- Scalability

## EXERCISE

1. Install Docker
2. Verify installation
3. Run your first container

## SOLUTION

### Step 1: Verify Docker Installation

```bash
# Check Docker version
docker --version

# Check Docker info
docker info

# Verify Docker is running
docker ps
```

### Step 2: Run Hello World

```bash
# Run hello-world container
docker run hello-world
```

### Step 3: Basic Docker Commands

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List images
docker images

# Pull an image
docker pull nginx

# Run a container
docker run -d -p 8080:80 nginx

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# Remove an image
docker rmi <image_id>
```

### Step 4: Interactive Container

```bash
# Run Ubuntu interactively
docker run -it ubuntu bash

# Inside container
cat /etc/os-release
exit
```

### Step 5: Container Lifecycle

```bash
# Create container without starting
docker create --name my-nginx nginx

# Start container
docker start my-nginx

# Pause container
docker pause my-nginx

# Unpause container
docker unpause my-nginx

# Stop container
docker stop my-nginx

# Remove container
docker rm my-nginx
```

### Key Takeaways:
- Docker provides isolated environments
- Containers are lightweight and fast
- Images are templates for containers
- Basic commands: run, ps, stop, rm

