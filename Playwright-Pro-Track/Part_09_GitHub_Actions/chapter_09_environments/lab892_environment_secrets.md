# Lab 892: Environment Secrets

## LEARNING CONCEPT

Managing environment-specific secrets.

## EXERCISE

1. Create environment secrets
2. Use secrets in workflows
3. Manage secret precedence

## SOLUTION

### Creating Environment Secrets

```
1. Go to Settings > Environments
2. Select environment
3. Click "Add secret"
4. Enter name and value
5. Click "Add secret"
```

### Using Environment Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}  # Environment secret
```

### Secret Precedence

```
Order of precedence (highest to lowest):
1. Environment secrets
2. Repository secrets
3. Organization secrets

Same name = environment secret wins
```

### Different Secrets per Environment

```yaml
# staging environment has STAGING_API_KEY
# production environment has PROD_API_KEY

jobs:
  deploy-staging:
    environment: staging
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}  # staging value
          
  deploy-production:
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}  # production value
```

### Common Pattern

```yaml
# Same secret name, different values per environment
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - run: ./deploy.sh
        env:
          # Automatically uses correct environment's secret
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
```

### Environment Variables

```yaml
# Use vars for non-sensitive config
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: |
          echo "Deploying to ${{ vars.DEPLOY_URL }}"
          ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### Secrets vs Variables

```
Use SECRETS for:
- API keys
- Passwords
- Tokens
- Private keys

Use VARIABLES for:
- URLs
- Feature flags
- Configuration values
- Non-sensitive settings
```

### Bulk Secret Management

```yaml
# Using GitHub CLI
- name: Set secrets
  run: |
    gh secret set API_KEY --env production --body "$API_KEY"
    gh secret set DB_PASSWORD --env production --body "$DB_PASSWORD"
  env:
    GH_TOKEN: ${{ secrets.ADMIN_TOKEN }}
    API_KEY: ${{ secrets.NEW_API_KEY }}
    DB_PASSWORD: ${{ secrets.NEW_DB_PASSWORD }}
```

### Secret Rotation

```yaml
name: Rotate Secrets

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly

jobs:
  rotate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Generate new key
        id: key
        run: |
          NEW_KEY=$(openssl rand -hex 32)
          echo "::add-mask::$NEW_KEY"
          echo "key=$NEW_KEY" >> $GITHUB_OUTPUT
          
      - name: Update secret
        run: |
          gh secret set API_KEY --env production --body "${{ steps.key.outputs.key }}"
        env:
          GH_TOKEN: ${{ secrets.ADMIN_TOKEN }}
```

### Verify Secret Exists

```yaml
- name: Check secrets
  run: |
    if [ -z "${{ secrets.API_KEY }}" ]; then
      echo "::error::API_KEY secret not set"
      exit 1
    fi
```

### Complete Example

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      url: ${{ vars.DEPLOY_URL }}
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Verify secrets
        run: |
          if [ -z "${{ secrets.DEPLOY_TOKEN }}" ]; then
            echo "::error::DEPLOY_TOKEN not configured for environment"
            exit 1
          fi
          
      - name: Build
        run: npm run build
        env:
          API_URL: ${{ vars.API_URL }}
          
      - name: Deploy
        run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
          
      - name: Summary
        run: |
          echo "## Deployment" >> $GITHUB_STEP_SUMMARY
          echo "Environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}" >> $GITHUB_STEP_SUMMARY
          echo "URL: ${{ vars.DEPLOY_URL }}" >> $GITHUB_STEP_SUMMARY
```

### Best Practices

```
✅ Use environment secrets for sensitive data
✅ Use variables for configuration
✅ Same secret names across environments
✅ Rotate secrets regularly
✅ Verify secrets before use
```

