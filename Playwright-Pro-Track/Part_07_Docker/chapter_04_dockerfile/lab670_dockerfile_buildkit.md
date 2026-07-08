# Lab 670: BuildKit Features

## LEARNING CONCEPT

Using Docker BuildKit for advanced builds.

### BuildKit Benefits:
- Parallel builds
- Better caching
- Build secrets
- SSH forwarding
- Cache mounts

## EXERCISE

1. Enable BuildKit
2. Use advanced features
3. Optimize builds

## SOLUTION

### Enable BuildKit

```bash
# Enable for single build
DOCKER_BUILDKIT=1 docker build -t my-app .

# Enable permanently
# Add to ~/.docker/config.json
{
    "features": {
        "buildkit": true
    }
}

# Or in daemon.json
{
    "features": {
        "buildkit": true
    }
}
```

### BuildKit Syntax

```dockerfile
# Enable BuildKit syntax
# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
CMD ["node", "app.js"]
```

### Cache Mounts

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

# Cache npm packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
CMD ["node", "app.js"]
```

### Build Secrets

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app

# Use secret during build
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci

COPY . .
CMD ["node", "app.js"]
```

```bash
# Build with secret
docker build --secret id=npmrc,src=.npmrc -t my-app .
```

### SSH Forwarding

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

RUN apk add --no-cache openssh-client git

# Clone private repo using SSH
RUN --mount=type=ssh \
    git clone git@github.com:org/private-repo.git
```

```bash
# Build with SSH
docker build --ssh default -t my-app .
```

### Bind Mounts

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app

# Mount source during build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci
```

### Parallel Builds

```dockerfile
# syntax=docker/dockerfile:1

# These stages build in parallel
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/ .
RUN npm ci && npm run build

FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/ .
RUN npm ci && npm run build

# Final stage combines both
FROM node:18-alpine
COPY --from=frontend /app/dist /app/frontend
COPY --from=backend /app/dist /app/backend
CMD ["node", "/app/backend/server.js"]
```

### Build Arguments with Defaults

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

ARG NODE_ENV=production
ARG VERSION

ENV NODE_ENV=$NODE_ENV

RUN echo "Building version $VERSION for $NODE_ENV"
```

### Here Documents

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine

# Multi-line script
RUN <<EOF
    npm ci
    npm run build
    npm prune --production
EOF

# Create file inline
COPY <<EOF /app/config.json
{
    "port": 3000,
    "env": "production"
}
EOF
```

### Build Progress

```bash
# Plain progress output
docker build --progress=plain -t my-app .

# Auto (default)
docker build --progress=auto -t my-app .

# TTY progress
docker build --progress=tty -t my-app .
```

### Build Cache Export/Import

```bash
# Export cache
docker build --cache-to type=local,dest=./cache -t my-app .

# Import cache
docker build --cache-from type=local,src=./cache -t my-app .

# Registry cache
docker build --cache-to type=registry,ref=user/app:cache -t my-app .
docker build --cache-from type=registry,ref=user/app:cache -t my-app .
```

