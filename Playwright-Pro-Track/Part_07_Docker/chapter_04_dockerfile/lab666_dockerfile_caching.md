# Lab 666: Dockerfile Build Caching

## LEARNING CONCEPT

Optimizing builds with Docker layer caching.

### Cache Rules:
- Each instruction creates a layer
- Layers are cached
- Cache invalidates on change
- All subsequent layers rebuild

## EXERCISE

1. Understand caching
2. Optimize for cache
3. Measure improvements

## SOLUTION

### How Caching Works

```dockerfile
# Each instruction is cached
FROM node:18-alpine     # Layer 1 (cached)
WORKDIR /app            # Layer 2 (cached)
COPY package.json .     # Layer 3 (cached if unchanged)
RUN npm install         # Layer 4 (cached if Layer 3 unchanged)
COPY . .                # Layer 5 (invalidates on any change)
CMD ["node", "app.js"]  # Layer 6 (rebuilds if Layer 5 changed)
```

### Cache Invalidation

```dockerfile
# ❌ Bad: Any code change invalidates npm install
FROM node:18-alpine
WORKDIR /app
COPY . .                # Changes frequently
RUN npm install         # Rebuilds every time
CMD ["node", "app.js"]

# ✅ Good: Dependencies cached separately
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./   # Changes rarely
RUN npm install         # Cached most of the time
COPY . .                # Changes frequently
CMD ["node", "app.js"]
```

### Order by Change Frequency

```dockerfile
FROM node:18-alpine

# 1. Rarely changes
WORKDIR /app

# 2. Changes occasionally
COPY package*.json ./
RUN npm ci

# 3. Changes sometimes
COPY tsconfig.json ./
COPY webpack.config.js ./

# 4. Changes frequently
COPY src/ ./src/

# 5. Metadata (no cache impact)
CMD ["node", "dist/app.js"]
```

### Combine RUN Commands

```dockerfile
# ❌ Multiple layers, harder to cache
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Single layer, better caching
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Use BuildKit Cache Mounts

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

### Cache Dependencies

```dockerfile
# Python
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Go
FROM golang:1.21
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .

# Rust
FROM rust:1.70
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
COPY src ./src
RUN cargo build --release
```

### Build Without Cache

```bash
# Force rebuild without cache
docker build --no-cache -t my-app .

# Rebuild from specific stage
docker build --target builder --no-cache -t my-app .
```

### View Cache Usage

```bash
# Build with progress
docker build --progress=plain -t my-app .

# Shows CACHED for cached layers
# Step 3/8 : COPY package*.json ./
#  ---> Using cache
#  ---> abc123def456
```

### Cache Best Practices

```
✅ Order instructions by change frequency
✅ Copy dependency files before source code
✅ Combine related RUN commands
✅ Use .dockerignore to exclude unnecessary files
✅ Use BuildKit cache mounts
✅ Use multi-stage builds
✅ Pin base image versions
```

### Measure Build Time

```bash
# Time the build
time docker build -t my-app .

# Compare cached vs uncached
time docker build --no-cache -t my-app .
time docker build -t my-app .
```

