# Lab 871: Matrix Basics

## LEARNING CONCEPT

Understanding matrix strategy fundamentals.

## EXERCISE

1. Create basic matrix
2. Use matrix values
3. Understand matrix expansion

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

### Matrix Expansion

```yaml
# This creates 6 jobs (2 x 3)
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20, 22]
    
# Jobs created:
# - ubuntu-latest, node 18
# - ubuntu-latest, node 20
# - ubuntu-latest, node 22
# - windows-latest, node 18
# - windows-latest, node 20
# - windows-latest, node 22
```

### Using Matrix Values

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          
      - run: node --version
      - run: npm test
```

### String Values

```yaml
strategy:
  matrix:
    browser: ['chrome', 'firefox', 'safari']
    
steps:
  - run: npm run test:e2e -- --browser=${{ matrix.browser }}
```

### Multiple Dimensions

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    arch: [x64, arm64]
    
# Creates 8 jobs (2 x 2 x 2)
```

### Matrix in Job Name

```yaml
jobs:
  test:
    name: Test Node ${{ matrix.node }} on ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [18, 20]
        
    runs-on: ${{ matrix.os }}
```

### Accessing Matrix Context

```yaml
steps:
  - name: Show matrix values
    run: |
      echo "OS: ${{ matrix.os }}"
      echo "Node: ${{ matrix.node }}"
      echo "Full matrix: ${{ toJson(matrix) }}"
```

### Matrix with Environment

```yaml
jobs:
  test:
    strategy:
      matrix:
        env: [development, staging, production]
        
    runs-on: ubuntu-latest
    environment: ${{ matrix.env }}
    
    steps:
      - run: echo "Testing ${{ matrix.env }}"
```

### Conditional Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - name: Linux only
        if: matrix.os == 'ubuntu-latest'
        run: echo "Running on Linux"
        
      - name: Windows only
        if: matrix.os == 'windows-latest'
        run: echo "Running on Windows"
```

### Matrix Output

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        
    runs-on: ubuntu-latest
    outputs:
      result-${{ matrix.node }}: ${{ steps.test.outputs.result }}
      
    steps:
      - id: test
        run: echo "result=pass" >> $GITHUB_OUTPUT
```

### Complete Example

```yaml
name: Cross-Platform Tests

on: [push, pull_request]

jobs:
  test:
    name: Node ${{ matrix.node }} / ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Upload coverage
        if: matrix.os == 'ubuntu-latest' && matrix.node == '20'
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```

### Best Practices

```
✅ Use meaningful matrix values
✅ Name jobs clearly
✅ Limit matrix size
✅ Use conditionals wisely
✅ Consider resource usage
```

