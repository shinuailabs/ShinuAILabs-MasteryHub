# Lab 882: Caching Dependencies

## LEARNING CONCEPT

Caching dependencies to speed up workflows.

## EXERCISE

1. Cache npm dependencies
2. Configure cache keys
3. Handle cache misses

## SOLUTION

### Basic Cache

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    
- run: npm ci
```

### Cache with Restore Keys

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Node.js with Setup Action

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # Automatic caching
    
- run: npm ci
```

### Cache node_modules

```yaml
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    
- name: Install dependencies
  if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```

### Python Cache

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'
    
- run: pip install -r requirements.txt
```

### Manual Python Cache

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

### Ruby Cache

```yaml
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.2'
    bundler-cache: true  # Automatic caching
```

### Go Cache

```yaml
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
    cache: true  # Automatic caching
```

### Gradle Cache

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
```

### Maven Cache

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.m2/repository
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
```

### Multiple Paths

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache/Cypress
      node_modules
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
```

### Cache Output

```yaml
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    
- name: Cache status
  run: |
    echo "Cache hit: ${{ steps.cache.outputs.cache-hit }}"
    echo "Cache key: ${{ steps.cache.outputs.cache-primary-key }}"
```

### Conditional Install

```yaml
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    
- if: steps.cache.outputs.cache-hit != 'true'
  run: npm ci
```

### Complete Example

```yaml
name: CI with Caching

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
          
      - name: Cache node_modules
        uses: actions/cache@v4
        id: cache-modules
        with:
          path: node_modules
          key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}
          
      - name: Install dependencies
        if: steps.cache-modules.outputs.cache-hit != 'true'
        run: npm ci
        
      - run: npm test
      - run: npm run build
```

### Best Practices

```
✅ Use setup action caching
✅ Include lockfile in key
✅ Use restore-keys for fallback
✅ Cache node_modules for speed
✅ Check cache-hit before install
```

