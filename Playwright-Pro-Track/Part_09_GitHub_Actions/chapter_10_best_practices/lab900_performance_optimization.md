# Lab 900: Performance Optimization

## LEARNING CONCEPT

Optimizing workflow performance.

## EXERCISE

1. Reduce workflow duration
2. Optimize resource usage
3. Implement caching strategies

## SOLUTION

### Caching Dependencies

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Built-in caching
    
- run: npm ci
```

### Cache node_modules

```yaml
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    
- if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```

### Parallel Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

### Test Sharding

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/4
```

### Conditional Execution

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Check for changes
        id: changes
        run: |
          if git diff --name-only HEAD~1 | grep -q "^src/"; then
            echo "run=true" >> $GITHUB_OUTPUT
          else
            echo "run=false" >> $GITHUB_OUTPUT
          fi
          
      - name: Run tests
        if: steps.changes.outputs.run == 'true'
        run: npm test
```

### Path Filters

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - 'package-lock.json'
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### Minimal Checkout

```yaml
# Shallow clone
- uses: actions/checkout@v4
  with:
    fetch-depth: 1

# Sparse checkout
- uses: actions/checkout@v4
  with:
    sparse-checkout: |
      src
      package.json
```

### Faster Runners

```yaml
jobs:
  build:
    # Use larger runner for faster builds
    runs-on: ubuntu-latest-4-cores
    steps:
      - run: npm run build
```

### Build Caching

```yaml
- uses: actions/cache@v4
  with:
    path: |
      .next/cache
      node_modules/.cache
    key: ${{ runner.os }}-build-${{ hashFiles('src/**') }}
    restore-keys: |
      ${{ runner.os }}-build-
```

### Docker Layer Caching

```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Timeout Limits

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - run: npm test
        timeout-minutes: 5
```

### Artifact Optimization

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: |
      dist/
      !dist/**/*.map
    compression-level: 9
    retention-days: 1
```

### Complete Example

```yaml
name: Optimized CI

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package*.json'
  pull_request:
    paths:
      - 'src/**'
      - 'package*.json'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      cache-hit: ${{ steps.cache.outputs.cache-hit }}
      
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
          
      - uses: actions/cache@v4
        id: cache
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          
      - if: steps.cache.outputs.cache-hit != 'true'
        run: npm ci
        
  lint:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      - run: npm run lint
      
  test:
    needs: setup
    strategy:
      matrix:
        shard: [1, 2]
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      - run: npm test -- --shard=${{ matrix.shard }}/2
```

### Best Practices

```
✅ Cache dependencies
✅ Run jobs in parallel
✅ Use path filters
✅ Shard large test suites
✅ Set appropriate timeouts
```

