# Lab 896: Concurrent Deployments

## LEARNING CONCEPT

Managing concurrent deployments to environments.

## EXERCISE

1. Control deployment concurrency
2. Handle deployment queues
3. Implement deployment locks

## SOLUTION

### Concurrency Control

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    concurrency: production-deploy
    
    steps:
      - run: ./deploy.sh
```

### Cancel In-Progress

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: production-deploy
      cancel-in-progress: true
      
    steps:
      - run: ./deploy.sh
```

### Queue Deployments

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: production-deploy
      cancel-in-progress: false  # Queue instead of cancel
      
    steps:
      - run: ./deploy.sh
```

### Per-Environment Concurrency

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ matrix.env }}
    concurrency:
      group: deploy-${{ matrix.env }}
      cancel-in-progress: false
      
    strategy:
      matrix:
        env: [staging, production]
        
    steps:
      - run: ./deploy.sh ${{ matrix.env }}
```

### Branch-Based Concurrency

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: preview
    concurrency:
      group: preview-${{ github.ref }}
      cancel-in-progress: true
      
    steps:
      - run: ./deploy-preview.sh
```

### PR Preview Concurrency

```yaml
name: Preview

on:
  pull_request:

concurrency:
  group: preview-${{ github.event.number }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: preview
      url: https://pr-${{ github.event.number }}.preview.myapp.com
      
    steps:
      - run: ./deploy-preview.sh ${{ github.event.number }}
```

### Deployment Lock

```yaml
jobs:
  acquire-lock:
    runs-on: ubuntu-latest
    outputs:
      lock-id: ${{ steps.lock.outputs.id }}
      
    steps:
      - id: lock
        name: Acquire lock
        run: |
          LOCK_ID=$(curl -X POST "$LOCK_API/acquire" \
            -H "Authorization: Bearer $TOKEN" \
            -d '{"resource": "production"}')
          echo "id=$LOCK_ID" >> $GITHUB_OUTPUT
        env:
          LOCK_API: ${{ vars.LOCK_API }}
          TOKEN: ${{ secrets.LOCK_TOKEN }}
          
  deploy:
    needs: acquire-lock
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
      
  release-lock:
    needs: [acquire-lock, deploy]
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - name: Release lock
        run: |
          curl -X DELETE "$LOCK_API/release/${{ needs.acquire-lock.outputs.lock-id }}"
        env:
          LOCK_API: ${{ vars.LOCK_API }}
```

### Workflow-Level Concurrency

```yaml
name: Deploy

on:
  push:
    branches: [main]

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh
```

### Multiple Environments

```yaml
name: Deploy All

on:
  push:
    branches: [main]

jobs:
  staging:
    runs-on: ubuntu-latest
    environment: staging
    concurrency: staging-deploy
    
    steps:
      - run: ./deploy.sh staging
      
  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production
    concurrency: production-deploy
    
    steps:
      - run: ./deploy.sh production
```

### Complete Example

```yaml
name: Controlled Deployment

on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    environment:
      name: preview
      url: https://pr-${{ github.event.number }}.preview.myapp.com
    concurrency:
      group: preview-${{ github.event.number }}
      cancel-in-progress: true
      
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy-preview.sh ${{ github.event.number }}
      
  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: production-deploy
      cancel-in-progress: false
      
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production
```

### Best Practices

```
✅ Use concurrency groups
✅ Cancel PRs, queue production
✅ Use environment-specific groups
✅ Implement deployment locks
✅ Handle lock failures
```

