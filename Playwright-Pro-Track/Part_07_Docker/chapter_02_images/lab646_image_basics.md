# Lab 646: Docker Image Basics

## LEARNING CONCEPT

Understanding Docker images and their structure.

### Image Characteristics:
- Read-only templates
- Layered filesystem
- Portable across environments
- Versioned with tags

## EXERCISE

1. Explore image structure
2. Understand layers
3. Work with tags

## SOLUTION

### Step 1: List Images

```bash
# List all images
docker images

# List with more details
docker images -a

# List image IDs only
docker images -q

# Filter images
docker images --filter "dangling=true"
docker images --filter "reference=nginx"
```

### Step 2: Pull Images

```bash
# Pull latest
docker pull nginx

# Pull specific version
docker pull nginx:1.25.0

# Pull by digest (immutable)
docker pull nginx@sha256:abc123...

# Pull from different registry
docker pull gcr.io/google-containers/nginx
```

### Step 3: Inspect Image

```bash
# Detailed image info
docker inspect nginx

# Get specific field
docker inspect --format='{{.Config.Env}}' nginx
docker inspect --format='{{.Config.ExposedPorts}}' nginx

# View image history (layers)
docker history nginx
docker history --no-trunc nginx
```

### Step 4: Image Layers

```bash
# View layers
docker history nginx

# Output shows:
# IMAGE          CREATED       CREATED BY                                      SIZE
# 605c77e624dd   2 weeks ago   /bin/sh -c #(nop)  CMD ["nginx" "-g" "daemon…   0B
# <missing>      2 weeks ago   /bin/sh -c #(nop)  STOPSIGNAL SIGQUIT           0B
# <missing>      2 weeks ago   /bin/sh -c #(nop)  EXPOSE 80                    0B
# ...

# Each layer is cached and reusable
```

### Step 5: Tag Images

```bash
# Tag existing image
docker tag nginx:latest my-nginx:v1
docker tag nginx:latest username/nginx:custom

# Multiple tags for same image
docker tag my-app:latest my-app:v1.0.0
docker tag my-app:latest my-app:stable
```

### Step 6: Remove Images

```bash
# Remove by name
docker rmi nginx

# Remove by ID
docker rmi abc123

# Force remove
docker rmi -f nginx

# Remove dangling images
docker image prune

# Remove all unused images
docker image prune -a
```

### Step 7: Save and Load Images

```bash
# Save image to tar file
docker save nginx > nginx.tar
docker save -o nginx.tar nginx:latest

# Load image from tar file
docker load < nginx.tar
docker load -i nginx.tar

# Export container filesystem
docker export container_id > container.tar

# Import as image
docker import container.tar my-image:latest
```

### Image Naming Convention

```
[registry/][username/]repository[:tag]

Examples:
nginx                           # Official image, latest tag
nginx:1.25                      # Official image, specific tag
username/my-app:v1.0.0         # User image with version
gcr.io/project/app:latest      # Private registry
```

