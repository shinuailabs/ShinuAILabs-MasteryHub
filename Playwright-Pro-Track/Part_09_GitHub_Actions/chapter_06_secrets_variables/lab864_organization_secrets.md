# Lab 864: Organization Secrets

## LEARNING CONCEPT

Managing secrets at the organization level.

## EXERCISE

1. Create organization secrets
2. Configure secret visibility
3. Use organization secrets in workflows

## SOLUTION

### Creating Organization Secrets

```
Via GitHub UI:
1. Go to organization Settings
2. Click "Secrets and variables" > "Actions"
3. Click "New organization secret"
4. Enter name and value
5. Select repository access
6. Click "Add secret"

Via GitHub CLI:
gh secret set SECRET_NAME --org my-org --body "value"
```

### Repository Access Options

```
Visibility options:
1. All repositories - Available to all repos in org
2. Private repositories - Only private repos
3. Selected repositories - Specific repos only
```

### Using Organization Secrets

```yaml
# Same syntax as repository secrets
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          # Organization secret
          ORG_API_KEY: ${{ secrets.ORG_API_KEY }}
          # Repository secret (takes precedence)
          REPO_SECRET: ${{ secrets.REPO_SECRET }}
```

### Secret Precedence

```
Priority order (highest to lowest):
1. Environment secrets
2. Repository secrets
3. Organization secrets

If same name exists at multiple levels,
higher priority wins.
```

### Common Organization Secrets

```yaml
# Shared across all repos
env:
  # Cloud credentials
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  
  # Container registry
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
  
  # Notification services
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
  
  # Code signing
  CODE_SIGNING_KEY: ${{ secrets.CODE_SIGNING_KEY }}
```

### Selected Repositories

```
When to use selected repositories:
- Sensitive production credentials
- Team-specific secrets
- Project-specific API keys
```

### Managing Access

```bash
# List organization secrets
gh secret list --org my-org

# Set secret for selected repos
gh secret set SECRET_NAME \
  --org my-org \
  --repos repo1,repo2,repo3 \
  --body "value"

# Update repository access
gh secret set SECRET_NAME \
  --org my-org \
  --repos repo1,repo2,repo3,repo4 \
  --body "value"
```

### Dependabot Secrets

```
Organization Dependabot secrets:
1. Go to organization Settings
2. Click "Secrets and variables" > "Dependabot"
3. Add secrets for private registry access
```

### Codespaces Secrets

```
Organization Codespaces secrets:
1. Go to organization Settings
2. Click "Secrets and variables" > "Codespaces"
3. Add development environment secrets
```

### Secret Inheritance

```yaml
# Repository can override organization secrets
# Organization secret: API_KEY = "org-key"
# Repository secret: API_KEY = "repo-key"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo $API_KEY
        env:
          API_KEY: ${{ secrets.API_KEY }}
          # Uses "repo-key" (repository takes precedence)
```

### Team-Based Access

```
Strategy for team secrets:
1. Create secrets with team prefix
2. Assign to team repositories only

Example:
- TEAM_A_API_KEY -> Team A repos
- TEAM_B_API_KEY -> Team B repos
- SHARED_API_KEY -> All repos
```

### Audit and Compliance

```
Organization secret audit:
1. Go to organization Settings
2. Click "Audit log"
3. Filter by "secret" actions

Events tracked:
- org.secret_created
- org.secret_updated
- org.secret_removed
- org.secret_access_changed
```

### Complete Example

```yaml
name: Organization CI/CD

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          # Organization secrets
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: myorg/myapp:latest
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          # Organization secrets
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy
        run: ./deploy.sh
        env:
          # Repository-specific secret
          APP_SECRET: ${{ secrets.APP_SECRET }}
```

### Best Practices

```
✅ Use org secrets for shared credentials
✅ Limit access to necessary repos
✅ Use naming conventions
✅ Audit secret access regularly
✅ Document secret purposes
```

