# Lab 883: Cache Strategies

## LEARNING CONCEPT

Advanced caching strategies for optimal performance.

## EXERCISE

1. Design cache keys
2. Implement fallback strategies
3. Handle cache invalidation

## SOLUTION

### Key Design Principles

```yaml
# Good key structure:
# {os}-{tool}-{hash}

key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
key: ${{ runner.os }}-node-${{ matrix.node }}-${{ hashFiles('**/package-lock.json') }}
key: ${{ runner.os }}-build-${{ github.sha }}
```

### Restore Key Hierarchy

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ matrix.node }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-${{ matrix.node }}-
      ${{ runner.os }}-node-
      ${{ runner.os }}-
```

### Branch-Specific Cache

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-${{ github.ref }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-${{ github.ref }}-
      ${{ runner.os }}-refs/heads/main-
      ${{ runner.os }}-
```

### Time-Based Invalidation

```yaml
- name: Get week number
  id: week
  run: echo "week=$(date +%V)" >> $GITHUB_OUTPUT
  
- uses: actions/cache@v4
  with:
    path: ~/.cache
    key: ${{ runner.os }}-cache-week-${{ steps.week.outputs.week }}
```

### Content-Based Key

```yaml
- uses: actions/cache@v4
  with:
    path: .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-nextjs-
```

### Monorepo Caching

```yaml
- uses: actions/cache@v4
  with:
    path: |
      node_modules
      packages/*/node_modules
    key: ${{ runner.os }}-monorepo-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}
```

### Build Cache

```yaml
- uses: actions/cache@v4
  with:
    path: |
      .next/cache
      dist/.cache
    key: ${{ runner.os }}-build-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-build-
```

### Test Cache

```yaml
- uses: actions/cache@v4
  with:
    path: |
      .jest-cache
      .eslintcache
    key: ${{ runner.os }}-test-${{ hashFiles('**/package-lock.json') }}-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-test-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-test-
```

### Playwright Cache

```yaml
- name: Get Playwright version
  id: playwright
  run: echo "version=$(npm ls @playwright/test --json | jq -r '.dependencies["@playwright/test"].version')" >> $GITHUB_OUTPUT
  
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ steps.playwright.outputs.version }}
```

### Docker Layer Cache

```yaml
- uses: actions/cache@v4
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
      
- uses: docker/build-push-action@v5
  with:
    cache-from: type=local,src=/tmp/.buildx-cache
    cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
```

### Cache Cleanup

```yaml
# Move cache to prevent unbounded growth
- name: Move cache
  run: |
    rm -rf /tmp/.buildx-cache
    mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

### Save Cache Only

```yaml
- uses: actions/cache/save@v4
  if: always()
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Restore Cache Only

```yaml
- uses: actions/cache/restore@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Complete Example

```yaml
name: Optimized Caching

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      # Dependency cache
      - uses: actions/cache@v4
        id: deps
        with:
          path: node_modules
          key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
          
      - if: steps.deps.outputs.cache-hit != 'true'
        run: npm ci
        
      # Build cache
      - uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('src/**') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
            
      - run: npm run build
```

### Best Practices

```
✅ Use specific cache keys
✅ Implement restore-key fallbacks
✅ Cache build outputs
✅ Handle cache growth
✅ Monitor cache hit rates
```

