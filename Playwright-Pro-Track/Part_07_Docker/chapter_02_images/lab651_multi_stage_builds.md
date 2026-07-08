# Lab 651: Multi-Stage Builds

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

### Basic Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/app.js"]
```

### Go Application Example

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

### React Application Example

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

### Python Application Example

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

### Multiple Build Stages

```dockerfile
# Stage 1: Dependencies
FROM node:18 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Test
FROM builder AS tester
RUN npm test

# Stage 4: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]
```

### Named Stages

```dockerfile
# Build specific stage
docker build --target builder -t my-app:builder .

# Build production stage
docker build --target production -t my-app:prod .
```

### Copy from External Image

```dockerfile
FROM node:18-alpine

# Copy from another image
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/

# Copy from specific stage
COPY --from=builder /app/dist ./dist
```

### Size Comparison

```bash
# Single stage build
# my-app:single-stage  1.2GB

# Multi-stage build
# my-app:multi-stage   150MB

# Build and compare
docker build -t my-app:single -f Dockerfile.single .
docker build -t my-app:multi -f Dockerfile.multi .
docker images my-app
```

### Best Practices

```
✅ Use specific stage names
✅ Copy only necessary files
✅ Use smallest base for final stage
✅ Remove build tools from final image
✅ Use --target for development builds
✅ Cache dependencies in separate stage
```

