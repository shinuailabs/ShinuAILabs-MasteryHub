# Lab 818: Workflow Syntax

## LEARNING CONCEPT

Understanding GitHub Actions workflow YAML syntax.

## EXERCISE

1. Learn workflow structure
2. Understand YAML syntax
3. Create valid workflows

## SOLUTION

### Basic Structure

```yaml
# Required: Workflow name
name: My Workflow

# Required: Trigger events
on: push

# Required: Jobs to run
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello"
```

### Name

```yaml
# Workflow name (displayed in Actions tab)
name: CI Pipeline

# Job name
jobs:
  build:
    name: Build Application
    runs-on: ubuntu-latest
```

### On (Triggers)

```yaml
# Single event
on: push

# Multiple events
on: [push, pull_request]

# Event with configuration
on:
  push:
    branches: [main, develop]
    paths:
      - 'src/**'
      - '!src/**/*.md'
  pull_request:
    branches: [main]
```

### Jobs

```yaml
jobs:
  # Job ID (must be unique)
  build:
    name: Build Job
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  test:
    name: Test Job
    runs-on: ubuntu-latest
    needs: build  # Depends on build job
    steps:
      - run: npm test
```

### Runs-on

```yaml
jobs:
  linux:
    runs-on: ubuntu-latest
    
  windows:
    runs-on: windows-latest
    
  macos:
    runs-on: macos-latest
    
  # Specific version
  specific:
    runs-on: ubuntu-22.04
    
  # Self-hosted
  custom:
    runs-on: [self-hosted, linux, x64]
```

### Steps

```yaml
steps:
  # Run shell command
  - run: echo "Hello"
  
  # Named step
  - name: Install dependencies
    run: npm ci
    
  # Multi-line command
  - name: Build
    run: |
      npm ci
      npm run build
      npm test
      
  # Use action
  - name: Checkout
    uses: actions/checkout@v4
    
  # Action with inputs
  - name: Setup Node
    uses: actions/setup-node@v4
    with:
      node-version: '20'
```

### Environment Variables

```yaml
# Workflow level
env:
  NODE_ENV: production

jobs:
  build:
    # Job level
    env:
      CI: true
      
    steps:
      - name: Build
        # Step level
        env:
          DEBUG: true
        run: npm run build
```

### Expressions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Conditional step
        if: github.event_name == 'push'
        run: echo "This is a push event"
        
      - name: Use expression
        run: echo "Branch is ${{ github.ref_name }}"
        
      - name: Check result
        if: ${{ success() }}
        run: echo "Previous step succeeded"
```

### Defaults

```yaml
defaults:
  run:
    shell: bash
    working-directory: ./app

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: pwd  # Runs in ./app directory
```

### Permissions

```yaml
permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  build:
    runs-on: ubuntu-latest
    # Job-level permissions
    permissions:
      contents: write
```

### Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
```

### Timeout

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - name: Long running task
        timeout-minutes: 10
        run: ./long-task.sh
```

### Complete Example

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Test
        run: npm test
```

### Best Practices

```
✅ Use meaningful names
✅ Pin action versions
✅ Set appropriate timeouts
✅ Use environment variables
✅ Add comments for clarity
✅ Validate YAML syntax
```

