# Lab 709: Docker with GitHub Actions

## LEARNING CONCEPT

Using Docker in GitHub Actions workflows.

## EXERCISE

1. Build and push images
2. Run tests in containers
3. Deploy with Docker

## SOLUTION

### Build and Push

```yaml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            myuser/myapp:latest
            myuser/myapp:${{ github.sha }}
```

### Build with Buildx

```yaml
name: Multi-Platform Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: myuser/myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Run Tests in Container

```yaml
name: Test in Container

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:18
      options: --user root

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

### Docker Compose in Actions

```yaml
name: Docker Compose Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start services
        run: docker compose up -d

      - name: Wait for services
        run: |
          docker compose exec -T app curl --retry 10 --retry-delay 5 http://localhost:3000/health

      - name: Run tests
        run: docker compose run --rm test

      - name: Cleanup
        if: always()
        run: docker compose down -v
```

### Service Containers

```yaml
name: Test with Services

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:password@localhost:5432/postgres
          REDIS_URL: redis://localhost:6379
```

### GitHub Container Registry

```yaml
name: Push to GHCR

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```

### Matrix Build

```yaml
name: Matrix Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20]
        platform: [linux/amd64, linux/arm64]

    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - name: Build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: ${{ matrix.platform }}
          build-args: NODE_VERSION=${{ matrix.node }}
          push: false
```

### Reusable Workflow

```yaml
# .github/workflows/docker-build.yml
name: Docker Build

on:
  workflow_call:
    inputs:
      image-name:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          context: .
          tags: ${{ inputs.image-name }}
```

