# Lab 875: Max Parallel Jobs

## LEARNING CONCEPT

Controlling concurrent job execution in matrix.

## EXERCISE

1. Limit parallel jobs
2. Optimize resource usage
3. Handle rate limits

## SOLUTION

### Basic Max Parallel

```yaml
jobs:
  test:
    strategy:
      max-parallel: 2
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm test
```

### Why Limit Parallel Jobs

```yaml
# Reasons to limit:
# 1. External API rate limits
# 2. Shared resource constraints
# 3. Cost management
# 4. Database connection limits
# 5. License restrictions

jobs:
  deploy:
    strategy:
      max-parallel: 1  # Sequential deployment
      matrix:
        env: [dev, staging, production]
```

### Resource-Intensive Jobs

```yaml
jobs:
  e2e:
    strategy:
      max-parallel: 3  # Limit browser instances
      matrix:
        browser: [chrome, firefox, safari, edge]
        viewport: [desktop, tablet, mobile]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e
```

### API Rate Limiting

```yaml
jobs:
  sync:
    strategy:
      max-parallel: 2  # Respect API limits
      matrix:
        service: [github, gitlab, bitbucket, azure]
        
    runs-on: ubuntu-latest
    steps:
      - run: ./sync-to-${{ matrix.service }}.sh
```

### Database Testing

```yaml
jobs:
  test:
    strategy:
      max-parallel: 5  # Match connection pool
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/10
```

### Cost Management

```yaml
jobs:
  build:
    strategy:
      max-parallel: 4  # Control runner usage
      matrix:
        platform: [linux, windows, macos]
        arch: [x64, arm64]
        
    runs-on: ${{ matrix.platform }}-latest
    steps:
      - run: ./build.sh
```

### Sequential Execution

```yaml
jobs:
  deploy:
    strategy:
      max-parallel: 1  # One at a time
      fail-fast: true
      matrix:
        region: [us-east-1, us-west-2, eu-west-1, ap-southeast-1]
        
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh ${{ matrix.region }}
```

### Dynamic Max Parallel

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      max-parallel: ${{ steps.config.outputs.max-parallel }}
      
    steps:
      - id: config
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            echo "max-parallel=2" >> $GITHUB_OUTPUT
          else
            echo "max-parallel=10" >> $GITHUB_OUTPUT
          fi
          
  test:
    needs: setup
    strategy:
      max-parallel: ${{ fromJson(needs.setup.outputs.max-parallel) }}
      matrix:
        test: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### Combining with Fail-Fast

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      max-parallel: 3
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm test
```

### Staged Rollout

```yaml
jobs:
  deploy:
    strategy:
      max-parallel: 1
      matrix:
        include:
          - stage: canary
            percentage: 5
          - stage: partial
            percentage: 25
          - stage: full
            percentage: 100
            
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh --stage=${{ matrix.stage }} --percentage=${{ matrix.percentage }}
```

### Complete Example

```yaml
name: Controlled Parallel Execution

on: push

jobs:
  test:
    name: Test ${{ matrix.shard }}
    
    strategy:
      fail-fast: false
      max-parallel: 5
      matrix:
        shard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: --health-cmd pg_isready
        
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - run: npm ci
      
      - name: Run tests
        run: npm test -- --shard=${{ matrix.shard }}/10
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
```

### Best Practices

```
✅ Consider external limits
✅ Balance speed vs resources
✅ Use sequential for deployments
✅ Monitor resource usage
✅ Document parallelism choices
```

