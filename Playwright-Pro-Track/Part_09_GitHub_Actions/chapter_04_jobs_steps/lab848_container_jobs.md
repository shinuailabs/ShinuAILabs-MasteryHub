# Lab 848: Container Jobs

## LEARNING CONCEPT

Running jobs inside Docker containers.

## EXERCISE

1. Configure container jobs
2. Use custom images
3. Combine containers with services

## SOLUTION

### Basic Container Job

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20
      
    steps:
      - uses: actions/checkout@v4
      - run: node --version
      - run: npm ci
      - run: npm test
```

### Container with Options

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20-alpine
      env:
        NODE_ENV: production
      options: --user root
      volumes:
        - /tmp/cache:/cache
        
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
```

### Private Registry

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: ghcr.io/myorg/custom-image:latest
      credentials:
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    steps:
      - uses: actions/checkout@v4
      - run: ./build.sh
```

### Docker Hub Private Image

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: myorg/private-image:latest
      credentials:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
        
    steps:
      - run: echo "Running in private container"
```

### Container with Services

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:20
      
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: --health-cmd pg_isready --health-interval 10s
        
      redis:
        image: redis:7
        options: --health-cmd "redis-cli ping" --health-interval 10s
        
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          # Use service names as hostnames
          DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
          REDIS_URL: redis://redis:6379
```

### Python Container

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: python:3.11
      
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: pytest
```

### Custom Dockerfile

```yaml
# First build the image
jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myimage:latest .
      - run: docker save myimage:latest > image.tar
      - uses: actions/upload-artifact@v4
        with:
          name: docker-image
          path: image.tar
          
  use-image:
    needs: build-image
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: docker-image
      - run: docker load < image.tar
      - run: docker run myimage:latest ./test.sh
```

### Multi-Architecture

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20
      options: --platform linux/amd64
      
    steps:
      - run: uname -m
```

### Container Environment

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20
      env:
        CI: true
        NODE_ENV: test
        LOG_LEVEL: debug
        
    steps:
      - run: echo "CI=$CI"
      - run: echo "NODE_ENV=$NODE_ENV"
```

### Working Directory

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20
      
    defaults:
      run:
        working-directory: /app
        
    steps:
      - uses: actions/checkout@v4
        with:
          path: /app
      - run: pwd  # /app
      - run: npm ci
```

### Container Networking

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:20
      options: --network host
      
    steps:
      - run: curl http://localhost:8080
```

### Complete Example

```yaml
name: Container CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    container:
      image: node:20-alpine
      env:
        NODE_ENV: test
      options: --user root
      
    services:
      db:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgres://test:test@db:5432/testdb
```

### Best Practices

```
✅ Use specific image tags
✅ Configure proper credentials
✅ Set appropriate user permissions
✅ Use health checks for services
✅ Document container requirements
```

