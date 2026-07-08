# Lab 690: Docker Compose Basics

## LEARNING CONCEPT

Using Docker Compose for multi-container applications.

### Compose Features:
- Define multi-container apps
- Single command deployment
- Environment management
- Service orchestration

## EXERCISE

1. Create docker-compose.yml
2. Deploy multi-container app
3. Manage services

## SOLUTION

### Basic docker-compose.yml

```yaml
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "80:80"
    
  api:
    image: node:18
    working_dir: /app
    volumes:
      - ./api:/app
    command: npm start
    ports:
      - "3000:3000"
    
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Compose Commands

```bash
# Start services
docker compose up

# Start in detached mode
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# View logs
docker compose logs
docker compose logs -f api

# List services
docker compose ps

# Execute command in service
docker compose exec api npm test

# Scale service
docker compose up -d --scale api=3
```

### Build from Dockerfile

```yaml
version: '3.8'
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

### Environment Variables

```yaml
version: '3.8'
services:
  api:
    image: my-api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/mydb
    env_file:
      - .env
```

### Dependencies

```yaml
version: '3.8'
services:
  api:
    image: my-api
    depends_on:
      - db
      - redis
    
  db:
    image: postgres:15
    
  redis:
    image: redis:7
```

### Health Checks

```yaml
version: '3.8'
services:
  api:
    image: my-api
    depends_on:
      db:
        condition: service_healthy
    
  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Networks

```yaml
version: '3.8'
services:
  web:
    image: nginx
    networks:
      - frontend
    
  api:
    image: my-api
    networks:
      - frontend
      - backend
    
  db:
    image: postgres:15
    networks:
      - backend

networks:
  frontend:
  backend:
```

### Volumes

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  pgdata:
```

### Complete Example

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    networks:
      - frontend

  api:
    build: ./api
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
    networks:
      - frontend
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
    networks:
      - backend

  redis:
    image: redis:7-alpine
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  pgdata:
```

