# Lab 844: Job Dependencies

## LEARNING CONCEPT

Managing job dependencies and execution order.

## EXERCISE

1. Define job dependencies
2. Create job chains
3. Handle parallel and sequential execution

## SOLUTION

### Basic Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Multiple Dependencies

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  build:
    needs: [lint, test]  # Wait for both
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

### Dependency Chain

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-staging.sh
      
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-production.sh
```

### Parallel Jobs

```yaml
jobs:
  # These run in parallel
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      
  test-unit:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit
      
  test-integration:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:integration
      
  # This waits for all above
  build:
    needs: [lint, test-unit, test-integration]
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

### Diamond Pattern

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Setup"
      
  build-frontend:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: echo "Build frontend"
      
  build-backend:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: echo "Build backend"
      
  deploy:
    needs: [build-frontend, build-backend]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy"
```

### Conditional Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Always Run After Dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  notify:
    needs: [build, test]
    if: always()  # Run even if dependencies fail
    runs-on: ubuntu-latest
    steps:
      - run: ./notify.sh
```

### Check Dependency Status

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy:
    needs: build
    if: needs.build.result == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
      
  rollback:
    needs: build
    if: needs.build.result == 'failure'
    runs-on: ubuntu-latest
    steps:
      - run: ./rollback.sh
```

### Complex Dependency Logic

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
      
  deploy:
    needs: [build, test]
    # Only if both succeeded
    if: |
      needs.build.result == 'success' &&
      needs.test.result == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Passing Data Between Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
    steps:
      - id: version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.version }}"
```

### Best Practices

```
✅ Keep dependency chains short
✅ Parallelize independent jobs
✅ Use outputs for data passing
✅ Handle failures gracefully
✅ Document job relationships
```

