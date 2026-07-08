# Lab 889: Environment Basics

## LEARNING CONCEPT

Understanding GitHub Actions environments.

## EXERCISE

1. Create environments
2. Use environments in workflows
3. Configure environment settings

## SOLUTION

### What are Environments?

```
Environments provide:
- Deployment targets (dev, staging, production)
- Environment-specific secrets
- Protection rules
- Deployment history
- Environment URLs
```

### Creating Environments

```
1. Go to repository Settings
2. Click "Environments"
3. Click "New environment"
4. Enter name (e.g., "production")
5. Configure settings
```

### Using Environments

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
```

### Environment with URL

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
      
    steps:
      - run: ./deploy.sh
```

### Dynamic Environment URL

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: preview
      url: ${{ steps.deploy.outputs.url }}
      
    steps:
      - id: deploy
        run: |
          URL=$(./deploy.sh)
          echo "url=$URL" >> $GITHUB_OUTPUT
```

### Multiple Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: ./deploy.sh staging
      
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh production
```

### Environment Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
        env:
          # Environment-specific secret
          API_KEY: ${{ secrets.API_KEY }}
          # Repository secret (fallback)
          SHARED_SECRET: ${{ secrets.SHARED_SECRET }}
```

### Environment Variables

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: |
          echo "Deploying to ${{ vars.DEPLOY_URL }}"
          ./deploy.sh
```

### Conditional Environment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - run: ./deploy.sh
```

### Environment from Matrix

```yaml
jobs:
  deploy:
    strategy:
      matrix:
        env: [staging, production]
        
    runs-on: ubuntu-latest
    environment: ${{ matrix.env }}
    
    steps:
      - run: ./deploy.sh ${{ matrix.env }}
```

### Check Environment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Show environment
        run: |
          echo "Environment: ${{ github.environment }}"
          echo "Ref: ${{ github.ref }}"
```

### Complete Example

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    
    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      url: ${{ steps.deploy.outputs.url }}
      
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
          
      - id: deploy
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            URL="https://myapp.com"
          else
            URL="https://staging.myapp.com"
          fi
          echo "url=$URL" >> $GITHUB_OUTPUT
          ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Best Practices

```
✅ Use descriptive names
✅ Configure protection rules
✅ Set environment URLs
✅ Use environment secrets
✅ Track deployment history
```

