# Lab 664: Dockerfile Basics

## LEARNING CONCEPT

Understanding Dockerfile syntax and structure.

### Dockerfile Purpose:
- Define image build steps
- Automate image creation
- Document build process
- Enable reproducible builds

## EXERCISE

1. Create basic Dockerfile
2. Understand instructions
3. Build image

## SOLUTION

### Basic Dockerfile Structure

```dockerfile
# Comment
FROM base-image:tag

# Set metadata
LABEL maintainer="email@example.com"

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Run commands
RUN npm install

# Expose port
EXPOSE 3000

# Set default command
CMD ["npm", "start"]
```

### Common Instructions

```dockerfile
# FROM - Base image
FROM node:18-alpine

# LABEL - Metadata
LABEL version="1.0"
LABEL description="My application"

# ENV - Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# ARG - Build-time variables
ARG VERSION=1.0.0

# WORKDIR - Working directory
WORKDIR /app

# COPY - Copy files from host
COPY package.json .
COPY src/ ./src/

# ADD - Copy with extra features (URL, tar extraction)
ADD https://example.com/file.tar.gz /app/

# RUN - Execute commands
RUN npm install
RUN apt-get update && apt-get install -y curl

# EXPOSE - Document ports
EXPOSE 3000
EXPOSE 8080/tcp
EXPOSE 53/udp

# USER - Set user
USER node

# CMD - Default command
CMD ["node", "app.js"]

# ENTRYPOINT - Main executable
ENTRYPOINT ["node"]
CMD ["app.js"]
```

### Build Image

```bash
# Basic build
docker build -t my-app .

# Build with tag
docker build -t my-app:v1.0.0 .

# Build with different Dockerfile
docker build -f Dockerfile.prod -t my-app .

# Build with build args
docker build --build-arg VERSION=2.0.0 -t my-app .

# Build without cache
docker build --no-cache -t my-app .
```

### Example: Node.js Application

```dockerfile
# Dockerfile
FROM node:18-alpine

LABEL maintainer="dev@example.com"
LABEL version="1.0.0"

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run as non-root user
USER node

# Start application
CMD ["node", "app.js"]
```

### Example: Python Application

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["python", "app.py"]
```

### Build Context

```bash
# Build context is current directory
docker build -t my-app .

# Build context is specific directory
docker build -t my-app ./app

# Build context from URL
docker build -t my-app https://github.com/user/repo.git
```

### .dockerignore

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
tests
coverage
```

