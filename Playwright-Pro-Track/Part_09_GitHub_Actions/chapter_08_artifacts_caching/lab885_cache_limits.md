# Lab 885: Cache Limits

## LEARNING CONCEPT

Understanding and managing cache limits.

## EXERCISE

1. Understand cache limits
2. Optimize cache usage
3. Handle cache eviction

## SOLUTION

### Cache Limits

```
GitHub Actions cache limits:
- Total cache size: 10 GB per repository
- Individual cache: 10 GB max
- Cache entries: Evicted after 7 days of no access
- Oldest caches evicted when limit reached
```

### Check Cache Usage

```yaml
- name: Check cache size
  run: |
    echo "Checking cache directories..."
    du -sh ~/.npm 2>/dev/null || echo "npm cache not found"
    du -sh node_modules 2>/dev/null || echo "node_modules not found"
    du -sh ~/.cache 2>/dev/null || echo ".cache not found"
```

### Optimize Cache Size

```yaml
# Cache only what's needed
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      !~/.npm/_logs
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

### Selective Caching

```yaml
# Don't cache everything
- uses: actions/cache@v4
  with:
    path: |
      node_modules
      !node_modules/.cache
      !node_modules/**/*.md
      !node_modules/**/test
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Cache Cleanup

```yaml
- name: Clean cache before saving
  run: |
    # Remove unnecessary files
    rm -rf node_modules/.cache
    rm -rf node_modules/**/*.md
    rm -rf node_modules/**/test
    rm -rf node_modules/**/*.ts  # Keep only JS
    
    echo "Cache size after cleanup:"
    du -sh node_modules
```

### Prioritize Important Caches

```yaml
# Use specific keys for important caches
# More specific = higher priority

# High priority - exact match
key: ${{ runner.os }}-node-${{ matrix.node }}-${{ hashFiles('**/package-lock.json') }}

# Lower priority - fallback
restore-keys: |
  ${{ runner.os }}-node-${{ matrix.node }}-
  ${{ runner.os }}-node-
```

### Split Large Caches

```yaml
# Instead of one large cache
- uses: actions/cache@v4
  with:
    path: node_modules
    key: deps-${{ hashFiles('**/package-lock.json') }}
    
# Split into multiple smaller caches
- uses: actions/cache@v4
  with:
    path: node_modules/.pnpm
    key: pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    
- uses: actions/cache@v4
  with:
    path: ~/.cache/Cypress
    key: cypress-${{ hashFiles('**/package-lock.json') }}
```

### Monitor Cache Hits

```yaml
- uses: actions/cache@v4
  id: cache
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    
- name: Cache statistics
  run: |
    if [ "${{ steps.cache.outputs.cache-hit }}" == "true" ]; then
      echo "✅ Cache hit!"
    else
      echo "❌ Cache miss"
    fi
```

### Eviction Strategy

```yaml
# Use date in key for controlled eviction
- name: Get cache date
  id: date
  run: echo "date=$(date +%Y-%m)" >> $GITHUB_OUTPUT
  
- uses: actions/cache@v4
  with:
    path: ~/.cache
    key: ${{ runner.os }}-cache-${{ steps.date.outputs.date }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-cache-${{ steps.date.outputs.date }}-
      ${{ runner.os }}-cache-
```

### Cache API

```yaml
- name: List caches
  uses: actions/github-script@v7
  with:
    script: |
      const caches = await github.rest.actions.getActionsCacheList({
        owner: context.repo.owner,
        repo: context.repo.repo
      });
      
      let totalSize = 0;
      for (const cache of caches.data.actions_caches) {
        console.log(`${cache.key}: ${(cache.size_in_bytes / 1024 / 1024).toFixed(2)} MB`);
        totalSize += cache.size_in_bytes;
      }
      console.log(`Total: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
```

### Delete Old Caches

```yaml
- name: Delete old caches
  uses: actions/github-script@v7
  with:
    script: |
      const caches = await github.rest.actions.getActionsCacheList({
        owner: context.repo.owner,
        repo: context.repo.repo,
        per_page: 100
      });
      
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      for (const cache of caches.data.actions_caches) {
        const lastAccessed = new Date(cache.last_accessed_at).getTime();
        if (lastAccessed < cutoff) {
          await github.rest.actions.deleteActionsCacheById({
            owner: context.repo.owner,
            repo: context.repo.repo,
            cache_id: cache.id
          });
          console.log(`Deleted: ${cache.key}`);
        }
      }
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
      
      - name: Get cache key components
        id: cache-key
        run: |
          echo "date=$(date +%Y-%W)" >> $GITHUB_OUTPUT
          echo "hash=${{ hashFiles('**/package-lock.json') }}" >> $GITHUB_OUTPUT
          
      - uses: actions/cache@v4
        id: cache
        with:
          path: |
            node_modules
            !node_modules/.cache
          key: ${{ runner.os }}-node-${{ steps.cache-key.outputs.date }}-${{ steps.cache-key.outputs.hash }}
          restore-keys: |
            ${{ runner.os }}-node-${{ steps.cache-key.outputs.date }}-
            ${{ runner.os }}-node-
            
      - name: Cache status
        run: echo "Cache hit: ${{ steps.cache.outputs.cache-hit }}"
        
      - if: steps.cache.outputs.cache-hit != 'true'
        run: npm ci
```

### Best Practices

```
✅ Monitor cache usage
✅ Clean before caching
✅ Split large caches
✅ Use specific keys
✅ Implement eviction strategy
```

