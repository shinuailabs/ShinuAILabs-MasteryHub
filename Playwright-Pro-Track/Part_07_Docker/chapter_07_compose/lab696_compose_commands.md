# Lab 696: Compose Commands

## LEARNING CONCEPT

Mastering Docker Compose CLI commands.

## EXERCISE

1. Learn essential commands
2. Use advanced options
3. Manage compose projects

## SOLUTION

### Basic Commands

```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# Stop and remove images
docker compose down --rmi all
```

### Build Commands

```bash
# Build images
docker compose build

# Build without cache
docker compose build --no-cache

# Build specific service
docker compose build api

# Build and start
docker compose up --build
```

### Service Management

```bash
# Start specific services
docker compose up api db

# Stop specific service
docker compose stop api

# Start stopped service
docker compose start api

# Restart service
docker compose restart api

# Pause/unpause
docker compose pause api
docker compose unpause api
```

### Scaling

```bash
# Scale service
docker compose up -d --scale api=3

# Scale multiple services
docker compose up -d --scale api=3 --scale worker=2
```

### Logs

```bash
# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Specific service logs
docker compose logs api

# Last N lines
docker compose logs --tail 100

# With timestamps
docker compose logs -t
```

### Execute Commands

```bash
# Execute in running container
docker compose exec api npm test

# Execute as root
docker compose exec -u root api bash

# Execute in specific container (when scaled)
docker compose exec --index=2 api bash
```

### Run Commands

```bash
# Run one-off command
docker compose run api npm test

# Run without starting dependencies
docker compose run --no-deps api npm test

# Run and remove container
docker compose run --rm api npm test

# Run with specific service ports
docker compose run --service-ports api
```

### Status Commands

```bash
# List containers
docker compose ps

# List all (including stopped)
docker compose ps -a

# List services
docker compose config --services

# List images
docker compose images

# Show resource usage
docker compose top
```

### Configuration

```bash
# Validate compose file
docker compose config

# Show resolved config
docker compose config --resolve-image-digests

# Show specific service config
docker compose config --services
```

### Pull/Push

```bash
# Pull images
docker compose pull

# Pull specific service
docker compose pull api

# Push images
docker compose push
```

### Cleanup

```bash
# Remove stopped containers
docker compose rm

# Force remove
docker compose rm -f

# Remove with volumes
docker compose rm -v

# Prune
docker compose down --remove-orphans
```

### Project Management

```bash
# Specify project name
docker compose -p myproject up

# Specify compose file
docker compose -f docker-compose.prod.yml up

# Multiple compose files
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Environment file
docker compose --env-file .env.prod up
```

### Advanced Options

```bash
# Recreate containers
docker compose up -d --force-recreate

# Don't recreate dependencies
docker compose up -d --no-deps api

# Remove orphan containers
docker compose up -d --remove-orphans

# Wait for services to be healthy
docker compose up -d --wait

# Timeout for wait
docker compose up -d --wait --wait-timeout 60
```

### Profiles

```bash
# Start with profile
docker compose --profile debug up

# Multiple profiles
docker compose --profile debug --profile monitoring up
```

### Quick Reference

```bash
# Common workflow
docker compose up -d          # Start
docker compose logs -f        # View logs
docker compose exec api bash  # Debug
docker compose down           # Stop

# Development
docker compose up --build     # Rebuild and start
docker compose restart api    # Restart service

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

