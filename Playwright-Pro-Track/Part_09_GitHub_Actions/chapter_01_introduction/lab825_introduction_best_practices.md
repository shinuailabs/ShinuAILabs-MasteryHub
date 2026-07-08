# Lab 825: Introduction Best Practices

## LEARNING CONCEPT

Best practices for getting started with GitHub Actions.

## EXERCISE

1. Review foundational best practices
2. Set up workflows correctly
3. Avoid common mistakes

## SOLUTION

### Workflow Organization

```
.github/
└── workflows/
    ├── ci.yml           # Continuous Integration
    ├── cd.yml           # Continuous Deployment
    ├── release.yml      # Release automation
    ├── codeql.yml       # Security scanning
    └── dependabot.yml   # Dependency updates
```

### Naming Conventions

```yaml
# Workflow name - descriptive
name: CI - Build and Test

# Job names - action-oriented
jobs:
  build-application:
    name: Build Application
    
  run-unit-tests:
    name: Run Unit Tests
    
  deploy-staging:
    name: Deploy to Staging
```

### Pin Action Versions

```yaml
# ✅ Good: Pin to specific version
- uses: actions/checkout@v4
- uses: actions/setup-node@v4

# ✅ Better: Pin to commit SHA
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11

# ❌ Bad: Use latest (unpredictable)
- uses: actions/checkout@latest
- uses: actions/checkout@main
```

### Use Caching

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'  # Built-in caching
      
  # Or explicit caching
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Minimize Workflow Duration

```yaml
# Use parallel jobs
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  # Both run in parallel, then build
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
```

### Use Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Set Timeouts

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - name: Long task
        timeout-minutes: 5
        run: ./long-running-script.sh
```

### Secure Secrets

```yaml
# ✅ Good: Use secrets
env:
  API_KEY: ${{ secrets.API_KEY }}

# ❌ Bad: Hardcoded values
env:
  API_KEY: "abc123"
```

### Limit Permissions

```yaml
permissions:
  contents: read
  
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
```

### Use Environment Protection

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
```

### Reusable Workflows

```yaml
# .github/workflows/reusable-build.yml
name: Reusable Build

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci && npm run build
```

### Error Handling

```yaml
steps:
  - name: Critical step
    run: npm test
    
  - name: Cleanup on failure
    if: failure()
    run: ./cleanup.sh
    
  - name: Always run
    if: always()
    run: echo "Workflow complete"
```

### Documentation

```yaml
# .github/workflows/ci.yml
#
# This workflow runs on every push and PR to main.
# It performs:
# - Linting
# - Unit tests
# - Build verification
#
# Required secrets:
# - None
#
# Required permissions:
# - contents: read

name: CI
```

### Common Mistakes to Avoid

```
❌ Not pinning action versions
❌ Hardcoding secrets
❌ No timeout limits
❌ Running everything sequentially
❌ Not using caching
❌ Overly broad permissions
❌ No error handling
❌ Missing documentation
```

### Starter Template

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### Best Practices Summary

```
✅ Pin action versions
✅ Use caching
✅ Set timeouts
✅ Limit permissions
✅ Use concurrency
✅ Secure secrets
✅ Document workflows
✅ Handle errors
```

