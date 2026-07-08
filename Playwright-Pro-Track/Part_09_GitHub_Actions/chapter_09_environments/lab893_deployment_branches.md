# Lab 893: Deployment Branches

## LEARNING CONCEPT

Restricting deployments to specific branches.

## EXERCISE

1. Configure branch restrictions
2. Use branch patterns
3. Implement branch-based deployments

## SOLUTION

### Branch Restriction Options

```
Settings > Environments > [env] > Deployment branches:

1. All branches - No restrictions
2. Protected branches - Only protected branches
3. Selected branches - Custom patterns
```

### Selected Branch Patterns

```
Pattern examples:
- main              # Exact match
- release/*         # All release branches
- v*                # Version tags
- feature/deploy-*  # Specific feature branches
```

### Production Configuration

```
Production environment:
- Selected branches: main
- Only main branch can deploy
```

### Staging Configuration

```
Staging environment:
- Selected branches: main, develop
- Both branches can deploy
```

### Preview Configuration

```
Preview environment:
- All branches
- Any branch can deploy
```

### Branch-Based Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main, develop, 'release/*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    # Environment based on branch
    environment: ${{ 
      github.ref == 'refs/heads/main' && 'production' ||
      github.ref == 'refs/heads/develop' && 'staging' ||
      'preview'
    }}
    
    steps:
      - run: ./deploy.sh
```

### Validate Branch

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Validate branch
        run: |
          BRANCH="${{ github.ref_name }}"
          
          if [[ "$BRANCH" == "main" ]]; then
            echo "env=production" >> $GITHUB_ENV
          elif [[ "$BRANCH" == "develop" ]]; then
            echo "env=staging" >> $GITHUB_ENV
          elif [[ "$BRANCH" == release/* ]]; then
            echo "env=staging" >> $GITHUB_ENV
          else
            echo "::error::Branch $BRANCH not allowed for deployment"
            exit 1
          fi
```

### Tag-Based Deployment

```yaml
name: Release Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Restricted to tags matching v*
    
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
```

### PR Preview Deployments

```yaml
name: Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest
    environment:
      name: preview
      url: https://pr-${{ github.event.number }}.preview.myapp.com
      
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy-preview.sh ${{ github.event.number }}
```

### Branch Protection Integration

```
Combine with branch protection:

1. Protect main branch
2. Require PR reviews
3. Require status checks
4. Environment requires protected branches
```

### Dynamic Environment Selection

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      environment: ${{ steps.env.outputs.name }}
      
    steps:
      - id: env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "name=production" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then
            echo "name=staging" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == refs/heads/release/* ]]; then
            echo "name=staging" >> $GITHUB_OUTPUT
          else
            echo "name=development" >> $GITHUB_OUTPUT
          fi
          
  deploy:
    needs: setup
    runs-on: ubuntu-latest
    environment: ${{ needs.setup.outputs.environment }}
    
    steps:
      - run: ./deploy.sh
```

### Complete Example

```yaml
name: Branch-Based Deploy

on:
  push:
    branches: [main, develop, 'release/*']
  pull_request:
    types: [opened, synchronize]

jobs:
  determine-env:
    runs-on: ubuntu-latest
    outputs:
      environment: ${{ steps.env.outputs.name }}
      url: ${{ steps.env.outputs.url }}
      
    steps:
      - id: env
        run: |
          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            echo "name=preview" >> $GITHUB_OUTPUT
            echo "url=https://pr-${{ github.event.number }}.preview.myapp.com" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "name=production" >> $GITHUB_OUTPUT
            echo "url=https://myapp.com" >> $GITHUB_OUTPUT
          else
            echo "name=staging" >> $GITHUB_OUTPUT
            echo "url=https://staging.myapp.com" >> $GITHUB_OUTPUT
          fi
          
  deploy:
    needs: determine-env
    runs-on: ubuntu-latest
    environment:
      name: ${{ needs.determine-env.outputs.environment }}
      url: ${{ needs.determine-env.outputs.url }}
      
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Best Practices

```
✅ Restrict production to main
✅ Use patterns for flexibility
✅ Combine with branch protection
✅ Document branch policies
✅ Use preview environments for PRs
```

