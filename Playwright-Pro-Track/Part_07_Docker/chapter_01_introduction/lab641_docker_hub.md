# Lab 641: Docker Hub

## LEARNING CONCEPT

Using Docker Hub as a container registry.

### Docker Hub Features:
- Public/private repositories
- Official images
- Automated builds
- Webhooks

## EXERCISE

1. Create Docker Hub account
2. Push/pull images
3. Explore official images

## SOLUTION

### Step 1: Docker Hub Account

```bash
# Create account at https://hub.docker.com

# Login from CLI
docker login

# Enter username and password
# Or use access token (recommended)
```

### Step 2: Pull Official Images

```bash
# Pull official images
docker pull nginx
docker pull node:18
docker pull python:3.11
docker pull postgres:15
docker pull redis:7

# Pull specific versions
docker pull nginx:1.25
docker pull node:18-alpine
docker pull python:3.11-slim
```

### Step 3: Push Your Image

```bash
# Build your image
docker build -t my-app .

# Tag for Docker Hub
docker tag my-app username/my-app:latest
docker tag my-app username/my-app:v1.0.0

# Push to Docker Hub
docker push username/my-app:latest
docker push username/my-app:v1.0.0
```

### Step 4: Search Images

```bash
# Search for images
docker search nginx
docker search --filter is-official=true nginx
docker search --filter stars=100 node

# View image tags on Docker Hub website
# https://hub.docker.com/_/nginx
```

### Step 5: Private Repositories

```bash
# Create private repo on Docker Hub website

# Push to private repo
docker tag my-app username/private-app:latest
docker push username/private-app:latest

# Pull from private repo (requires login)
docker pull username/private-app:latest
```

### Step 6: Access Tokens

```bash
# Create access token on Docker Hub:
# Account Settings → Security → New Access Token

# Login with token
docker login -u username
# Enter token as password

# Or use environment variable
echo $DOCKER_TOKEN | docker login -u username --password-stdin
```

### Step 7: Automated Builds (Legacy)

```yaml
# docker-compose.yml for automated builds
version: '3'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: username/my-app:latest
```

### Best Practices:
- Use specific version tags
- Prefer official images
- Use access tokens over passwords
- Keep private images private
- Document your images with README

