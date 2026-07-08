# Lab 827: Job Configuration

## LEARNING CONCEPT

Configuring jobs in GitHub Actions workflows.

## EXERCISE

1. Configure job settings
2. Set up job dependencies
3. Use job outputs

## SOLUTION

### Basic Job Configuration

```yaml
jobs:
  build:
    name: Build Application
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

### Job with All Options

```yaml
jobs:
  build:
    # Display name
    name: Build and Test
    
    # Runner
    runs-on: ubuntu-latest
    
    # Timeout (default: 360 minutes)
    timeout-minutes: 30
    
    # Continue workflow if job fails
    continue-on-error: false
    
    # Job-level permissions
    permissions:
      contents: read
      packages: write
      
    # Job-level environment variables
    env:
      NODE_ENV: production
      
    # Job outputs
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    # Conditional execution
    if: github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
```

### Job Dependencies

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
    # Wait for lint and test to complete
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy:
    # Wait for build
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Conditional Job Execution

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-staging.sh
      
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-production.sh
```

### Job Outputs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      artifact-path: ${{ steps.build.outputs.path }}
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Get version
        id: version
        run: |
          VERSION=$(node -p "require('./package.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          
      - name: Build
        id: build
        run: |
          npm run build
          echo "path=dist/" >> $GITHUB_OUTPUT
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy version
        run: |
          echo "Deploying version ${{ needs.build.outputs.version }}"
          echo "From path ${{ needs.build.outputs.artifact-path }}"
```

### Job with Services

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
      redis:
        image: redis:7
        ports:
          - 6379:6379
          
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379
```

### Job in Container

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    container:
      image: node:20-alpine
      env:
        NODE_ENV: production
      options: --user root
      
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

### Job with Environment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.example.com
      
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Job Defaults

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    defaults:
      run:
        shell: bash
        working-directory: ./app
        
    steps:
      - uses: actions/checkout@v4
      - run: pwd  # Runs in ./app
      - run: npm ci
```

### Job Concurrency

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    
    concurrency:
      group: deploy-${{ github.ref }}
      cancel-in-progress: false
      
    steps:
      - run: ./deploy.sh
```

### Best Practices

```
✅ Use meaningful job names
✅ Set appropriate timeouts
✅ Define clear dependencies
✅ Use outputs for data passing
✅ Configure services properly
✅ Use environments for deployments
```

