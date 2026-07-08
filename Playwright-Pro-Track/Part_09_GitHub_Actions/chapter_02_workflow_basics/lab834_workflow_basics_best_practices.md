# Lab 834: Workflow Basics Best Practices

## LEARNING CONCEPT

Best practices for GitHub Actions workflow basics.

## EXERCISE

1. Review workflow structure best practices
2. Apply configuration best practices
3. Create maintainable workflows

## SOLUTION

### Workflow Template

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

env:
  NODE_VERSION: '20'

defaults:
  run:
    shell: bash

jobs:
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### Job Organization

```yaml
jobs:
  # Fast feedback first
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
      
  # Then tests
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
  # Build after validation
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
  # Deploy last
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Step Organization

```yaml
steps:
  # 1. Setup
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      
  # 2. Install
  - name: Install dependencies
    run: npm ci
    
  # 3. Validate
  - name: Lint
    run: npm run lint
    
  # 4. Test
  - name: Run tests
    run: npm test
    
  # 5. Build
  - name: Build
    run: npm run build
    
  # 6. Cleanup (always)
  - name: Cleanup
    if: always()
    run: ./cleanup.sh
```

### Error Handling

```yaml
steps:
  - name: Critical step
    run: npm test
    
  - name: On failure
    if: failure()
    run: |
      echo "Tests failed!"
      ./notify-team.sh
      
  - name: Always cleanup
    if: always()
    run: ./cleanup.sh
```

### Output Management

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    steps:
      - id: version
        run: echo "version=$(cat VERSION)" >> $GITHUB_OUTPUT
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.version }}"
```

### Environment Variables

```yaml
# Workflow level for shared values
env:
  NODE_VERSION: '20'
  CI: true

jobs:
  build:
    runs-on: ubuntu-latest
    # Job level for job-specific
    env:
      BUILD_ENV: production
      
    steps:
      - name: Build
        # Step level for step-specific
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: npm run build
```

### Timeout Configuration

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Job timeout
    
    steps:
      - name: Quick step
        timeout-minutes: 5
        run: npm ci
        
      - name: Long step
        timeout-minutes: 20
        run: npm run e2e-tests
```

### Caching Strategy

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  # Or explicit caching
  - uses: actions/cache@v4
    with:
      path: |
        ~/.npm
        node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

### Documentation

```yaml
# .github/workflows/ci.yml
#
# Continuous Integration workflow
#
# Triggers:
# - Push to main branch
# - Pull requests to main
#
# Jobs:
# 1. lint - Code linting
# 2. test - Unit and integration tests
# 3. build - Build application
# 4. deploy - Deploy to production (main only)
#
# Required secrets:
# - DEPLOY_TOKEN
#
# Required variables:
# - None

name: CI
```

### Checklist

```
Workflow Structure:
□ Meaningful name
□ Appropriate triggers
□ Minimal permissions
□ Concurrency configured
□ Timeouts set

Jobs:
□ Clear dependencies
□ Appropriate runners
□ Outputs defined
□ Error handling

Steps:
□ Named steps
□ Logical order
□ Proper conditionals
□ Cleanup steps
```

### Anti-Patterns to Avoid

```yaml
# ❌ No timeout
jobs:
  build:
    runs-on: ubuntu-latest
    # Missing timeout-minutes

# ❌ Overly permissive
permissions: write-all

# ❌ No concurrency control
# Missing concurrency block

# ❌ Hardcoded values
steps:
  - run: npm install node@18.0.0

# ❌ No error handling
steps:
  - run: ./critical-script.sh
  # No failure handling
```

### Best Practices Summary

```
✅ Set explicit permissions
✅ Configure concurrency
✅ Set appropriate timeouts
✅ Use caching
✅ Handle errors
✅ Document workflows
✅ Use meaningful names
✅ Keep jobs focused
```

