# Lab 658: Container Environment Variables

## LEARNING CONCEPT

Configuring containers with environment variables.

### Methods:
- Command line (-e flag)
- Environment file (--env-file)
- Dockerfile (ENV instruction)
- Docker Compose

## EXERCISE

1. Set environment variables
2. Use env files
3. Override defaults

## SOLUTION

### Command Line Environment Variables

```bash
# Single variable
docker run -e MY_VAR=value nginx

# Multiple variables
docker run \
    -e DB_HOST=localhost \
    -e DB_PORT=5432 \
    -e DB_NAME=mydb \
    my-app

# Pass host environment variable
docker run -e HOME my-app

# Pass with different name
docker run -e CONTAINER_HOME=$HOME my-app
```

### Environment File

```bash
# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret
NODE_ENV=production
EOF

# Use env file
docker run --env-file .env my-app

# Multiple env files
docker run --env-file .env --env-file .env.local my-app
```

### Dockerfile ENV

```dockerfile
# Set default environment variables
FROM node:18-alpine

ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

WORKDIR /app
COPY . .

CMD ["node", "app.js"]
```

### Override Dockerfile ENV

```bash
# Override at runtime
docker run -e NODE_ENV=development my-app

# Dockerfile ENV is default
# Runtime -e overrides it
```

### ARG vs ENV

```dockerfile
# ARG: Build-time only
ARG VERSION=1.0.0
RUN echo "Building version $VERSION"

# ENV: Runtime available
ENV APP_VERSION=$VERSION

# ARG can set ENV
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
```

### Build Arguments

```bash
# Pass build argument
docker build --build-arg VERSION=2.0.0 -t my-app .

# Multiple build args
docker build \
    --build-arg VERSION=2.0.0 \
    --build-arg NODE_ENV=production \
    -t my-app .
```

### Inspect Environment

```bash
# View container environment
docker inspect --format='{{.Config.Env}}' my-container

# Execute env command
docker exec my-container env

# Print specific variable
docker exec my-container printenv DB_HOST
```

### Sensitive Variables

```bash
# ❌ Bad: Visible in process list
docker run -e PASSWORD=secret my-app

# ✅ Better: Use env file
echo "PASSWORD=secret" > .env
docker run --env-file .env my-app
rm .env

# ✅ Best: Use Docker secrets (Swarm)
echo "secret" | docker secret create db_password -
```

### Environment Variable Patterns

```bash
# Database configuration
docker run \
    -e DATABASE_URL=postgres://user:pass@host:5432/db \
    my-app

# Or separate variables
docker run \
    -e DB_HOST=host \
    -e DB_PORT=5432 \
    -e DB_USER=user \
    -e DB_PASSWORD=pass \
    -e DB_NAME=db \
    my-app

# Feature flags
docker run \
    -e FEATURE_NEW_UI=true \
    -e FEATURE_BETA=false \
    my-app

# Logging configuration
docker run \
    -e LOG_LEVEL=debug \
    -e LOG_FORMAT=json \
    my-app
```

### Best Practices

```
✅ Use env files for multiple variables
✅ Don't commit .env files with secrets
✅ Use ARG for build-time, ENV for runtime
✅ Provide sensible defaults in Dockerfile
✅ Document required environment variables
✅ Use Docker secrets for sensitive data
✅ Validate required variables at startup
```

