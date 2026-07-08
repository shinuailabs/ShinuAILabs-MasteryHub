# Lab 869: Secure Workflows

## LEARNING CONCEPT

Implementing security best practices in workflows.

## EXERCISE

1. Secure workflow configuration
2. Protect against injection attacks
3. Implement least privilege

## SOLUTION

### Minimal Permissions

```yaml
# Default to minimal permissions
permissions: {}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      
    steps:
      - uses: actions/checkout@v4
```

### Job-Level Permissions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
```

### Prevent Script Injection

```yaml
# ❌ Vulnerable to injection
- run: echo "Hello ${{ github.event.issue.title }}"

# ✅ Safe - use environment variable
- run: echo "Hello $TITLE"
  env:
    TITLE: ${{ github.event.issue.title }}
```

### Input Validation

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Validate input
        run: |
          # Validate version format
          if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Invalid version format"
            exit 1
          fi
        env:
          VERSION: ${{ github.event.inputs.version }}
```

### Pin Action Versions

```yaml
# ✅ Pin to commit SHA
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11

# ✅ Pin to specific version
- uses: actions/checkout@v4.1.1

# ❌ Avoid floating tags
- uses: actions/checkout@v4
- uses: actions/checkout@main
```

### Restrict Fork PRs

```yaml
# Don't run on fork PRs with secrets
jobs:
  build:
    if: github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### Secure Artifact Handling

```yaml
# Don't include secrets in artifacts
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: |
      dist/
      !dist/**/*.env
      !dist/**/secrets.*
```

### Environment Protection

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Requires approval
    
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### Audit Logging

```yaml
- name: Log deployment
  run: |
    echo "Deployment by: ${{ github.actor }}"
    echo "Commit: ${{ github.sha }}"
    echo "Time: $(date -u)"
    echo "Environment: production"
```

### Secure Shell Scripts

```yaml
# Use strict mode
- run: |
    set -euo pipefail
    ./deploy.sh
    
# Avoid eval
- run: |
    # ❌ Dangerous
    eval "$USER_INPUT"
    
    # ✅ Safe
    echo "$USER_INPUT"
```

### Token Scoping

```yaml
# Use fine-grained PAT
- uses: actions/checkout@v4
  with:
    token: ${{ secrets.FINE_GRAINED_PAT }}
    # PAT only has access to specific repos
```

### Dependency Review

```yaml
name: Dependency Review

on: pull_request

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: high
```

### Code Scanning

```yaml
name: CodeQL

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v2
      - uses: github/codeql-action/analyze@v2
```

### Secure Defaults

```yaml
defaults:
  run:
    shell: bash -euo pipefail {0}
```

### Complete Secure Workflow

```yaml
name: Secure CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
      
      - name: Build
        run: npm run build
        
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production
    permissions:
      contents: read
      deployments: write
      id-token: write
      
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
      
      - name: Configure AWS (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: us-east-1
          
      - name: Deploy
        run: ./deploy.sh
```

### Security Checklist

```
□ Minimal permissions
□ Pin action versions
□ Validate inputs
□ Protect secrets
□ Use OIDC
□ Environment protection
□ Audit logging
□ Dependency scanning
□ Code scanning
```

### Best Practices

```
✅ Least privilege principle
✅ Pin dependencies
✅ Validate all inputs
✅ Use OIDC over secrets
✅ Enable branch protection
✅ Review third-party actions
```

