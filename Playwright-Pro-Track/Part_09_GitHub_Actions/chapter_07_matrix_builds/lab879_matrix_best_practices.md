# Lab 879: Matrix Best Practices

## LEARNING CONCEPT

Best practices for matrix builds.

## EXERCISE

1. Review matrix patterns
2. Optimize matrix configuration
3. Apply best practices

## SOLUTION

### Matrix Design Principles

```yaml
# 1. Start minimal, expand as needed
strategy:
  matrix:
    node: [20]  # Start with LTS
    os: [ubuntu-latest]  # Start with one OS

# 2. Add coverage gradually
strategy:
  matrix:
    node: [18, 20, 22]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### Naming Jobs Clearly

```yaml
jobs:
  test:
    name: Test Node ${{ matrix.node }} on ${{ matrix.os }}
    
    strategy:
      matrix:
        node: [18, 20]
        os: [ubuntu-latest, windows-latest]
```

### Use Include for Special Cases

```yaml
strategy:
  matrix:
    node: [18, 20]
    include:
      # Add experimental without expanding matrix
      - node: 22
        experimental: true
      # Add extra config to existing combo
      - node: 20
        coverage: true
```

### Use Exclude Sparingly

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node: [18, 20, 22]
    exclude:
      # Only exclude invalid combinations
      - os: macos-latest
        node: 18  # Not supported
```

### Fail-Fast Strategy

```yaml
# For PRs: Fast feedback
strategy:
  fail-fast: true
  matrix:
    node: [20]

# For main: Full coverage
strategy:
  fail-fast: false
  matrix:
    node: [18, 20, 22]
```

### Resource Management

```yaml
strategy:
  max-parallel: 4  # Limit concurrent jobs
  matrix:
    shard: [1, 2, 3, 4, 5, 6, 7, 8]
```

### Handle Experimental Versions

```yaml
strategy:
  matrix:
    node: [18, 20]
    include:
      - node: 22
        experimental: true
        
runs-on: ubuntu-latest
continue-on-error: ${{ matrix.experimental || false }}
```

### Dynamic Matrix for PRs

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set.outputs.matrix }}
      
    steps:
      - id: set
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            echo 'matrix={"node":["20"],"os":["ubuntu-latest"]}' >> $GITHUB_OUTPUT
          else
            echo 'matrix={"node":["18","20","22"],"os":["ubuntu-latest","windows-latest"]}' >> $GITHUB_OUTPUT
          fi
```

### Caching in Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'  # Automatic per-matrix caching
```

### Artifact Naming

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: results-${{ matrix.os }}-node${{ matrix.node }}
    path: results/
```

### Result Aggregation

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    # ...
    
  report:
    needs: test
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          pattern: results-*
          merge-multiple: true
```

### Checklist

```
Matrix Design:
□ Minimal for PRs
□ Comprehensive for main
□ Clear job names
□ Documented exclusions

Performance:
□ Appropriate max-parallel
□ Caching configured
□ Fail-fast strategy
□ Sharding for large suites

Maintenance:
□ Version updates scheduled
□ Experimental versions marked
□ Results aggregated
□ Artifacts named clearly
```

### Anti-Patterns

```yaml
# ❌ Too many dimensions
strategy:
  matrix:
    os: [ubuntu, windows, macos]
    node: [16, 18, 20, 22]
    browser: [chrome, firefox, safari]
    # 36 jobs!

# ✅ Use include for specific combos
strategy:
  matrix:
    include:
      - os: ubuntu-latest
        node: 20
        browser: chrome
      - os: windows-latest
        node: 20
        browser: chrome
```

### Complete Template

```yaml
name: Matrix CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set.outputs.matrix }}
      
    steps:
      - id: set
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            echo 'matrix={"node":["20"],"os":["ubuntu-latest"]}' >> $GITHUB_OUTPUT
          else
            echo 'matrix={"node":["18","20","22"],"os":["ubuntu-latest","windows-latest","macos-latest"]}' >> $GITHUB_OUTPUT
          fi
          
  test:
    needs: setup
    name: Node ${{ matrix.node }} / ${{ matrix.os }}
    
    strategy:
      fail-fast: ${{ github.event_name == 'pull_request' }}
      max-parallel: 6
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
      
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-${{ matrix.os }}-${{ matrix.node }}
          path: test-results/
```

### Best Practices Summary

```
✅ Start minimal, expand as needed
✅ Name jobs clearly
✅ Use include for special cases
✅ Configure fail-fast appropriately
✅ Limit parallel jobs
✅ Cache dependencies
✅ Aggregate results
✅ Document matrix choices
```

