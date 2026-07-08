# 🎯 Docker Cheat Sheet

## Quick Reference Card

---

## 🔧 Basic Commands

```bash
# Images
docker images                    # List images
docker pull nginx               # Download image
docker build -t myapp .         # Build image
docker rmi image_name           # Remove image

# Containers
docker ps                       # Running containers
docker ps -a                    # All containers
docker run -d nginx             # Run detached
docker run -it ubuntu bash      # Interactive
docker stop container_id        # Stop
docker rm container_id          # Remove
docker logs container_id        # View logs
docker exec -it container bash  # Enter container
```

---

## 📄 Dockerfile

```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

---

## 🎭 Playwright Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npx", "playwright", "test"]
```

```bash
# Run Playwright tests
docker run --rm -v $(pwd):/app mcr.microsoft.com/playwright:v1.40.0-jammy npx playwright test
```

---

## 🔗 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    environment:
      - NODE_ENV=development
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

```bash
# Compose commands
docker-compose up -d            # Start
docker-compose down             # Stop
docker-compose logs -f          # Follow logs
docker-compose build            # Rebuild
docker-compose exec app bash    # Enter service
```

---

## 📦 Volumes & Networks

```bash
# Volumes
docker volume create mydata
docker volume ls
docker run -v mydata:/data nginx
docker run -v $(pwd):/app nginx  # Bind mount

# Networks
docker network create mynet
docker network ls
docker run --network mynet nginx
```

---

## 🏃 Common Patterns

```bash
# Run and remove after exit
docker run --rm nginx

# Port mapping
docker run -p 8080:80 nginx

# Environment variables
docker run -e MY_VAR=value nginx
docker run --env-file .env nginx

# Named container
docker run --name mycontainer nginx

# Resource limits
docker run --memory=512m --cpus=1 nginx
```

---

*Keep this handy while coding!* 🚀
