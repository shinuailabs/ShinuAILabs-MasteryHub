# Part 05: Caching

## 📚 Overview
Caching in GitHub Actions speeds up workflows by reusing dependencies and build outputs.

---

## 🎯 Key Concepts

### 1. Basic Cache Action

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache node modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('package-lock.json') }}
          
      - run: npm ci
      - run: npm test
```

### 2. Cache with Restore Keys

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-
      npm-
```

### 3. Setup Node with Cache

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'  # Built-in caching
          
      - run: npm ci
      - run: npm test
```

### 4. Cache Playwright Browsers

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Get Playwright version
        id: playwright-version
        run: echo "version=$(npm show @playwright/test version)" >> $GITHUB_OUTPUT
        
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}
          
      - run: npm ci
      
      - name: Install Playwright browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps
        
      - run: npx playwright test
```

### 5. Multiple Cache Paths

```yaml
- name: Cache multiple paths
  uses: actions/cache@v4
  with:
    path: |
      node_modules
      ~/.cache/ms-playwright
      .next/cache
    key: deps-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

### 6. Cache Hit Detection

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: npm-${{ hashFiles('package-lock.json') }}

- name: Install dependencies
  if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```

### 7. Conditional Caching

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache (only on main)
        if: github.ref == 'refs/heads/main'
        uses: actions/cache@v4
        with:
          path: node_modules
          key: npm-${{ hashFiles('package-lock.json') }}
          
      - run: npm ci
      - run: npm test
```

### 8. Cache Cleanup

```yaml
# Caches are automatically deleted after 7 days of no access
# Or when repository storage limit is reached

# Manual cleanup via API
# gh api -X DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}
```

### 9. Complete Playwright Caching

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          
      - name: Cache Playwright
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: |
            ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            playwright-${{ runner.os }}-
            
      - run: npm ci
      
      - name: Install Playwright
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: npx playwright install --with-deps
        
      - name: Install deps only
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: npx playwright install-deps
        
      - run: npx playwright test
```

---

## 💻 Practice Exercises

1. Cache node_modules
2. Use setup-node caching
3. Cache Playwright browsers
4. Implement restore keys
5. Handle cache hits

---

## ✅ Best Practices

- ✅ Use hashFiles for cache keys
- ✅ Add restore-keys for fallback
- ✅ Cache expensive operations
- ✅ Check cache-hit before install
- ❌ Don't cache frequently changing files
- ❌ Avoid caching large files

---

## 📝 Quick Reference

```yaml
# Basic cache
- uses: actions/cache@v4
  with:
    path: node_modules
    key: npm-${{ hashFiles('package-lock.json') }}
    restore-keys: npm-

# Setup node with cache
- uses: actions/setup-node@v4
  with:
    node-version: 18
    cache: 'npm'

# Check cache hit
if: steps.cache.outputs.cache-hit != 'true'
```

