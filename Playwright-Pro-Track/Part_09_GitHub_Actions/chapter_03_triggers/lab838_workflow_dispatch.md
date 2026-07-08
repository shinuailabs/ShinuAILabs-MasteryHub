# Lab 838: Workflow Dispatch

## LEARNING CONCEPT

Manually triggering workflows with inputs.

## EXERCISE

1. Configure manual triggers
2. Define workflow inputs
3. Use inputs in workflows

## SOLUTION

### Basic Manual Trigger

```yaml
name: Manual Workflow

on:
  workflow_dispatch:

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Manually triggered!"
```

### Inputs

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

### Input Types

```yaml
on:
  workflow_dispatch:
    inputs:
      # String input
      version:
        description: 'Version to deploy'
        required: true
        type: string
        
      # Choice input
      environment:
        description: 'Environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
          
      # Boolean input
      debug:
        description: 'Enable debug mode'
        required: false
        type: boolean
        default: false
        
      # Environment input
      target:
        description: 'Target environment'
        required: true
        type: environment
```

### Using Inputs

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
      version:
        type: string
        required: true
      dry_run:
        type: boolean
        default: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    
    steps:
      - name: Show inputs
        run: |
          echo "Environment: ${{ inputs.environment }}"
          echo "Version: ${{ inputs.version }}"
          echo "Dry run: ${{ inputs.dry_run }}"
          
      - name: Deploy
        if: inputs.dry_run == false
        run: ./deploy.sh ${{ inputs.version }}
```

### Conditional on Inputs

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Debug info
        if: inputs.debug == true
        run: |
          env | sort
          pwd
          ls -la
          
      - name: Deploy to staging
        if: inputs.environment == 'staging'
        run: ./deploy-staging.sh
        
      - name: Deploy to production
        if: inputs.environment == 'production'
        run: ./deploy-production.sh
```

### Triggering via API

```bash
# Using GitHub CLI
gh workflow run deploy.yml \
  -f environment=staging \
  -f version=1.0.0 \
  -f debug=true

# Using curl
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"environment":"staging","version":"1.0.0"}}'
```

### Combined Triggers

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
        default: staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Determine environment
        id: env
        run: |
          if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
            echo "env=${{ inputs.environment }}" >> $GITHUB_OUTPUT
          else
            echo "env=staging" >> $GITHUB_OUTPUT
          fi
          
      - run: echo "Deploying to ${{ steps.env.outputs.env }}"
```

### Input Validation

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Validate version
        run: |
          if [[ ! "${{ inputs.version }}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Invalid version format"
            exit 1
          fi
          
      - name: Validate environment
        run: |
          case "${{ inputs.environment }}" in
            staging|production)
              echo "Valid environment"
              ;;
            *)
              echo "Invalid environment"
              exit 1
              ;;
          esac
```

### Complete Example

```yaml
name: Deploy Application

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to deploy (e.g., 1.0.0)'
        required: true
        type: string
      notify:
        description: 'Send notification'
        required: false
        type: boolean
        default: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    
    steps:
      - uses: actions/checkout@v4
        with:
          ref: v${{ inputs.version }}
          
      - name: Deploy
        run: |
          echo "Deploying v${{ inputs.version }} to ${{ inputs.environment }}"
          ./deploy.sh
          
      - name: Notify
        if: inputs.notify == true
        run: ./notify.sh "Deployed v${{ inputs.version }} to ${{ inputs.environment }}"
```

### Best Practices

```
✅ Use descriptive input names
✅ Provide sensible defaults
✅ Validate inputs
✅ Use choice for limited options
✅ Document input requirements
```

