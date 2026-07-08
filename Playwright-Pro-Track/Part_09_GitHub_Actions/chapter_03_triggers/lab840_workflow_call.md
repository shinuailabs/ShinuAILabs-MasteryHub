# Lab 840: Workflow Call

## LEARNING CONCEPT

Creating and using reusable workflows.

## EXERCISE

1. Create reusable workflows
2. Call workflows from other workflows
3. Pass inputs and secrets

## SOLUTION

### Reusable Workflow

```yaml
# .github/workflows/reusable-build.yml
name: Reusable Build

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
      environment:
        required: false
        type: string
        default: 'development'
    secrets:
      npm-token:
        required: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          
      - run: npm ci
        env:
          NPM_TOKEN: ${{ secrets.npm-token }}
          
      - run: npm run build
```

### Calling Reusable Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '20'
      environment: 'production'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

### Input Types

```yaml
on:
  workflow_call:
    inputs:
      # String
      version:
        type: string
        required: true
        
      # Number
      timeout:
        type: number
        default: 30
        
      # Boolean
      deploy:
        type: boolean
        default: false
```

### Outputs from Reusable Workflow

```yaml
# Reusable workflow
on:
  workflow_call:
    outputs:
      version:
        description: 'Built version'
        value: ${{ jobs.build.outputs.version }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
    steps:
      - id: version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
```

### Using Outputs

```yaml
# Caller workflow
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

### Secrets Inheritance

```yaml
# Pass all secrets
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    secrets: inherit
```

### Cross-Repository Reusable Workflow

```yaml
jobs:
  build:
    uses: owner/shared-workflows/.github/workflows/build.yml@main
    with:
      node-version: '20'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

### Nested Workflow Calls

```yaml
# Level 1: Main workflow
jobs:
  ci:
    uses: ./.github/workflows/ci.yml
    
# Level 2: CI workflow
jobs:
  build:
    uses: ./.github/workflows/build.yml
  test:
    uses: ./.github/workflows/test.yml
```

### Permissions in Reusable Workflows

```yaml
# Reusable workflow
on:
  workflow_call:

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### Complete Example

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      version:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true
    outputs:
      url:
        description: 'Deployment URL'
        value: ${{ jobs.deploy.outputs.url }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    outputs:
      url: ${{ steps.deploy.outputs.url }}
      
    steps:
      - uses: actions/checkout@v4
        with:
          ref: v${{ inputs.version }}
          
      - name: Deploy
        id: deploy
        env:
          DEPLOY_TOKEN: ${{ secrets.deploy-token }}
        run: |
          ./deploy.sh ${{ inputs.environment }}
          echo "url=https://${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT
```

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: ['v*']

jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      version: ${{ github.ref_name }}
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
      
  deploy-production:
    needs: deploy-staging
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
      version: ${{ github.ref_name }}
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

### Best Practices

```
✅ Define clear inputs and outputs
✅ Document required secrets
✅ Use semantic versioning for shared workflows
✅ Test reusable workflows independently
✅ Keep workflows focused
```

