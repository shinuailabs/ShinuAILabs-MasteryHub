# Lab 833: Concurrency

## LEARNING CONCEPT

Managing concurrent workflow runs.

## EXERCISE

1. Configure concurrency groups
2. Cancel in-progress runs
3. Queue workflow runs

## SOLUTION

### Basic Concurrency

```yaml
name: CI

on: push

# Only one run at a time
concurrency: ci-workflow

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

### Concurrency with Cancel

```yaml
name: CI

on: push

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

### Branch-Based Concurrency

```yaml
concurrency:
  # Different group per branch
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### PR Concurrency

```yaml
name: PR Check

on:
  pull_request:
    types: [opened, synchronize]

concurrency:
  # Group by PR number
  group: pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Environment Concurrency

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    concurrency:
      # Only one deployment at a time
      group: deploy-production
      cancel-in-progress: false  # Queue instead of cancel
      
    steps:
      - run: ./deploy.sh
```

### Job-Level Concurrency

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    # Job-specific concurrency
    concurrency:
      group: deploy-${{ github.ref }}
      cancel-in-progress: false
      
    steps:
      - run: ./deploy.sh
```

### Concurrency Patterns

```yaml
# Pattern 1: Cancel previous on same branch
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Pattern 2: Queue deployments
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false

# Pattern 3: One run per PR
concurrency:
  group: pr-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

# Pattern 4: Global limit
concurrency:
  group: global-limit
  cancel-in-progress: false
```

### Conditional Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  # Only cancel on PRs, not main
  cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}
```

### Multiple Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    concurrency:
      group: deploy-staging
      cancel-in-progress: true
    steps:
      - run: ./deploy.sh staging
      
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: deploy-production
      cancel-in-progress: false
    steps:
      - run: ./deploy.sh production
```

### Handling Cancelled Runs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
      - name: Cleanup on cancel
        if: cancelled()
        run: ./cleanup.sh
```

### Concurrency with Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        
    runs-on: ubuntu-latest
    
    # Each matrix combination has its own group
    concurrency:
      group: test-${{ github.ref }}-node-${{ matrix.node }}
      cancel-in-progress: true
      
    steps:
      - run: npm test
```

### Real-World Example

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    concurrency:
      group: production-deploy
      cancel-in-progress: false
      
    environment:
      name: production
      url: https://example.com
      
    steps:
      - run: ./deploy.sh
```

### Best Practices

```
✅ Use meaningful group names
✅ Cancel PRs, queue deployments
✅ Consider branch-specific groups
✅ Handle cancellation gracefully
✅ Document concurrency behavior
```

