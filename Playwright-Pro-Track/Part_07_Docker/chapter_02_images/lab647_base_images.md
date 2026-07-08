# Lab 647: Base Images

## LEARNING CONCEPT

Choosing and using appropriate base images.

### Base Image Types:
- Official images
- Minimal images (Alpine)
- Distroless images
- Scratch (empty)

## EXERCISE

1. Compare base images
2. Choose appropriate base
3. Understand trade-offs

## SOLUTION

### Official Base Images

```dockerfile
# Full OS images
FROM ubuntu:22.04
FROM debian:bookworm
FROM centos:7

# Language runtime images
FROM node:18
FROM python:3.11
FROM golang:1.21
FROM openjdk:17

# Application images
FROM nginx:1.25
FROM postgres:15
FROM redis:7
```

### Alpine Images (Minimal)

```dockerfile
# Alpine-based images are much smaller
FROM node:18-alpine      # ~180MB vs ~1GB
FROM python:3.11-alpine  # ~50MB vs ~1GB
FROM nginx:alpine        # ~40MB vs ~140MB

# Alpine uses musl libc instead of glibc
# May have compatibility issues with some packages
```

### Slim Images

```dockerfile
# Slim variants remove unnecessary files
FROM node:18-slim        # ~240MB
FROM python:3.11-slim    # ~150MB
FROM debian:bookworm-slim

# Good balance between size and compatibility
```

### Distroless Images

```dockerfile
# Google's distroless images
# No shell, package manager, or unnecessary tools
FROM gcr.io/distroless/nodejs18-debian11
FROM gcr.io/distroless/python3
FROM gcr.io/distroless/java17

# Very secure, minimal attack surface
# Harder to debug (no shell)
```

### Scratch Image

```dockerfile
# Empty base image
FROM scratch

# Only for statically compiled binaries
# Example: Go application
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o app

FROM scratch
COPY --from=builder /app/app /app
ENTRYPOINT ["/app"]
```

### Size Comparison

```bash
# Compare image sizes
docker images | grep node

# REPOSITORY   TAG           SIZE
# node         18            1.1GB
# node         18-slim       240MB
# node         18-alpine     180MB
```

### Choosing Base Image

```
Use Case                    Recommended Base
-------------------------------------------------
Development                 Full image (node:18)
Production (general)        Slim (node:18-slim)
Production (size-critical)  Alpine (node:18-alpine)
Maximum security            Distroless
Static binaries             Scratch
```

### Example: Node.js App

```dockerfile
# Development
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]

# Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER node
CMD ["node", "app.js"]
```

### Best Practices

```
✅ Use specific version tags
✅ Prefer smaller images for production
✅ Consider security implications
✅ Test compatibility with Alpine
✅ Use multi-stage builds
✅ Keep base images updated
```

