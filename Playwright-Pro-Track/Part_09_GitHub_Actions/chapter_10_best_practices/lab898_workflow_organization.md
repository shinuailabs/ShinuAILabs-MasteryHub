# Lab 898: Workflow Organization

## LEARNING CONCEPT

Organizing workflows for maintainability.

## EXERCISE

1. Structure workflow files
2. Use naming conventions
3. Implement modular workflows

## SOLUTION

### File Naming Conventions

```
.github/workflows/
├── ci.yml              # Continuous Integration
├── cd.yml              # Continuous Deployment
├── release.yml         # Release automation
├── pr-checks.yml       # Pull request checks
├── scheduled.yml       # Scheduled tasks
├── manual.yml          # Manual triggers
└── reusable/
    ├── build.yml       # Reusable build
    └── deploy.yml      # Reusable deploy
```

### Workflow Naming

```yaml
# Use descriptive names
name: CI - Build and Test
name: CD - Deploy to Production
name: Release - Create GitHub Release
name: PR - Code Quality Checks
```

### Job Naming

```yaml
jobs:
  lint:
    name: Lint Code
    
  test:
    name: Run Tests
    
  build:
    name: Build Application
    
  deploy:
    name: Deploy to ${{ matrix.env }}
```

### Step Naming

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    
  - name: Install dependencies
    run: npm ci
    
  - name: Run tests
    run: npm test
```

### Workflow Structure

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Environment variables
env:
  NODE_VERSION: '20'

# Concurrency control
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Job definitions
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
```

### Modular Workflows

```yaml
# .github/workflows/reusable/build.yml
name: Reusable Build

on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'
    outputs:
      artifact-name:
        value: ${{ jobs.build.outputs.artifact }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact: build-${{ github.sha }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ github.sha }}
          path: dist/
```

### Using Reusable Workflows

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    uses: ./.github/workflows/reusable/build.yml
    with:
      node-version: '20'
      
  deploy:
    needs: build
    uses: ./.github/workflows/reusable/deploy.yml
    with:
      artifact-name: ${{ needs.build.outputs.artifact-name }}
    secrets: inherit
```

### Composite Actions

```yaml
# .github/actions/setup/action.yml
name: Setup Environment
description: Setup Node.js and install dependencies

inputs:
  node-version:
    description: Node.js version
    default: '20'

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
        
    - run: npm ci
      shell: bash
```

### Using Composite Actions

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm test
```

### Workflow Documentation

```yaml
# .github/workflows/ci.yml
#
# Continuous Integration Workflow
#
# This workflow runs on every push and pull request to main.
# It performs the following checks:
# - Linting
# - Unit tests
# - Build verification
#
# Required secrets:
# - None
#
# Required variables:
# - None

name: CI
```

### Complete Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm run lint
      
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm test
      
  build:
    name: Build
    needs: [lint, test]
    uses: ./.github/workflows/reusable/build.yml
    
  deploy:
    name: Deploy
    needs: build
    if: github.ref == 'refs/heads/main'
    uses: ./.github/workflows/reusable/deploy.yml
    secrets: inherit
```

### Best Practices

```
✅ Use descriptive names
✅ Document workflows
✅ Create reusable components
✅ Organize by purpose
✅ Keep workflows focused
```

