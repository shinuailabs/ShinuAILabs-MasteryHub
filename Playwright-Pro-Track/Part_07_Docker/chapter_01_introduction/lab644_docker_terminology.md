# Lab 644: Docker Terminology

## LEARNING CONCEPT

Understanding essential Docker terminology.

## EXERCISE

1. Learn key terms
2. Understand relationships
3. Apply in practice

## SOLUTION

### Core Terms

```
IMAGE
- Read-only template for containers
- Built from Dockerfile
- Stored in registries
- Composed of layers

CONTAINER
- Running instance of an image
- Isolated environment
- Has its own filesystem, network
- Ephemeral by default

DOCKERFILE
- Text file with build instructions
- Defines image layers
- Specifies base image, commands, config

REGISTRY
- Storage for Docker images
- Docker Hub is default public registry
- Can be private (AWS ECR, GCR, etc.)

REPOSITORY
- Collection of related images
- Usually different versions of same app
- Example: nginx:1.21, nginx:1.22, nginx:latest
```

### Image Terms

```
BASE IMAGE
- Starting point for builds
- FROM instruction in Dockerfile
- Example: FROM node:18-alpine

LAYER
- Each instruction creates a layer
- Layers are cached for efficiency
- Read-only except top layer

TAG
- Version identifier for images
- Format: repository:tag
- Example: nginx:1.25.0

DIGEST
- Unique SHA256 hash of image
- Immutable identifier
- Example: nginx@sha256:abc123...
```

### Container Terms

```
ENTRYPOINT
- Main command that runs
- Cannot be overridden easily
- Defines container's purpose

CMD
- Default arguments for ENTRYPOINT
- Can be overridden at runtime
- Provides defaults

VOLUME
- Persistent data storage
- Survives container lifecycle
- Can be shared between containers

PORT
- Network endpoint
- EXPOSE in Dockerfile (documentation)
- -p flag maps host:container ports

NETWORK
- Communication between containers
- Bridge, host, overlay modes
- Isolated by default
```

### Build Terms

```
BUILD CONTEXT
- Files sent to Docker daemon
- Usually current directory
- Controlled by .dockerignore

MULTI-STAGE BUILD
- Multiple FROM statements
- Reduces final image size
- Separates build and runtime

BUILD CACHE
- Reuses unchanged layers
- Speeds up builds
- Invalidated by changes

BUILD ARG
- Variables during build time
- ARG instruction
- --build-arg flag
```

### Runtime Terms

```
BIND MOUNT
- Maps host path to container
- -v /host/path:/container/path
- Real-time sync

ENVIRONMENT VARIABLE
- Runtime configuration
- -e or --env flag
- ENV instruction in Dockerfile

HEALTHCHECK
- Container health monitoring
- HEALTHCHECK instruction
- Used by orchestrators

RESTART POLICY
- What happens when container stops
- no, always, unless-stopped, on-failure
- --restart flag
```

### Orchestration Terms

```
DOCKER COMPOSE
- Multi-container applications
- YAML configuration
- docker-compose.yml

SERVICE
- Container definition in Compose
- Can have multiple replicas
- Defines image, ports, volumes

STACK
- Group of services
- Deployed together
- docker stack deploy

SWARM
- Docker's native orchestration
- Cluster of Docker nodes
- Alternative to Kubernetes
```

