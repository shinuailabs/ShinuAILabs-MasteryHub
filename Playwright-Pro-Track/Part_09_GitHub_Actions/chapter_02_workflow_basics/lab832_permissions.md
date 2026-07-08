# Lab 832: Permissions

## LEARNING CONCEPT

Managing permissions in GitHub Actions workflows.

## EXERCISE

1. Understand permission scopes
2. Set workflow and job permissions
3. Apply least privilege principle

## SOLUTION

### Permission Scopes

```
Available permissions:
- actions: read/write
- checks: read/write
- contents: read/write
- deployments: read/write
- id-token: write (OIDC)
- issues: read/write
- packages: read/write
- pages: read/write
- pull-requests: read/write
- repository-projects: read/write
- security-events: read/write
- statuses: read/write
```

### Workflow-Level Permissions

```yaml
name: CI

on: push

# Set permissions for entire workflow
permissions:
  contents: read
  issues: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### Job-Level Permissions

```yaml
permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
  deploy:
    runs-on: ubuntu-latest
    # Override for this job
    permissions:
      contents: read
      packages: write
    steps:
      - run: ./deploy.sh
```

### Read-All or Write-All

```yaml
# Read all permissions
permissions: read-all

# Write all permissions (use sparingly)
permissions: write-all

# No permissions
permissions: {}
```

### Common Permission Patterns

```yaml
# Checkout only
permissions:
  contents: read

# Publish packages
permissions:
  contents: read
  packages: write

# Create releases
permissions:
  contents: write

# Comment on PRs
permissions:
  pull-requests: write

# Update commit status
permissions:
  statuses: write

# Deploy to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write
```

### OIDC Token for Cloud Providers

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/my-role
          aws-region: us-east-1
```

### Security Best Practices

```yaml
# ✅ Good: Minimal permissions
permissions:
  contents: read

# ❌ Bad: Overly permissive
permissions: write-all
```

### PR Workflow Permissions

```yaml
name: PR Check

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Tests passed! ✅'
            })
```

### Release Workflow Permissions

```yaml
name: Release

on:
  push:
    tags: ['v*']

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/*
          generate_release_notes: true
```

### Package Publishing Permissions

```yaml
name: Publish

on:
  release:
    types: [published]

permissions:
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Push image
        run: |
          docker build -t ghcr.io/${{ github.repository }}:latest .
          docker push ghcr.io/${{ github.repository }}:latest
```

### Forked Repository Permissions

```yaml
# For PRs from forks, permissions are limited
# GITHUB_TOKEN has read-only access
# Secrets are not available

name: PR from Fork

on:
  pull_request_target:  # Runs in context of base repo
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
```

### Best Practices

```
✅ Use least privilege principle
✅ Set permissions explicitly
✅ Review permissions regularly
✅ Use job-level when needed
✅ Document permission requirements
✅ Be careful with write-all
```

