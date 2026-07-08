# Lab 852: Jobs & Steps Best Practices

## LEARNING CONCEPT

Best practices for organizing jobs and steps.

## EXERCISE

1. Structure jobs effectively
2. Optimize step execution
3. Apply best practices

## SOLUTION

### Job Organization

```yaml
jobs:
  # 1. Fast feedback first
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
      
  # 2. Unit tests (fast)
  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:unit
      
  # 3. Integration tests (slower)
  test-integration:
    needs: test-unit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:integration
      
  # 4. Build after validation
  build:
    needs: [lint, test-unit]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
  # 5. Deploy last
  deploy:
    needs: [build, test-integration]
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
      cache: 'npm'
      
  # 2. Install
  - name: Install dependencies
    run: npm ci
    
  # 3. Validate
  - name: Lint
    run: npm run lint
    
  # 4. Test
  - name: Test
    run: npm test
    
  # 5. Build
  - name: Build
    run: npm run build
    
  # 6. Cleanup (always)
  - name: Cleanup
    if: always()
    run: ./cleanup.sh
```

### Naming Conventions

```yaml
jobs:
  # Use descriptive job IDs
  build-frontend:
    name: Build Frontend Application
    
  deploy-staging:
    name: Deploy to Staging Environment
    
steps:
  # Use action verbs
  - name: Install dependencies
  - name: Run unit tests
  - name: Build application
  - name: Deploy to server
```

### Parallel vs Sequential

```yaml
jobs:
  # Parallel: Independent tasks
  lint:
    runs-on: ubuntu-latest
    steps: [...]
    
  test:
    runs-on: ubuntu-latest
    steps: [...]
    
  security-scan:
    runs-on: ubuntu-latest
    steps: [...]
    
  # Sequential: Dependent tasks
  build:
    needs: [lint, test, security-scan]
    runs-on: ubuntu-latest
    steps: [...]
```

### Output Management

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      artifact: ${{ steps.build.outputs.artifact }}
      
    steps:
      - id: version
        run: echo "version=$(cat VERSION)" >> $GITHUB_OUTPUT
        
      - id: build
        run: |
          npm run build
          echo "artifact=dist-${{ steps.version.outputs.version }}" >> $GITHUB_OUTPUT
```

### Error Handling Pattern

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Critical operation
        id: critical
        continue-on-error: true
        run: ./critical.sh
        
      - name: Handle failure
        if: steps.critical.outcome == 'failure'
        run: ./handle-failure.sh
        
      - name: Cleanup
        if: always()
        run: ./cleanup.sh
```

### Caching Strategy

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  - uses: actions/cache@v4
    with:
      path: |
        ~/.npm
        node_modules
        .next/cache
      key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}
```

### Artifact Management

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ github.sha }}
          path: dist/
          retention-days: 7
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ github.sha }}
```

### Timeout Configuration

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - name: Install
        timeout-minutes: 10
        run: npm ci
        
      - name: Test
        timeout-minutes: 15
        run: npm test
```

### Checklist

```
Job Design:
□ Fast feedback first
□ Parallel when possible
□ Clear dependencies
□ Appropriate timeouts
□ Meaningful names

Step Design:
□ Logical order
□ Named steps
□ Error handling
□ Cleanup steps
□ Caching configured

Data Flow:
□ Outputs defined
□ Artifacts uploaded
□ Secrets secured
□ Environment variables set
```

### Anti-Patterns

```yaml
# ❌ Too many steps in one job
jobs:
  everything:
    steps:
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - run: ./deploy.sh
      - run: ./notify.sh

# ✅ Split into focused jobs
jobs:
  validate:
    steps: [lint, test]
  build:
    needs: validate
    steps: [build]
  deploy:
    needs: build
    steps: [deploy, notify]
```

### Complete Template

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      
  test:
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
      
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    timeout-minutes: 15
    outputs:
      version: ${{ steps.version.outputs.version }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - id: version
        run: echo "version=$(cat VERSION)" >> $GITHUB_OUTPUT
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

### Best Practices Summary

```
✅ Organize jobs logically
✅ Use meaningful names
✅ Set appropriate timeouts
✅ Handle errors gracefully
✅ Use caching effectively
✅ Manage artifacts properly
✅ Document complex workflows
```

