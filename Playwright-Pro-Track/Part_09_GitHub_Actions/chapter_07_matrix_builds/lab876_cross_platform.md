# Lab 876: Cross-Platform Testing

## LEARNING CONCEPT

Testing across multiple operating systems.

## EXERCISE

1. Configure cross-platform matrix
2. Handle platform differences
3. Optimize platform-specific steps

## SOLUTION

### Basic Cross-Platform

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### Platform-Specific Shell

```yaml
jobs:
  test:
    strategy:
      matrix:
        include:
          - os: ubuntu-latest
            shell: bash
          - os: windows-latest
            shell: pwsh
          - os: macos-latest
            shell: bash
            
    runs-on: ${{ matrix.os }}
    
    defaults:
      run:
        shell: ${{ matrix.shell }}
        
    steps:
      - run: echo "Running on ${{ matrix.os }}"
```

### Platform-Specific Commands

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install (Linux)
        if: runner.os == 'Linux'
        run: sudo apt-get install -y libgtk-3-dev
        
      - name: Install (macOS)
        if: runner.os == 'macOS'
        run: brew install gtk+3
        
      - name: Install (Windows)
        if: runner.os == 'Windows'
        run: choco install gtk-runtime
```

### Cross-Platform Node.js

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
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
```

### Cross-Platform Python

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python: ['3.10', '3.11', '3.12']
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python }}
          
      - run: pip install -r requirements.txt
      - run: pytest
```

### Path Handling

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set paths
        id: paths
        shell: bash
        run: |
          if [ "$RUNNER_OS" == "Windows" ]; then
            echo "bin=Scripts" >> $GITHUB_OUTPUT
            echo "sep=\\" >> $GITHUB_OUTPUT
          else
            echo "bin=bin" >> $GITHUB_OUTPUT
            echo "sep=/" >> $GITHUB_OUTPUT
          fi
```

### Binary Artifacts

```yaml
jobs:
  build:
    strategy:
      matrix:
        include:
          - os: ubuntu-latest
            artifact: linux-x64
          - os: windows-latest
            artifact: windows-x64
          - os: macos-latest
            artifact: macos-x64
            
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.artifact }}
          path: dist/
```

### Environment Variables

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    env:
      # Cross-platform env vars
      CI: true
      
    steps:
      - name: Set platform env
        shell: bash
        run: |
          if [ "$RUNNER_OS" == "Windows" ]; then
            echo "PLATFORM=win32" >> $GITHUB_ENV
          else
            echo "PLATFORM=linux" >> $GITHUB_ENV
          fi
```

### Docker on Different Platforms

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t myapp .
        
      - name: Run tests
        run: docker run myapp npm test
```

### Complete Example

```yaml
name: Cross-Platform CI

on: [push, pull_request]

jobs:
  test:
    name: ${{ matrix.os }} / Node ${{ matrix.node }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
        exclude:
          - os: macos-latest
            node: 18
            
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-${{ matrix.os }}-node${{ matrix.node }}
          path: dist/
```

### Best Practices

```
✅ Test on all target platforms
✅ Handle path differences
✅ Use cross-platform commands
✅ Document platform requirements
✅ Use appropriate shells
```

