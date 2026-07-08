# Lab 829: Environment Variables

## LEARNING CONCEPT

Using environment variables in GitHub Actions.

## EXERCISE

1. Set environment variables at different levels
2. Use default environment variables
3. Pass variables between steps

## SOLUTION

### Environment Variable Levels

```yaml
# Workflow level
env:
  WORKFLOW_VAR: workflow-value

jobs:
  build:
    runs-on: ubuntu-latest
    
    # Job level
    env:
      JOB_VAR: job-value
      
    steps:
      - name: Step with env
        # Step level
        env:
          STEP_VAR: step-value
        run: |
          echo "Workflow: $WORKFLOW_VAR"
          echo "Job: $JOB_VAR"
          echo "Step: $STEP_VAR"
```

### Default Environment Variables

```yaml
steps:
  - name: Show default variables
    run: |
      echo "GitHub Actor: $GITHUB_ACTOR"
      echo "GitHub Repository: $GITHUB_REPOSITORY"
      echo "GitHub Ref: $GITHUB_REF"
      echo "GitHub SHA: $GITHUB_SHA"
      echo "GitHub Run ID: $GITHUB_RUN_ID"
      echo "GitHub Run Number: $GITHUB_RUN_NUMBER"
      echo "GitHub Workflow: $GITHUB_WORKFLOW"
      echo "GitHub Event Name: $GITHUB_EVENT_NAME"
      echo "Runner OS: $RUNNER_OS"
      echo "Runner Arch: $RUNNER_ARCH"
```

### Common Default Variables

```
CI=true
GITHUB_ACTOR          - User who triggered workflow
GITHUB_REPOSITORY     - owner/repo
GITHUB_REF            - refs/heads/branch or refs/tags/tag
GITHUB_REF_NAME       - branch or tag name
GITHUB_SHA            - Commit SHA
GITHUB_RUN_ID         - Unique run identifier
GITHUB_RUN_NUMBER     - Run number for workflow
GITHUB_WORKFLOW       - Workflow name
GITHUB_EVENT_NAME     - Event that triggered workflow
GITHUB_WORKSPACE      - Workspace directory
RUNNER_OS             - Linux, Windows, or macOS
RUNNER_ARCH           - X64, ARM, or ARM64
RUNNER_TEMP           - Temp directory
```

### Setting Variables Dynamically

```yaml
steps:
  - name: Set environment variable
    run: echo "MY_VAR=hello" >> $GITHUB_ENV
    
  - name: Use variable
    run: echo "MY_VAR is $MY_VAR"
```

### Multi-line Variables

```yaml
steps:
  - name: Set multi-line variable
    run: |
      echo "CONFIG<<EOF" >> $GITHUB_ENV
      echo "line1" >> $GITHUB_ENV
      echo "line2" >> $GITHUB_ENV
      echo "EOF" >> $GITHUB_ENV
      
  - name: Use multi-line variable
    run: echo "$CONFIG"
```

### Using Secrets as Variables

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      # Make secret available as env var
      API_KEY: ${{ secrets.API_KEY }}
      
    steps:
      - name: Deploy
        run: ./deploy.sh
        # Or set at step level
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Repository Variables

```yaml
# Using repository/organization variables
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      APP_NAME: ${{ vars.APP_NAME }}
      ENVIRONMENT: ${{ vars.ENVIRONMENT }}
      
    steps:
      - run: echo "Building $APP_NAME for $ENVIRONMENT"
```

### Conditional Variables

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      ENVIRONMENT: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      
    steps:
      - run: echo "Deploying to $ENVIRONMENT"
```

### Variables from Expressions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      BRANCH_NAME: ${{ github.ref_name }}
      SHORT_SHA: ${{ github.sha }}
      BUILD_NUMBER: ${{ github.run_number }}
      
    steps:
      - run: |
          echo "Branch: $BRANCH_NAME"
          echo "SHA: $SHORT_SHA"
          echo "Build: $BUILD_NUMBER"
```

### Passing Variables Between Jobs

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    steps:
      - id: version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
        
  build:
    needs: setup
    runs-on: ubuntu-latest
    env:
      VERSION: ${{ needs.setup.outputs.version }}
      
    steps:
      - run: echo "Building version $VERSION"
```

### Environment File

```yaml
steps:
  - name: Set multiple variables
    run: |
      cat >> $GITHUB_ENV << 'EOF'
      VAR1=value1
      VAR2=value2
      VAR3=value3
      EOF
      
  - name: Use variables
    run: |
      echo "$VAR1 $VAR2 $VAR3"
```

### Best Practices

```
✅ Use appropriate scope
✅ Don't hardcode secrets
✅ Use vars for non-sensitive config
✅ Document required variables
✅ Use meaningful names
✅ Validate required variables
```

