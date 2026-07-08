# Lab 826: Workflow Structure

## LEARNING CONCEPT

Understanding the complete structure of GitHub Actions workflows.

## EXERCISE

1. Learn all workflow components
2. Understand component relationships
3. Create well-structured workflows

## SOLUTION

### Complete Workflow Structure

```yaml
# Workflow name (displayed in Actions tab)
name: Complete Workflow Example

# Trigger events
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

# Workflow-level environment variables
env:
  NODE_VERSION: '20'

# Default settings for all jobs
defaults:
  run:
    shell: bash
    working-directory: ./app

# Workflow-level permissions
permissions:
  contents: read
  issues: write

# Concurrency settings
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Jobs definition
jobs:
  build:
    name: Build Job
    runs-on: ubuntu-latest
    # ... job configuration
```

### Jobs Section

```yaml
jobs:
  # Job ID (unique identifier)
  build:
    # Display name
    name: Build Application
    
    # Runner selection
    runs-on: ubuntu-latest
    
    # Job-level permissions
    permissions:
      contents: read
      
    # Job-level environment
    env:
      CI: true
      
    # Job timeout
    timeout-minutes: 30
    
    # Job outputs
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    # Steps to execute
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
```

### Steps Section

```yaml
steps:
  # Action step
  - name: Checkout code
    uses: actions/checkout@v4
    with:
      fetch-depth: 0
      
  # Command step
  - name: Install dependencies
    run: npm ci
    
  # Multi-line command
  - name: Build and test
    run: |
      npm run build
      npm test
      
  # Step with ID for outputs
  - name: Get version
    id: version
    run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT
    
  # Conditional step
  - name: Deploy
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh
    
  # Step with environment
  - name: Run with env
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./script.sh
```

### Job Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  # Depends on both build and test
  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Job Outputs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact-name: ${{ steps.build.outputs.name }}
      
    steps:
      - id: build
        run: echo "name=my-artifact" >> $GITHUB_OUTPUT
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.artifact-name }}"
```

### Matrix Strategy

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Services

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          
    steps:
      - run: npm test
```

### Container Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20
      env:
        NODE_ENV: production
      volumes:
        - /data:/data
        
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
```

### Environment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
      
    steps:
      - run: ./deploy.sh
```

### Workflow Diagram

```
Workflow
├── name
├── on (triggers)
├── env (global)
├── permissions
├── concurrency
├── defaults
└── jobs
    ├── job1
    │   ├── runs-on
    │   ├── needs
    │   ├── env
    │   ├── outputs
    │   └── steps
    │       ├── step1 (uses/run)
    │       └── step2 (uses/run)
    └── job2
        └── ...
```

### Best Practices

```
✅ Use meaningful names
✅ Group related steps
✅ Set appropriate timeouts
✅ Define clear dependencies
✅ Use outputs for communication
✅ Keep jobs focused
```

