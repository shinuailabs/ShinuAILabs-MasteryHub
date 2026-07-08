# Lab 888: Artifacts & Caching Best Practices

## LEARNING CONCEPT

Best practices for artifacts and caching.

## EXERCISE

1. Review artifact patterns
2. Optimize caching strategy
3. Apply best practices

## SOLUTION

### Artifacts vs Cache

```yaml
# Use ARTIFACTS for:
# - Build outputs needed by other jobs
# - Test results and reports
# - Release binaries
# - Debugging information

# Use CACHE for:
# - Dependencies (node_modules, pip packages)
# - Build caches (.next/cache, .gradle)
# - Tool installations
```

### Artifact Best Practices

```yaml
# 1. Descriptive names
- uses: actions/upload-artifact@v4
  with:
    name: build-${{ matrix.os }}-${{ github.sha }}
    path: dist/

# 2. Appropriate retention
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: results/
    retention-days: 7  # Short for temp artifacts

# 3. Exclude unnecessary files
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: |
      dist/
      !dist/**/*.map
      !dist/**/*.test.js
```

### Cache Best Practices

```yaml
# 1. Specific cache keys
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# 2. Use setup action caching
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

# 3. Conditional install
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    
- if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```

### Combined Strategy

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      # Cache dependencies
      - uses: actions/cache@v4
        id: deps
        with:
          path: node_modules
          key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
          
      - if: steps.deps.outputs.cache-hit != 'true'
        run: npm ci
        
      # Cache build
      - uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('src/**') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
            
      - run: npm run build
      
      # Upload artifact for deployment
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next/
          retention-days: 1
```

### Matrix Handling

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - run: npm test -- --shard=${{ matrix.shard }}/4
      
      - uses: actions/upload-artifact@v4
        with:
          name: results-${{ matrix.shard }}
          path: test-results/
          
  merge:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          pattern: results-*
          merge-multiple: true
          path: all-results/
```

### Storage Optimization

```yaml
# Compress before upload
- name: Compress
  run: tar -czvf build.tar.gz dist/
  
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: build.tar.gz
    compression-level: 9

# Clean cache before saving
- name: Clean cache
  run: |
    rm -rf node_modules/.cache
    rm -rf node_modules/**/*.md
```

### Error Handling

```yaml
# Handle missing artifacts
- uses: actions/download-artifact@v4
  id: download
  continue-on-error: true
  with:
    name: optional-artifact
    
- if: steps.download.outcome == 'failure'
  run: echo "Artifact not found, using defaults"

# Upload on failure
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: debug-logs
    path: |
      logs/
      screenshots/
```

### Checklist

```
Artifacts:
□ Descriptive names
□ Appropriate retention
□ Exclude unnecessary files
□ Upload on failure for debugging
□ Verify before use

Caching:
□ Specific cache keys
□ Restore key fallbacks
□ Conditional install
□ Monitor hit rates
□ Clean before saving

General:
□ Document strategy
□ Monitor storage usage
□ Regular cleanup
□ Test cache invalidation
```

### Anti-Patterns

```yaml
# ❌ Caching build outputs
- uses: actions/cache@v4
  with:
    path: dist/  # Use artifact instead
    key: build-${{ github.sha }}

# ❌ Long retention for temp artifacts
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    retention-days: 90  # Too long

# ❌ No restore keys
- uses: actions/cache@v4
  with:
    path: node_modules
    key: exact-key-only  # No fallback
```

### Complete Template

```yaml
name: Optimized CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - uses: actions/cache@v4
        id: modules
        with:
          path: node_modules
          key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}
          
      - if: steps.modules.outputs.cache-hit != 'true'
        run: npm ci
        
      - uses: actions/cache@v4
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('src/**') }}
          restore-keys: ${{ runner.os }}-nextjs-
          
      - run: npm run build
      - run: npm test
      
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ github.sha }}
          path: .next/
          retention-days: ${{ github.ref == 'refs/heads/main' && 7 || 1 }}
          
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
          retention-days: 7
          if-no-files-found: ignore
```

### Best Practices Summary

```
✅ Use artifacts for outputs
✅ Use cache for dependencies
✅ Set appropriate retention
✅ Use specific cache keys
✅ Handle errors gracefully
✅ Monitor storage usage
✅ Document your strategy
```

