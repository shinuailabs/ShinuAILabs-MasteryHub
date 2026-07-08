# Lab 847: Services

## LEARNING CONCEPT

Using service containers in GitHub Actions jobs.

## EXERCISE

1. Configure service containers
2. Connect to services
3. Use multiple services

## SOLUTION

### Basic Service

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
          
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
```

### Service with Health Check

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - run: npm test
```

### Redis Service

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - run: npm test
        env:
          REDIS_URL: redis://localhost:6379
```

### MySQL Service

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: testdb
        ports:
          - 3306:3306
        options: >-
          --health-cmd "mysqladmin ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - run: npm test
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/testdb
```

### MongoDB Service

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongo:
        image: mongo:6
        ports:
          - 27017:27017
          
    steps:
      - run: npm test
        env:
          MONGODB_URL: mongodb://localhost:27017/testdb
```

### Multiple Services

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s
        
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: --health-cmd "redis-cli ping" --health-interval 10s
        
      elasticsearch:
        image: elasticsearch:8.11.0
        env:
          discovery.type: single-node
          xpack.security.enabled: false
        ports:
          - 9200:9200
          
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
          REDIS_URL: redis://localhost:6379
          ELASTICSEARCH_URL: http://localhost:9200
```

### Service with Volume

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        volumes:
          - /tmp/postgres-data:/var/lib/postgresql/data
```

### Container Job with Services

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
        # No port mapping needed - use service name
        
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          # Use service name as hostname
          DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
```

### Custom Service Image

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      api:
        image: ghcr.io/myorg/api:latest
        credentials:
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
        ports:
          - 8080:8080
          
    steps:
      - run: curl http://localhost:8080/health
```

### Service Environment

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      app:
        image: myapp:latest
        env:
          NODE_ENV: test
          LOG_LEVEL: debug
          API_KEY: ${{ secrets.API_KEY }}
        ports:
          - 3000:3000
```

### Best Practices

```
✅ Always use health checks
✅ Set appropriate timeouts
✅ Use specific image versions
✅ Configure proper credentials
✅ Document service requirements
```

