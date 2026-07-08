# Lab 899: Security Best Practices

## LEARNING CONCEPT

Securing GitHub Actions workflows.

## EXERCISE

1. Implement security practices
2. Protect secrets
3. Secure workflow execution

## SOLUTION

### Minimal Permissions

```yaml
# Set minimal permissions at workflow level
permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
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

### Pin Action Versions

```yaml
# ❌ Don't use mutable tags
- uses: actions/checkout@main
- uses: actions/checkout@v4

# ✅ Pin to SHA
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

### Secret Protection

```yaml
# Secrets are automatically masked
- run: echo "${{ secrets.API_KEY }}"  # Shows ***

# Don't expose in logs
- run: |
    # ❌ Bad
    echo "Key is $API_KEY"
    
    # ✅ Good
    echo "Using API key"
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### Input Validation

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # Validate input
      - name: Validate
        run: |
          if [[ ! "${{ inputs.environment }}" =~ ^(staging|production)$ ]]; then
            echo "Invalid environment"
            exit 1
          fi
```

### Prevent Script Injection

```yaml
# ❌ Vulnerable to injection
- run: echo "${{ github.event.issue.title }}"

# ✅ Use environment variable
- run: echo "$TITLE"
  env:
    TITLE: ${{ github.event.issue.title }}
```

### Secure Checkout

```yaml
# For PRs from forks
- uses: actions/checkout@v4
  with:
    persist-credentials: false
    ref: ${{ github.event.pull_request.head.sha }}
```

### Fork Security

```yaml
# Don't run on forks with secrets
jobs:
  deploy:
    if: github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Audit Dependencies

```yaml
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Audit dependencies
        run: npm audit --audit-level=high
        
      - name: Check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### OIDC Authentication

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/deploy
          aws-region: us-east-1
```

### Secure Artifacts

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
```

### Security Checklist

```
Permissions:
□ Minimal permissions
□ Job-level permissions
□ No write access unless needed

Actions:
□ Pin to SHA
□ Review third-party actions
□ Use trusted actions

Secrets:
□ Use environment secrets
□ Rotate regularly
□ Don't log secrets

Inputs:
□ Validate all inputs
□ Use choice types
□ Sanitize user input

Forks:
□ Limit fork access
□ Don't expose secrets
□ Review PR workflows
```

### Complete Example

```yaml
name: Secure CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
      - run: npm audit --audit-level=high
      
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
      - run: npm ci
      - run: npm run build
      
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: [security, build]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    environment: production
    
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: us-east-1
      - run: ./deploy.sh
```

### Best Practices

```
✅ Use minimal permissions
✅ Pin action versions
✅ Protect secrets
✅ Validate inputs
✅ Use OIDC when possible
```

