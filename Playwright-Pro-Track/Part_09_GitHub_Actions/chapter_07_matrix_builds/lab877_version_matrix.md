# Lab 877: Version Matrix

## LEARNING CONCEPT

Testing across multiple language/framework versions.

## EXERCISE

1. Create version matrix
2. Handle version-specific behavior
3. Support multiple runtimes

## SOLUTION

### Node.js Versions

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
          
      - run: npm ci
      - run: npm test
```

### Python Versions

```yaml
jobs:
  test:
    strategy:
      matrix:
        python: ['3.9', '3.10', '3.11', '3.12']
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python }}
          
      - run: pip install -r requirements.txt
      - run: pytest
```

### Java Versions

```yaml
jobs:
  test:
    strategy:
      matrix:
        java: [11, 17, 21]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: ${{ matrix.java }}
          
      - run: ./gradlew test
```

### Go Versions

```yaml
jobs:
  test:
    strategy:
      matrix:
        go: ['1.21', '1.22', '1.23']
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-go@v5
        with:
          go-version: ${{ matrix.go }}
          
      - run: go test ./...
```

### Ruby Versions

```yaml
jobs:
  test:
    strategy:
      matrix:
        ruby: ['3.1', '3.2', '3.3']
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: ${{ matrix.ruby }}
          bundler-cache: true
          
      - run: bundle exec rspec
```

### .NET Versions

```yaml
jobs:
  test:
    strategy:
      matrix:
        dotnet: ['6.0', '7.0', '8.0']
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ matrix.dotnet }}
          
      - run: dotnet test
```

### Multiple Runtimes

```yaml
jobs:
  test:
    strategy:
      matrix:
        include:
          - runtime: node
            version: '20'
          - runtime: python
            version: '3.11'
          - runtime: ruby
            version: '3.2'
            
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        if: matrix.runtime == 'node'
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.version }}
          
      - name: Setup Python
        if: matrix.runtime == 'python'
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.version }}
          
      - name: Setup Ruby
        if: matrix.runtime == 'ruby'
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: ${{ matrix.version }}
```

### Version from File

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        include:
          - node: file
            use-nvmrc: true
            
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.use-nvmrc && '' || matrix.node }}
          node-version-file: ${{ matrix.use-nvmrc && '.nvmrc' || '' }}
```

### LTS and Current

```yaml
jobs:
  test:
    strategy:
      matrix:
        node:
          - 'lts/*'      # Latest LTS
          - 'lts/-1'     # Previous LTS
          - 'current'    # Latest current
          
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Version-Specific Tests

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
          
      - run: npm ci
      - run: npm test
      
      - name: Node 22 specific tests
        if: matrix.node == 22
        run: npm run test:experimental
```

### Complete Example

```yaml
name: Multi-Version CI

on: [push, pull_request]

jobs:
  test:
    name: Node ${{ matrix.node }}
    
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
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
      
      - name: Coverage (LTS only)
        if: matrix.node == 20
        run: npm run coverage
```

### Best Practices

```
✅ Test supported versions
✅ Include LTS versions
✅ Mark experimental versions
✅ Use version files
✅ Document version requirements
```

