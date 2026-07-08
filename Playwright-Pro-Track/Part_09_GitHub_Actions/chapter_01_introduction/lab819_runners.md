# Lab 819: Runners

## LEARNING CONCEPT

Understanding GitHub Actions runners.

## EXERCISE

1. Learn about runner types
2. Configure runner selection
3. Set up self-hosted runners

## SOLUTION

### Runner Types

```
GitHub-Hosted Runners:
- Managed by GitHub
- Pre-configured environments
- Pay per minute
- Fresh VM each job

Self-Hosted Runners:
- Managed by you
- Custom configuration
- No minute limits
- Persistent environment
```

### GitHub-Hosted Runner Specs

```
Linux (ubuntu-latest):
- 4 vCPUs
- 16 GB RAM
- 14 GB SSD
- Pre-installed: Node, Python, Java, Docker

Windows (windows-latest):
- 4 vCPUs
- 16 GB RAM
- 14 GB SSD
- Pre-installed: .NET, Node, Python

macOS (macos-latest):
- 3 vCPUs (M1)
- 7 GB RAM
- 14 GB SSD
- Pre-installed: Xcode, Node, Python
```

### Selecting Runners

```yaml
jobs:
  # Single runner
  build:
    runs-on: ubuntu-latest
    
  # Specific version
  test:
    runs-on: ubuntu-22.04
    
  # Multiple OS
  cross-platform:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
```

### Self-Hosted Runner Setup

```bash
# 1. Go to repository Settings → Actions → Runners
# 2. Click "New self-hosted runner"
# 3. Follow instructions:

# Download
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure
./config.sh --url https://github.com/OWNER/REPO --token TOKEN

# Run
./run.sh
```

### Self-Hosted Runner as Service

```bash
# Install as service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status

# Stop service
sudo ./svc.sh stop
```

### Self-Hosted Runner Labels

```yaml
# Use self-hosted runner with labels
jobs:
  build:
    runs-on: [self-hosted, linux, x64]
    
  gpu-job:
    runs-on: [self-hosted, gpu]
    
  docker-job:
    runs-on: [self-hosted, docker]
```

### Runner Groups

```yaml
# Organization-level runner groups
jobs:
  build:
    runs-on:
      group: production-runners
      labels: [linux, x64]
```

### Docker Container Runner

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20
      options: --user root
      
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

### Container with Services

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
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
```

### Runner Environment

```yaml
jobs:
  info:
    runs-on: ubuntu-latest
    
    steps:
      - name: Runner info
        run: |
          echo "Runner OS: $RUNNER_OS"
          echo "Runner Arch: $RUNNER_ARCH"
          echo "Runner Name: $RUNNER_NAME"
          echo "Runner Temp: $RUNNER_TEMP"
          echo "Runner Tool Cache: $RUNNER_TOOL_CACHE"
```

### Pre-installed Software

```yaml
jobs:
  check-tools:
    runs-on: ubuntu-latest
    
    steps:
      - name: Check versions
        run: |
          node --version
          npm --version
          python3 --version
          java --version
          docker --version
          git --version
```

### Self-Hosted Runner Security

```
Security considerations:
- Don't use for public repos
- Use runner groups
- Limit repository access
- Regular updates
- Network isolation
- Clean workspace after jobs
```

### Best Practices

```
✅ Use GitHub-hosted for public repos
✅ Self-hosted for private/enterprise
✅ Use labels for runner selection
✅ Keep runners updated
✅ Monitor runner health
✅ Use containers for isolation
```

