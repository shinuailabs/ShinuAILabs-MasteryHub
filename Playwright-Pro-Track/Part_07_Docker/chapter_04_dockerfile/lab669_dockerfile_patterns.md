# Lab 669: Dockerfile Patterns

## LEARNING CONCEPT

Common Dockerfile patterns for different use cases.

## EXERCISE

1. Learn common patterns
2. Apply to projects
3. Customize as needed

## SOLUTION

### Node.js Pattern

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Application
COPY . .

# Non-root user
USER node

EXPOSE 3000
CMD ["node", "app.js"]
```

### Python Pattern

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application
COPY . .

# Non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 8000
CMD ["python", "app.py"]
```

### Go Pattern

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main .

# Production stage
FROM scratch
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]
```

### Java Pattern

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
USER 1000
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### React Pattern

```dockerfile
# Build stage
FROM node:18-alpine AS builder
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

### Development Pattern

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source (will be overridden by bind mount)
COPY . .

# Development command
CMD ["npm", "run", "dev"]
```

### Testing Pattern

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Test stage
FROM base AS test
RUN npm test

# Build stage
FROM base AS builder
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/app.js"]
```

### Monorepo Pattern

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/api/package*.json ./packages/api/
RUN npm ci

FROM base AS builder
COPY . .
RUN npm run build --workspace=packages/api

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/app.js"]
```

### Cron Job Pattern

```dockerfile
FROM alpine:3.19

# Install cron
RUN apk add --no-cache dcron

# Copy cron job
COPY crontab /etc/crontabs/root

# Copy script
COPY script.sh /app/script.sh
RUN chmod +x /app/script.sh

# Run cron in foreground
CMD ["crond", "-f"]
```

### Init Process Pattern

```dockerfile
FROM node:18-alpine

# Install tini for proper signal handling
RUN apk add --no-cache tini

WORKDIR /app
COPY . .

# Use tini as init
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "app.js"]
```

