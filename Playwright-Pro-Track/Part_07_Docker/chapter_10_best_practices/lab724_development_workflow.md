# Lab 724: Development Workflow

## LEARNING CONCEPT

Optimizing Docker for development workflows.

## EXERCISE

1. Set up development environment
2. Enable hot reloading
3. Debug in containers

## SOLUTION

### Development Compose File

```yaml
# docker-compose.yml (base)
version: '3.8'
services:
  api:
    image: myapi
    ports:
      - "3000:3000"

# docker-compose.override.yml (development - auto-loaded)
version: '3.8'
services:
  api:
    build: .
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

volumes:
  node_modules:
```

### Hot Reloading

```yaml
version: '3.8'
services:
  api:
    build: .
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
    command: npm run dev  # nodemon or similar
```

### Debugging

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port
    volumes:
      - .:/app
    command: node --inspect=0.0.0.0:9229 index.js
```

### VS Code Integration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Docker: Attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app"
    }
  ]
}
```

### Development Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Don't copy source - use volume mount
# COPY . .

# Development command
CMD ["npm", "run", "dev"]
```

### Multi-Stage for Dev/Prod

```dockerfile
# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

### Database Seeding

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    volumes:
      - ./init:/docker-entrypoint-initdb.d
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: devpassword

  seed:
    build: .
    command: npm run db:seed
    depends_on:
      - db
    profiles:
      - seed

volumes:
  pgdata:
```

### Development Scripts

```json
// package.json
{
  "scripts": {
    "docker:dev": "docker compose up",
    "docker:build": "docker compose build",
    "docker:shell": "docker compose exec api sh",
    "docker:logs": "docker compose logs -f",
    "docker:down": "docker compose down -v"
  }
}
```

### Makefile

```makefile
.PHONY: dev build shell logs down

dev:
	docker compose up

build:
	docker compose build

shell:
	docker compose exec api sh

logs:
	docker compose logs -f

down:
	docker compose down -v

test:
	docker compose run --rm api npm test
```

### Environment Management

```bash
# .env.development
NODE_ENV=development
DATABASE_URL=postgres://postgres:devpassword@db:5432/mydb
DEBUG=true

# .env.test
NODE_ENV=test
DATABASE_URL=postgres://postgres:testpassword@db:5432/testdb
```

### Best Practices

```
✅ Use docker-compose.override.yml
✅ Mount source code for hot reload
✅ Use named volumes for node_modules
✅ Enable debugging ports
✅ Use development-specific commands
✅ Separate dev/prod Dockerfiles
✅ Create helper scripts
```

### Checklist

```
□ Hot reloading configured
□ Debug ports exposed
□ Source code mounted
□ Dependencies cached
□ Environment variables set
□ Helper scripts created
□ VS Code integration
```

