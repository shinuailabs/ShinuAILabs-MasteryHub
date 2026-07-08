# Lab 862: Repository Secrets

## LEARNING CONCEPT

Managing repository secrets in GitHub Actions.

## EXERCISE

1. Create repository secrets
2. Use secrets in workflows
3. Handle secret security

## SOLUTION

### Creating Secrets

```
Via GitHub UI:
1. Go to repository Settings
2. Click "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Enter name and value
5. Click "Add secret"

Via GitHub CLI:
gh secret set SECRET_NAME --body "secret-value"
gh secret set SECRET_NAME < secret-file.txt
```

### Using Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Common Secrets

```yaml
# API tokens
env:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  DOCKER_TOKEN: ${{ secrets.DOCKER_TOKEN }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

# Service credentials
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  REDIS_URL: ${{ secrets.REDIS_URL }}
  
# Notification tokens
env:
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
  DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
```

### GITHUB_TOKEN

```yaml
# Automatically available
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Personal Access Token

```yaml
# For cross-repo operations
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger other workflow
        run: |
          curl -X POST \
            -H "Authorization: token ${{ secrets.PAT }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/owner/repo/dispatches \
            -d '{"event_type":"trigger"}'
```

### Secret in Action Input

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      token: ${{ secrets.PAT }}
      
  - uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}
```

### Conditional Secret Usage

```yaml
steps:
  - name: Deploy to production
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh
    env:
      API_KEY: ${{ secrets.PROD_API_KEY }}
      
  - name: Deploy to staging
    if: github.ref == 'refs/heads/develop'
    run: ./deploy.sh
    env:
      API_KEY: ${{ secrets.STAGING_API_KEY }}
```

### Secret Masking

```yaml
steps:
  - name: Use secret
    run: |
      # Secret is automatically masked in logs
      echo "Using API key: $API_KEY"
      # Output: Using API key: ***
    env:
      API_KEY: ${{ secrets.API_KEY }}
```

### Check Secret Existence

```yaml
steps:
  - name: Check if secret exists
    run: |
      if [ -z "${{ secrets.OPTIONAL_SECRET }}" ]; then
        echo "Secret not set, using default"
      else
        echo "Secret is set"
      fi
```

### Multi-line Secrets

```yaml
# Store JSON or certificates as secrets
steps:
  - name: Setup credentials
    run: |
      echo '${{ secrets.GCP_CREDENTIALS }}' > credentials.json
      
  - name: Setup SSH key
    run: |
      mkdir -p ~/.ssh
      echo '${{ secrets.SSH_PRIVATE_KEY }}' > ~/.ssh/id_rsa
      chmod 600 ~/.ssh/id_rsa
```

### Secret Rotation

```yaml
# Use versioned secrets for rotation
env:
  # During rotation, both work
  API_KEY: ${{ secrets.API_KEY_V2 || secrets.API_KEY_V1 }}
```

### Listing Secrets

```bash
# Via GitHub CLI
gh secret list

# Output:
# NAME              UPDATED
# API_KEY           2024-01-15
# DATABASE_URL      2024-01-10
```

### Deleting Secrets

```bash
# Via GitHub CLI
gh secret delete SECRET_NAME
```

### Security Best Practices

```yaml
# ✅ Use secrets for sensitive data
env:
  API_KEY: ${{ secrets.API_KEY }}

# ❌ Never hardcode secrets
env:
  API_KEY: "abc123"  # NEVER DO THIS

# ✅ Limit secret scope
jobs:
  deploy:
    environment: production
    # Only has access to production secrets
```

### Complete Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2
        
      - name: Deploy
        run: ./deploy.sh
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
```

### Best Practices

```
✅ Use descriptive names
✅ Rotate secrets regularly
✅ Limit access scope
✅ Never log secrets
✅ Use environment secrets for sensitive deployments
```

