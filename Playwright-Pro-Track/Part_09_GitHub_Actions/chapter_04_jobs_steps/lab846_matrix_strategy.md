# Lab 846: Matrix Strategy

## LEARNING CONCEPT

Running jobs across multiple configurations using matrix.

## EXERCISE

1. Define matrix configurations
2. Use matrix values in jobs
3. Handle matrix failures

## SOLUTION

### Basic Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Multi-Dimensional Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Include Additional Configurations

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        os: [ubuntu-latest]
        include:
          # Add specific combination
          - node: 22
            os: ubuntu-latest
            experimental: true
          # Add extra variable to existing
          - node: 20
            os: ubuntu-latest
            coverage: true
            
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
      - if: matrix.coverage
        run: npm run coverage
```

### Exclude Configurations

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
        exclude:
          # Skip Node 18 on Windows
          - node: 18
            os: windows-latest
          # Skip Node 22 on macOS
          - node: 22
            os: macos-latest
            
    runs-on: ${{ matrix.os }}
    steps:
      - run: echo "Node ${{ matrix.node }} on ${{ matrix.os }}"
```

### Fail-Fast

```yaml
jobs:
  test:
    strategy:
      fail-fast: false  # Continue other jobs if one fails
      matrix:
        node: [18, 20, 22]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Max Parallel

```yaml
jobs:
  test:
    strategy:
      max-parallel: 2  # Run at most 2 jobs at a time
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm test
```

### Dynamic Matrix

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - id: set-matrix
        run: |
          echo 'matrix={"node":["18","20","22"]}' >> $GITHUB_OUTPUT
          
  test:
    needs: setup
    strategy:
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
    runs-on: ubuntu-latest
    steps:
      - run: echo "Node ${{ matrix.node }}"
```

### Matrix with Objects

```yaml
jobs:
  deploy:
    strategy:
      matrix:
        environment:
          - name: staging
            url: https://staging.example.com
          - name: production
            url: https://example.com
            
    runs-on: ubuntu-latest
    environment:
      name: ${{ matrix.environment.name }}
      url: ${{ matrix.environment.url }}
      
    steps:
      - run: echo "Deploying to ${{ matrix.environment.name }}"
```

### Continue on Error

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        include:
          - node: 22
            experimental: true
            
    runs-on: ubuntu-latest
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - run: npm test
```

### Matrix Job Name

```yaml
jobs:
  test:
    name: Test Node ${{ matrix.node }} on ${{ matrix.os }}
    strategy:
      matrix:
        node: [18, 20]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm test
```

### Complete Example

```yaml
name: Cross-Platform Tests

on: [push, pull_request]

jobs:
  test:
    name: Node ${{ matrix.node }} / ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      max-parallel: 4
      matrix:
        node: [18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
        include:
          - node: 22
            os: ubuntu-latest
            experimental: true
        exclude:
          - node: 18
            os: macos-latest
            
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
```

### Best Practices

```
✅ Use fail-fast: false for full coverage
✅ Limit parallel jobs for resources
✅ Use include for special cases
✅ Name jobs clearly
✅ Handle experimental configurations
```

