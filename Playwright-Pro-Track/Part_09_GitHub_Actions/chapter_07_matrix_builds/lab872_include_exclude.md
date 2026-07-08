# Lab 872: Include and Exclude

## LEARNING CONCEPT

Customizing matrix with include and exclude.

## EXERCISE

1. Add specific configurations with include
2. Remove configurations with exclude
3. Combine include and exclude

## SOLUTION

### Basic Include

```yaml
strategy:
  matrix:
    node: [18, 20]
    include:
      # Add Node 22 as experimental
      - node: 22
        experimental: true
```

### Include with Extra Variables

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    include:
      # Add coverage flag for specific combo
      - os: ubuntu-latest
        node: 20
        coverage: true
```

### Include New Combinations

```yaml
strategy:
  matrix:
    os: [ubuntu-latest]
    node: [18, 20]
    include:
      # Add macOS with Node 20 only
      - os: macos-latest
        node: 20
      # Add Windows with Node 22
      - os: windows-latest
        node: 22
```

### Basic Exclude

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node: [18, 20, 22]
    exclude:
      # Skip Node 18 on macOS
      - os: macos-latest
        node: 18
      # Skip Node 22 on Windows
      - os: windows-latest
        node: 22
```

### Exclude Multiple

```yaml
strategy:
  matrix:
    browser: [chrome, firefox, safari, edge]
    os: [ubuntu-latest, windows-latest, macos-latest]
    exclude:
      # Safari only on macOS
      - browser: safari
        os: ubuntu-latest
      - browser: safari
        os: windows-latest
      # Edge only on Windows
      - browser: edge
        os: ubuntu-latest
      - browser: edge
        os: macos-latest
```

### Combine Include and Exclude

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    exclude:
      # Skip Node 18 on Windows
      - os: windows-latest
        node: 18
    include:
      # Add experimental Node 22
      - os: ubuntu-latest
        node: 22
        experimental: true
```

### Include Only (No Base Matrix)

```yaml
strategy:
  matrix:
    include:
      - os: ubuntu-latest
        node: 20
        name: "Linux LTS"
      - os: windows-latest
        node: 20
        name: "Windows LTS"
      - os: macos-latest
        node: 20
        name: "macOS LTS"
```

### Using Include Variables

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        include:
          - os: ubuntu-latest
            shell: bash
          - os: windows-latest
            shell: pwsh
            
    runs-on: ${{ matrix.os }}
    
    steps:
      - run: echo "Hello"
        shell: ${{ matrix.shell }}
```

### Conditional with Include

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        include:
          - node: 22
            experimental: true
            
    runs-on: ubuntu-latest
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - run: npm test
```

### Complex Example

```yaml
jobs:
  test:
    name: ${{ matrix.name }}
    
    strategy:
      fail-fast: false
      matrix:
        include:
          - name: "Ubuntu Node 18"
            os: ubuntu-latest
            node: 18
            
          - name: "Ubuntu Node 20 (Coverage)"
            os: ubuntu-latest
            node: 20
            coverage: true
            
          - name: "Windows Node 20"
            os: windows-latest
            node: 20
            
          - name: "macOS Node 20"
            os: macos-latest
            node: 20
            
          - name: "Ubuntu Node 22 (Experimental)"
            os: ubuntu-latest
            node: 22
            experimental: true
            
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          
      - run: npm ci
      - run: npm test
      
      - name: Coverage
        if: matrix.coverage
        run: npm run coverage
```

### Exclude Patterns

```yaml
# Exclude all combinations with specific value
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node: [16, 18, 20]
    exclude:
      # Exclude all Node 16 (deprecated)
      - node: 16
```

### Best Practices

```
✅ Use include for special cases
✅ Use exclude to remove invalid combos
✅ Document why exclusions exist
✅ Keep matrix manageable
✅ Test include/exclude logic
```

