# Lab 895: Environment Variables

## LEARNING CONCEPT

Using environment-specific configuration variables.

## EXERCISE

1. Create environment variables
2. Use variables in workflows
3. Manage variable precedence

## SOLUTION

### Creating Environment Variables

```
1. Go to Settings > Environments
2. Select environment
3. Click "Add variable"
4. Enter name and value
5. Click "Add variable"
```

### Using Environment Variables

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: |
          echo "Deploying to ${{ vars.DEPLOY_URL }}"
          echo "Region: ${{ vars.AWS_REGION }}"
```

### Variable Precedence

```
Order of precedence (highest to lowest):
1. Environment variables
2. Repository variables
3. Organization variables

Same name = environment variable wins
```

### Variables vs Secrets

```yaml
# Variables - non-sensitive configuration
vars.DEPLOY_URL
vars.AWS_REGION
vars.LOG_LEVEL
vars.FEATURE_FLAGS

# Secrets - sensitive data
secrets.API_KEY
secrets.DATABASE_PASSWORD
secrets.DEPLOY_TOKEN
```

### Common Variables

```
Environment variables to consider:
- DEPLOY_URL - Deployment target URL
- API_URL - Backend API endpoint
- AWS_REGION - Cloud region
- LOG_LEVEL - Logging verbosity
- FEATURE_FLAGS - Feature toggles
- NODE_ENV - Environment name
```

### Per-Environment Configuration

```yaml
# staging has vars.API_URL = https://api.staging.myapp.com
# production has vars.API_URL = https://api.myapp.com

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - run: npm run build
        env:
          API_URL: ${{ vars.API_URL }}
```

### Build-Time Variables

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - run: npm run build
        env:
          VITE_API_URL: ${{ vars.API_URL }}
          VITE_FEATURE_FLAGS: ${{ vars.FEATURE_FLAGS }}
```

### Runtime Variables

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Create config
        run: |
          cat > config.json << EOF
          {
            "apiUrl": "${{ vars.API_URL }}",
            "region": "${{ vars.AWS_REGION }}",
            "logLevel": "${{ vars.LOG_LEVEL }}"
          }
          EOF
```

### Variable in Conditions

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Deploy
        run: ./deploy.sh
        
      - name: Notify
        if: vars.SLACK_ENABLED == 'true'
        run: ./notify-slack.sh
```

### Default Values

```yaml
steps:
  - run: |
      LOG_LEVEL="${{ vars.LOG_LEVEL || 'info' }}"
      echo "Using log level: $LOG_LEVEL"
```

### List Variables

```yaml
- name: List variables
  uses: actions/github-script@v7
  with:
    script: |
      const vars = await github.rest.actions.listEnvironmentVariables({
        repository_id: context.repo.repo,
        environment_name: 'production'
      });
      
      for (const v of vars.data.variables) {
        console.log(`${v.name}: ${v.value}`);
      }
```

### Complete Example

```yaml
name: Deploy with Variables

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
      
      - name: Show configuration
        run: |
          echo "## Configuration" >> $GITHUB_STEP_SUMMARY
          echo "| Variable | Value |" >> $GITHUB_STEP_SUMMARY
          echo "|----------|-------|" >> $GITHUB_STEP_SUMMARY
          echo "| Environment | ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Deploy URL | ${{ vars.DEPLOY_URL }} |" >> $GITHUB_STEP_SUMMARY
          echo "| API URL | ${{ vars.API_URL }} |" >> $GITHUB_STEP_SUMMARY
          echo "| Region | ${{ vars.AWS_REGION }} |" >> $GITHUB_STEP_SUMMARY
          
      - name: Build
        run: npm run build
        env:
          NODE_ENV: ${{ vars.NODE_ENV || 'production' }}
          API_URL: ${{ vars.API_URL }}
          
      - name: Deploy
        run: ./deploy.sh
        env:
          DEPLOY_URL: ${{ vars.DEPLOY_URL }}
          AWS_REGION: ${{ vars.AWS_REGION }}
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Best Practices

```
✅ Use variables for configuration
✅ Use secrets for sensitive data
✅ Document required variables
✅ Provide default values
✅ Keep variables consistent
```

