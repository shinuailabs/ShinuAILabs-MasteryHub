# Lab 843: Triggers Best Practices

## LEARNING CONCEPT

Best practices for configuring workflow triggers.

## EXERCISE

1. Choose appropriate triggers
2. Optimize trigger configuration
3. Avoid common pitfalls

## SOLUTION

### Trigger Selection Guide

```
Push:
- CI builds
- Deployments on merge
- Tag-based releases

Pull Request:
- PR validation
- Code review automation
- Preview deployments

Schedule:
- Nightly builds
- Maintenance tasks
- Reports

Workflow Dispatch:
- Manual deployments
- Ad-hoc tasks
- Testing workflows

Repository Dispatch:
- External integrations
- Cross-repo triggers
- Webhook handlers
```

### CI Workflow Template

```yaml
name: CI

on:
  push:
    branches: [main, develop]
    paths-ignore:
      - '**.md'
      - 'docs/**'
  pull_request:
    branches: [main]
    paths-ignore:
      - '**.md'
      - 'docs/**'
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### CD Workflow Template

```yaml
name: CD

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
        default: staging

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false
```

### Release Workflow Template

```yaml
name: Release

on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'
  release:
    types: [published]
```

### Avoid Duplicate Runs

```yaml
# ❌ Bad: Triggers on both push and PR
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# ✅ Good: Different branches
on:
  push:
    branches: [main]  # Only after merge
  pull_request:
    branches: [main]  # PR validation
```

### Skip CI Patterns

```yaml
jobs:
  build:
    # Skip if commit message contains [skip ci]
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Path Filtering Strategy

```yaml
# Separate workflows for different components
# frontend.yml
on:
  push:
    paths:
      - 'frontend/**'
      - 'shared/**'

# backend.yml
on:
  push:
    paths:
      - 'backend/**'
      - 'shared/**'
```

### Scheduled Workflow Tips

```yaml
on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:  # Always add for testing

jobs:
  nightly:
    runs-on: ubuntu-latest
    steps:
      # Check if scheduled run is needed
      - name: Check for changes
        id: check
        run: |
          # Skip if no changes in last 24 hours
          CHANGES=$(git log --since="24 hours ago" --oneline | wc -l)
          echo "changes=$CHANGES" >> $GITHUB_OUTPUT
          
      - name: Run tests
        if: steps.check.outputs.changes > 0
        run: npm test
```

### Manual Trigger Best Practices

```yaml
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
      confirm:
        description: 'Type "deploy" to confirm'
        required: true
        type: string

jobs:
  deploy:
    if: inputs.confirm == 'deploy'
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
```

### Event-Specific Conditions

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy:
    needs: build
    # Only deploy on push to main or manual trigger
    if: |
      github.event_name == 'push' ||
      github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Common Pitfalls

```yaml
# ❌ Infinite loop
on:
  push:
jobs:
  update:
    steps:
      - run: git commit -m "Update" && git push

# ✅ Fixed with token or skip
on:
  push:
jobs:
  update:
    steps:
      - run: |
          git commit -m "Update [skip ci]"
          git push
```

### Trigger Checklist

```
□ Appropriate event type selected
□ Branch filters configured
□ Path filters for efficiency
□ Concurrency configured
□ Skip CI option available
□ Manual trigger for testing
□ No infinite loop risk
□ Documented trigger behavior
```

### Summary

```
✅ Use specific triggers
✅ Filter by paths and branches
✅ Add workflow_dispatch for testing
✅ Configure concurrency
✅ Avoid duplicate runs
✅ Handle skip CI
✅ Document trigger logic
✅ Test trigger configuration
```

