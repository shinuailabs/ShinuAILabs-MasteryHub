# Lab 648: Image Layers

## LEARNING CONCEPT

Understanding Docker image layer system.

### Layer Concepts:
- Each instruction creates a layer
- Layers are cached
- Layers are shared between images
- Only top layer is writable

## EXERCISE

1. Examine image layers
2. Optimize layer caching
3. Reduce layer count

## SOLUTION

### View Image Layers

```bash
# View layer history
docker history nginx

# Detailed view
docker history --no-trunc nginx

# View layer sizes
docker history --format "{{.Size}}\t{{.CreatedBy}}" nginx
```

### Layer Creation

```dockerfile
# Each instruction creates a layer
FROM node:18-alpine     # Layer 1: Base image

WORKDIR /app            # Layer 2: Set working directory

COPY package*.json ./   # Layer 3: Copy package files

RUN npm install         # Layer 4: Install dependencies

COPY . .                # Layer 5: Copy source code

CMD ["node", "app.js"]  # Layer 6: Set command (metadata only)
```

### Layer Caching

```dockerfile
# ❌ Bad: Cache invalidated on any code change
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "app.js"]

# ✅ Good: Dependencies cached separately
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]
```

### Reduce Layers

```dockerfile
# ❌ Multiple RUN commands = multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Single RUN command = single layer
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Layer Sharing

```bash
# Images sharing same base share layers
docker pull node:18-alpine
docker pull node:18-alpine  # Uses cached layers

# Check shared layers
docker system df -v
```

### Inspect Layers

```bash
# Inspect image layers
docker inspect nginx --format='{{.RootFS.Layers}}'

# View layer diff
docker diff <container_id>
# A = Added
# C = Changed
# D = Deleted
```

### Squash Layers

```bash
# Squash all layers into one (experimental)
docker build --squash -t my-app .

# Or use multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]
```

### Layer Best Practices

```dockerfile
# 1. Order by change frequency (least to most)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# 2. Combine related commands
RUN apt-get update && \
    apt-get install -y package1 package2 && \
    apt-get clean

# 3. Clean up in same layer
RUN npm install && \
    npm cache clean --force

# 4. Use .dockerignore
# Prevents unnecessary files from invalidating cache
```

