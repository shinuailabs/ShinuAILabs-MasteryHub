# Lab 831: Defaults

## LEARNING CONCEPT

Setting default values for workflow runs.

## EXERCISE

1. Configure workflow defaults
2. Set job-level defaults
3. Override defaults when needed

## SOLUTION

### Workflow-Level Defaults

```yaml
name: Workflow with Defaults

on: push

defaults:
  run:
    shell: bash
    working-directory: ./app

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pwd  # Runs in ./app with bash
      - run: npm ci
      - run: npm run build
```

### Job-Level Defaults

```yaml
jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
        
    steps:
      - uses: actions/checkout@v4
      - run: npm ci  # Runs in ./frontend
      - run: npm run build
      
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
        
    steps:
      - uses: actions/checkout@v4
      - run: npm ci  # Runs in ./backend
      - run: npm run build
```

### Shell Defaults

```yaml
# Linux/macOS default shell
defaults:
  run:
    shell: bash

# Windows PowerShell
defaults:
  run:
    shell: pwsh

# Windows Command Prompt
defaults:
  run:
    shell: cmd
```

### Override Defaults

```yaml
defaults:
  run:
    shell: bash
    working-directory: ./app

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Uses defaults
      - run: npm ci
      
      # Override working directory
      - name: Build docs
        working-directory: ./docs
        run: npm run build
        
      # Override shell
      - name: Python script
        shell: python
        run: |
          import os
          print(os.getcwd())
```

### Monorepo Example

```yaml
name: Monorepo CI

on: push

jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/frontend
        
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
      
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/backend
        
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build
      
  shared:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/shared
        
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

### Cross-Platform Defaults

```yaml
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    
    defaults:
      run:
        # Use bash on all platforms
        shell: bash
        
    steps:
      - uses: actions/checkout@v4
      - run: echo "Running on $RUNNER_OS"
```

### Combining Workflow and Job Defaults

```yaml
# Workflow defaults
defaults:
  run:
    shell: bash

jobs:
  linux:
    runs-on: ubuntu-latest
    # Inherits workflow defaults
    steps:
      - run: echo "Using bash"
      
  windows:
    runs-on: windows-latest
    # Override for Windows
    defaults:
      run:
        shell: pwsh
    steps:
      - run: Write-Host "Using PowerShell"
```

### Default Environment

```yaml
# Note: env is not part of defaults, but can be set at workflow level
env:
  NODE_ENV: production
  CI: true

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "NODE_ENV is $NODE_ENV"
```

### Practical Example

```yaml
name: Full Stack CI

on: [push, pull_request]

defaults:
  run:
    shell: bash

jobs:
  api:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./api
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: api/package-lock.json
      - run: npm ci
      - run: npm test
      
  web:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json
      - run: npm ci
      - run: npm run build
```

### Best Practices

```
✅ Set sensible defaults at workflow level
✅ Override at job level when needed
✅ Use consistent shell across jobs
✅ Document non-obvious defaults
✅ Consider cross-platform compatibility
```

