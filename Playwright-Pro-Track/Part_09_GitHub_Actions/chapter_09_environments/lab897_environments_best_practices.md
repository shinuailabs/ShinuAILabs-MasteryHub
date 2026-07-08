# Lab 897: Environments Best Practices

## LEARNING CONCEPT

Best practices for GitHub Actions environments.

## EXERCISE

1. Review environment patterns
2. Implement security best practices
3. Apply deployment strategies

## SOLUTION

### Environment Strategy

```
Recommended environments:
1. development - For feature branches
2. staging - For integration testing
3. production - For live deployment

Optional:
- preview - For PR previews
- canary - For gradual rollout
```

### Environment Configuration

```
Production:
□ Required reviewers (2+)
□ Wait timer (optional)
□ Branch restrictions (main only)
□ Environment secrets
□ Environment variables

Staging:
□ Branch restrictions (main, develop)
□ Environment secrets
□ Environment variables

Development:
□ No restrictions
□ All branches allowed
```

### Secrets Management

```yaml
# Use environment secrets for sensitive data
jobs:
  deploy:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          # Environment-specific
          API_KEY: ${{ secrets.API_KEY }}
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

### Variables Management

```yaml
# Use variables for configuration
jobs:
  deploy:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          # Non-sensitive config
          API_URL: ${{ vars.API_URL }}
          LOG_LEVEL: ${{ vars.LOG_LEVEL }}
```

### Deployment Pipeline

```yaml
name: Deploy Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
  staging:
    needs: test
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.myapp.com
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh staging
      
  production:
    needs: staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production
```

### PR Previews

```yaml
name: Preview

on:
  pull_request:

jobs:
  preview:
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
```

### Cleanup Previews

```yaml
name: Cleanup Preview

on:
  pull_request:
    types: [closed]

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - run: ./cleanup-preview.sh ${{ github.event.number }}
```

### Health Checks

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - run: ./deploy.sh
      
      - name: Health check
        run: |
          for i in {1..10}; do
            if curl -sf https://myapp.com/health; then
              echo "Healthy"
              exit 0
            fi
            sleep 10
          done
          exit 1
```

### Rollback Strategy

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - name: Get current version
        id: current
        run: echo "version=$(curl -s https://myapp.com/version)" >> $GITHUB_OUTPUT
        
      - run: ./deploy.sh
      
      - name: Health check
        id: health
        run: curl -sf https://myapp.com/health
        continue-on-error: true
        
      - name: Rollback
        if: steps.health.outcome == 'failure'
        run: ./rollback.sh ${{ steps.current.outputs.version }}
```

### Deployment Summary

```yaml
- name: Summary
  run: |
    echo "## Deployment Summary" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "| Property | Value |" >> $GITHUB_STEP_SUMMARY
    echo "|----------|-------|" >> $GITHUB_STEP_SUMMARY
    echo "| Environment | ${{ github.environment }} |" >> $GITHUB_STEP_SUMMARY
    echo "| Commit | ${{ github.sha }} |" >> $GITHUB_STEP_SUMMARY
    echo "| URL | ${{ vars.DEPLOY_URL }} |" >> $GITHUB_STEP_SUMMARY
    echo "| Time | $(date) |" >> $GITHUB_STEP_SUMMARY
```

### Checklist

```
Environment Setup:
□ Create all environments
□ Configure protection rules
□ Set up secrets
□ Set up variables
□ Document configuration

Deployment:
□ Implement health checks
□ Plan rollback strategy
□ Use concurrency control
□ Track deployment history
□ Monitor deployments

Security:
□ Require reviewers for production
□ Restrict deployment branches
□ Rotate secrets regularly
□ Audit deployments
```

### Anti-Patterns

```yaml
# ❌ No environment for production
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh production

# ✅ Use environment
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh production
```

### Complete Template

```yaml
name: Production Deploy

on:
  push:
    branches: [main]

concurrency:
  group: production-deploy
  cancel-in-progress: false

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      
  staging:
    needs: test
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: ${{ vars.DEPLOY_URL }}
      
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          
  production:
    needs: staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ vars.DEPLOY_URL }}
      
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          
      - name: Health check
        run: curl -sf ${{ vars.DEPLOY_URL }}/health
```

### Best Practices Summary

```
✅ Use environments for deployments
✅ Configure protection rules
✅ Use environment secrets/variables
✅ Implement health checks
✅ Plan rollback strategy
✅ Control concurrency
✅ Track deployment history
✅ Document everything
```

