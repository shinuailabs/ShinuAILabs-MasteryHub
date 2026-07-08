# Lab 863: Environment Secrets

## LEARNING CONCEPT

Using environment-specific secrets in GitHub Actions.

## EXERCISE

1. Create environment secrets
2. Use environments in workflows
3. Configure environment protection

## SOLUTION

### Creating Environments

```
Via GitHub UI:
1. Go to repository Settings
2. Click "Environments"
3. Click "New environment"
4. Enter environment name (e.g., "production")
5. Configure protection rules
6. Add environment secrets
```

### Environment Secrets

```
Each environment can have its own secrets:
- production: PROD_API_KEY, PROD_DATABASE_URL
- staging: STAGING_API_KEY, STAGING_DATABASE_URL
- development: DEV_API_KEY, DEV_DATABASE_URL
```

### Using Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - run: ./deploy.sh
        env:
          # Uses staging environment secrets
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    needs: deploy-staging
    
    steps:
      - run: ./deploy.sh
        env:
          # Uses production environment secrets
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Environment with URL

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

### Dynamic Environment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### Environment Protection Rules

```
Protection options:
1. Required reviewers - Require approval before deployment
2. Wait timer - Delay deployment by specified minutes
3. Deployment branches - Limit which branches can deploy
4. Custom rules - Use deployment protection rules
```

### Required Reviewers

```yaml
# Workflow pauses for approval
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Has required reviewers
    
    steps:
      - run: ./deploy.sh
```

### Wait Timer

```yaml
# Deployment delayed by configured time
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Has 30-minute wait timer
    
    steps:
      - run: ./deploy.sh
```

### Branch Protection

```
Environment branch rules:
- All branches
- Protected branches only
- Selected branches (e.g., main, release/*)
```

### Multiple Environments

```yaml
name: Deploy Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  deploy-dev:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: development
    steps:
      - run: ./deploy.sh dev
        env:
          API_KEY: ${{ secrets.API_KEY }}
          
  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: ./deploy.sh staging
        env:
          API_KEY: ${{ secrets.API_KEY }}
          
  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh production
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### Environment Variables

```yaml
# Environments can also have variables (non-secret)
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
        env:
          # Secret
          API_KEY: ${{ secrets.API_KEY }}
          # Variable (from environment)
          API_URL: ${{ vars.API_URL }}
```

### Deployment Status

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ steps.deploy.outputs.url }}
      
    steps:
      - id: deploy
        run: |
          ./deploy.sh
          echo "url=https://app.example.com" >> $GITHUB_OUTPUT
```

### Complete Example

```yaml
name: Production Deployment

on:
  push:
    branches: [main]

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
      name: production
      url: https://example.com
      
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
          
      - name: Deploy
        run: ./deploy.sh
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Best Practices

```
✅ Use environments for different stages
✅ Configure protection rules
✅ Require approvals for production
✅ Use environment-specific secrets
✅ Set deployment URLs
```

