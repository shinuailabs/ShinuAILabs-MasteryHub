# Lab 890: Protection Rules

## LEARNING CONCEPT

Configuring environment protection rules.

## EXERCISE

1. Set up required reviewers
2. Configure wait timers
3. Implement branch restrictions

## SOLUTION

### Required Reviewers

```
Configure in Settings > Environments > [env]:

1. Check "Required reviewers"
2. Add users or teams
3. Up to 6 reviewers
4. Any one can approve
```

### Wait Timer

```
Configure deployment delay:

1. Check "Wait timer"
2. Set minutes (0-43200)
3. Deployment waits before starting
```

### Branch Restrictions

```
Limit which branches can deploy:

1. Check "Deployment branches"
2. Choose:
   - All branches
   - Protected branches
   - Selected branches (patterns)
```

### Branch Patterns

```
Examples:
- main
- release/*
- v*
- feature/deploy-*
```

### Workflow with Protection

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Has protection rules
    
    steps:
      # Workflow pauses here for approval
      - run: ./deploy.sh
```

### Approval Process

```
When protection rules are configured:

1. Workflow reaches environment job
2. Job pauses, waiting for approval
3. Reviewers notified
4. Reviewer approves/rejects
5. Job continues or fails
```

### Multiple Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging  # No protection
    steps:
      - run: ./deploy.sh staging
      
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production  # Requires approval
    steps:
      - run: ./deploy.sh production
```

### Custom Deployment Rules

```
GitHub Apps can provide custom rules:

1. Install deployment protection app
2. Configure in environment settings
3. App validates before deployment
```

### Prevent Self-Approval

```
Best practice:
- Require different person to approve
- Use team reviewers
- Implement separation of duties
```

### Timeout Handling

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    timeout-minutes: 60  # Include approval wait time
    
    steps:
      - run: ./deploy.sh
```

### Approval with Context

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
      
    steps:
      - name: Show deployment info
        run: |
          echo "## Deployment Summary" >> $GITHUB_STEP_SUMMARY
          echo "- Branch: ${{ github.ref }}" >> $GITHUB_STEP_SUMMARY
          echo "- Commit: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "- Author: ${{ github.actor }}" >> $GITHUB_STEP_SUMMARY
          
      - run: ./deploy.sh
```

### Bypass Protection

```
Admins can bypass protection:

1. Go to workflow run
2. Click "Review deployments"
3. Select environment
4. Choose "Approve and deploy"
```

### Complete Example

```yaml
name: Production Deploy

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
      - run: npm run build
      - run: ./deploy.sh staging
      
  production:
    needs: staging
    runs-on: ubuntu-latest
    environment:
      name: production  # Requires approval
      url: https://myapp.com
      
    steps:
      - name: Deployment info
        run: |
          echo "## Production Deployment" >> $GITHUB_STEP_SUMMARY
          echo "Deploying commit ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          
      - uses: actions/checkout@v4
      - run: npm run build
      - run: ./deploy.sh production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Protection Rule Checklist

```
Production Environment:
□ Required reviewers (2+)
□ Wait timer (optional)
□ Branch restrictions (main only)
□ Prevent self-approval

Staging Environment:
□ Branch restrictions (main, develop)
□ Optional reviewers

Development Environment:
□ No restrictions
□ All branches allowed
```

### Best Practices

```
✅ Require reviewers for production
✅ Use wait timers for critical systems
✅ Restrict deployment branches
✅ Document approval process
✅ Review deployment history
```

