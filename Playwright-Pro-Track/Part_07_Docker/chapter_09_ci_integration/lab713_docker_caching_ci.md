# Lab 713: Docker Caching in CI

## LEARNING CONCEPT

Optimizing Docker builds with caching in CI/CD.

## EXERCISE

1. Configure layer caching
2. Use BuildKit cache
3. Optimize build times

## SOLUTION

### GitHub Actions Cache

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build with cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Registry Cache

```yaml
- name: Build with registry cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myregistry/myapp:latest
    cache-from: type=registry,ref=myregistry/myapp:cache
    cache-to: type=registry,ref=myregistry/myapp:cache,mode=max
```

### Local Cache

```yaml
- name: Cache Docker layers
  uses: actions/cache@v4
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-

- name: Build with local cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=local,src=/tmp/.buildx-cache
    cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max

- name: Move cache
  run: |
    rm -rf /tmp/.buildx-cache
    mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

### GitLab CI Caching

```yaml
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_BUILDKIT: 1
  script:
    # Pull previous image for cache
    - docker pull $CI_REGISTRY_IMAGE:latest || true
    # Build with cache
    - docker build
        --cache-from $CI_REGISTRY_IMAGE:latest
        -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
        .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### Dockerfile Optimization

```dockerfile
# Optimize layer order for caching
FROM node:18-alpine

WORKDIR /app

# Copy package files first (changes less frequently)
COPY package*.json ./

# Install dependencies (cached if package.json unchanged)
RUN npm ci

# Copy source code (changes frequently)
COPY . .

# Build
RUN npm run build

CMD ["npm", "start"]
```

### Multi-Stage Caching

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### BuildKit Inline Cache

```yaml
- name: Build with inline cache
  run: |
    docker buildx build \
      --cache-from type=registry,ref=myregistry/myapp:cache \
      --cache-to type=inline \
      --push \
      -t myregistry/myapp:latest \
      .
```

### Jenkins Caching

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh '''
                    docker pull myregistry/myapp:latest || true
                    docker build \
                        --cache-from myregistry/myapp:latest \
                        -t myregistry/myapp:${BUILD_NUMBER} \
                        .
                '''
            }
        }
    }
}
```

### Cache Strategies

```yaml
# Strategy 1: Pull previous image
- run: docker pull myapp:latest || true
- run: docker build --cache-from myapp:latest -t myapp:new .

# Strategy 2: Use BuildKit cache mount
# In Dockerfile:
# RUN --mount=type=cache,target=/root/.npm npm ci

# Strategy 3: Multi-stage with cache
- uses: docker/build-push-action@v5
  with:
    target: deps
    cache-from: type=gha,scope=deps
    cache-to: type=gha,scope=deps,mode=max
```

### Measure Cache Effectiveness

```yaml
- name: Build with timing
  run: |
    time docker build -t myapp .
  
- name: Show layer sizes
  run: docker history myapp
```

### Best Practices

```
✅ Order Dockerfile for caching
✅ Use BuildKit
✅ Cache dependencies separately
✅ Use multi-stage builds
✅ Pull previous images
✅ Monitor cache hit rates
```

