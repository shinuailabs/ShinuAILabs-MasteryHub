# Lab 667: Multi-Stage Dockerfile

## LEARNING CONCEPT

Using multi-stage builds for optimized images.

### Benefits:
- Smaller final images
- Separate build and runtime
- No build tools in production
- Better security

## EXERCISE

1. Create multi-stage Dockerfile
2. Optimize build process
3. Compare image sizes

## SOLUTION

### Basic Multi-Stage

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]
```

### Named Stages

```dockerfile
# Dependencies stage
FROM node:18 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Test stage
FROM builder AS tester
RUN npm test

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]
```

### Build Specific Stage

```bash
# Build only builder stage
docker build --target builder -t my-app:builder .

# Build production stage
docker build --target production -t my-app:prod .

# Build test stage
docker build --target tester -t my-app:test .
```

### Go Application

```dockerfile
# Build stage
FROM golang:1.21 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Production stage
FROM scratch
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]
```

### React Application

```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Python Application

```dockerfile
# Build stage
FROM python:3.11 AS builder
WORKDIR /app
RUN pip install --user pipenv
COPY Pipfile Pipfile.lock ./
RUN pipenv install --system --deploy

# Production stage
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

### Copy from External Image

```dockerfile
FROM node:18-alpine

# Copy from another image
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/

# Copy from specific stage
COPY --from=builder /app/dist ./dist
```

### Development vs Production

```dockerfile
# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/app.js"]
```

### Size Comparison

```bash
# Build both versions
docker build -f Dockerfile.single -t my-app:single .
docker build -f Dockerfile.multi -t my-app:multi .

# Compare sizes
docker images my-app
# REPOSITORY   TAG      SIZE
# my-app       single   1.2GB
# my-app       multi    150MB
```

