# Lab 865: Variables

## LEARNING CONCEPT

Using configuration variables in GitHub Actions.

## EXERCISE

1. Create repository variables
2. Use variables in workflows
3. Manage variable scope

## SOLUTION

### Creating Variables

```
Via GitHub UI:
1. Go to repository Settings
2. Click "Secrets and variables" > "Actions"
3. Click "Variables" tab
4. Click "New repository variable"
5. Enter name and value
6. Click "Add variable"

Via GitHub CLI:
gh variable set VAR_NAME --body "value"
```

### Using Variables

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Environment: ${{ vars.ENVIRONMENT }}"
      - run: echo "API URL: ${{ vars.API_URL }}"
```

### Variables vs Secrets

```yaml
# Variables - Non-sensitive configuration
vars:
  ENVIRONMENT: production
  API_URL: https://api.example.com
  LOG_LEVEL: info
  FEATURE_FLAGS: '{"newUI":true}'

# Secrets - Sensitive data
secrets:
  API_KEY: abc123
  DATABASE_PASSWORD: secret
```

### Environment Variables

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
        env:
          # Environment variable
          API_URL: ${{ vars.API_URL }}
          # Environment secret
          API_KEY: ${{ secrets.API_KEY }}
```

### Organization Variables

```
Via GitHub UI:
1. Go to organization Settings
2. Click "Secrets and variables" > "Actions"
3. Click "Variables" tab
4. Click "New organization variable"
5. Select repository access
```

### Variable Precedence

```
Priority order (highest to lowest):
1. Environment variables
2. Repository variables
3. Organization variables
```

### Common Variables

```yaml
# Configuration
vars:
  NODE_VERSION: '20'
  PYTHON_VERSION: '3.11'
  
# URLs
vars:
  API_URL: https://api.example.com
  CDN_URL: https://cdn.example.com
  
# Feature flags
vars:
  ENABLE_FEATURE_X: 'true'
  MAX_RETRIES: '3'
```

### Using in Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: ${{ fromJson(vars.NODE_VERSIONS) }}
        # vars.NODE_VERSIONS = '["18","20","22"]'
        
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### Conditional Logic

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to production
        if: vars.ENVIRONMENT == 'production'
        run: ./deploy-prod.sh
        
      - name: Deploy to staging
        if: vars.ENVIRONMENT == 'staging'
        run: ./deploy-staging.sh
```

### JSON Variables

```yaml
# Variable: CONFIG = '{"timeout":30,"retries":3}'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: |
          CONFIG='${{ vars.CONFIG }}'
          TIMEOUT=$(echo $CONFIG | jq -r '.timeout')
          echo "Timeout: $TIMEOUT"
```

### Default Values

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Level: ${{ vars.LOG_LEVEL || 'info' }}"
```

### Listing Variables

```bash
# Via GitHub CLI
gh variable list

# Output:
# NAME          VALUE           UPDATED
# ENVIRONMENT   production      2024-01-15
# API_URL       https://...     2024-01-10
```

### Updating Variables

```bash
# Via GitHub CLI
gh variable set VAR_NAME --body "new-value"

# Delete variable
gh variable delete VAR_NAME
```

### Complete Example

```yaml
name: CI/CD

on: push

env:
  # Workflow-level from variables
  NODE_VERSION: ${{ vars.NODE_VERSION }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ vars.NODE_VERSION }}
          
      - run: npm ci
      - run: npm run build
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: ${{ vars.ENVIRONMENT }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy
        run: ./deploy.sh
        env:
          API_URL: ${{ vars.API_URL }}
          CDN_URL: ${{ vars.CDN_URL }}
          LOG_LEVEL: ${{ vars.LOG_LEVEL }}
          API_KEY: ${{ secrets.API_KEY }}
```

### Best Practices

```
✅ Use variables for configuration
✅ Use secrets for sensitive data
✅ Document variable purposes
✅ Use consistent naming
✅ Set sensible defaults
```

