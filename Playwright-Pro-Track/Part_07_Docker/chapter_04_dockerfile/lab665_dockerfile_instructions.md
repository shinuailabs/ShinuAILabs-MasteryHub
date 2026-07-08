# Lab 665: Dockerfile Instructions Deep Dive

## LEARNING CONCEPT

Understanding all Dockerfile instructions in detail.

## EXERCISE

1. Learn each instruction
2. Understand use cases
3. Apply correctly

## SOLUTION

### FROM Instruction

```dockerfile
# Basic FROM
FROM ubuntu:22.04

# FROM with platform
FROM --platform=linux/amd64 node:18

# FROM with alias (multi-stage)
FROM node:18 AS builder

# FROM scratch (empty image)
FROM scratch
```

### RUN Instruction

```dockerfile
# Shell form
RUN apt-get update && apt-get install -y curl

# Exec form
RUN ["apt-get", "update"]

# Multi-line RUN
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        vim && \
    rm -rf /var/lib/apt/lists/*

# With different shell
RUN ["/bin/bash", "-c", "echo hello"]
```

### COPY vs ADD

```dockerfile
# COPY - Simple copy
COPY file.txt /app/
COPY src/ /app/src/
COPY --chown=user:group file.txt /app/

# ADD - Copy with extras
ADD file.tar.gz /app/           # Auto-extracts
ADD https://example.com/file /app/  # Downloads URL

# Prefer COPY over ADD
# Use ADD only for tar extraction or URL download
```

### CMD vs ENTRYPOINT

```dockerfile
# CMD - Default command (can be overridden)
CMD ["node", "app.js"]
CMD node app.js  # Shell form

# ENTRYPOINT - Main executable (harder to override)
ENTRYPOINT ["node"]
CMD ["app.js"]  # Default argument

# Combined usage
ENTRYPOINT ["node"]
CMD ["app.js"]
# Runs: node app.js
# Override: docker run my-app other.js
# Runs: node other.js
```

### ENV vs ARG

```dockerfile
# ARG - Build-time only
ARG VERSION=1.0.0
RUN echo "Building version $VERSION"

# ENV - Runtime available
ENV NODE_ENV=production
ENV PORT=3000

# ARG to ENV
ARG VERSION
ENV APP_VERSION=$VERSION
```

### WORKDIR Instruction

```dockerfile
# Set working directory
WORKDIR /app

# Creates directory if not exists
WORKDIR /app/src

# Can use environment variables
ENV APP_HOME=/app
WORKDIR $APP_HOME
```

### EXPOSE Instruction

```dockerfile
# Document port
EXPOSE 3000

# Multiple ports
EXPOSE 80 443

# Specific protocol
EXPOSE 80/tcp
EXPOSE 53/udp
```

### USER Instruction

```dockerfile
# Switch to user
USER node

# User and group
USER 1000:1000

# Create and switch
RUN addgroup -S app && adduser -S app -G app
USER app
```

### VOLUME Instruction

```dockerfile
# Declare volume mount point
VOLUME /data
VOLUME ["/data", "/logs"]

# Data at these paths will persist
```

### HEALTHCHECK Instruction

```dockerfile
# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

# Disable health check
HEALTHCHECK NONE
```

### SHELL Instruction

```dockerfile
# Change default shell
SHELL ["/bin/bash", "-c"]

# Now RUN uses bash
RUN echo "Using bash"

# PowerShell on Windows
SHELL ["powershell", "-Command"]
```

### STOPSIGNAL Instruction

```dockerfile
# Set stop signal
STOPSIGNAL SIGTERM

# Or use number
STOPSIGNAL 9
```

### ONBUILD Instruction

```dockerfile
# Trigger for child images
ONBUILD COPY . /app
ONBUILD RUN npm install

# Executes when image is used as base
```

