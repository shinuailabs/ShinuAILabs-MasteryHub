# Lab 870: Secrets & Variables Best Practices

## LEARNING CONCEPT

Best practices for managing secrets and variables.

## EXERCISE

1. Review secret management practices
2. Implement secure patterns
3. Apply organizational standards

## SOLUTION

### Secret Hierarchy

```
Organization Level:
├── Shared credentials (AWS, Docker Hub)
├── Notification tokens (Slack, Discord)
└── Code signing keys

Repository Level:
├── App-specific API keys
├── Database credentials
└── Service tokens

Environment Level:
├── Production secrets
├── Staging secrets
└── Development secrets
```

### Naming Conventions

```yaml
# Use clear, descriptive names
secrets:
  # ✅ Good
  AWS_ACCESS_KEY_ID
  DATABASE_URL_PRODUCTION
  SLACK_WEBHOOK_ALERTS
  
  # ❌ Bad
  KEY1
  SECRET
  TOKEN
```

### Secret vs Variable

```yaml
# Secrets - Sensitive data
secrets:
  API_KEY: "sensitive-value"
  DATABASE_PASSWORD: "secret"
  PRIVATE_KEY: "-----BEGIN RSA..."

# Variables - Configuration
vars:
  ENVIRONMENT: "production"
  API_URL: "https://api.example.com"
  LOG_LEVEL: "info"
  FEATURE_FLAGS: '{"newUI":true}'
```

### Access Control

```yaml
# Limit secret access
jobs:
  build:
    runs-on: ubuntu-latest
    # No secrets needed
    steps:
      - run: npm run build
      
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Has secrets
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### OIDC Over Secrets

```yaml
# ✅ Preferred: OIDC
permissions:
  id-token: write
  
steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123:role/Role
      
# ❌ Avoid: Long-lived credentials
steps:
  - run: ./deploy.sh
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### Secret Rotation

```yaml
# Automated rotation schedule
name: Rotate Secrets

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Rotate API key
        run: ./rotate-key.sh
```

### Audit Trail

```yaml
# Log secret usage (not values!)
- name: Audit log
  run: |
    echo "Secret used: API_KEY"
    echo "User: ${{ github.actor }}"
    echo "Time: $(date -u)"
    echo "Workflow: ${{ github.workflow }}"
```

### Documentation

```markdown
# Secrets Documentation

## Repository Secrets

| Name | Description | Rotation | Owner |
|------|-------------|----------|-------|
| API_KEY | Main API key | 90 days | @team |
| DATABASE_URL | Production DB | 30 days | @dba |

## Environment Secrets

### Production
| Name | Description |
|------|-------------|
| PROD_API_KEY | Production API |

### Staging
| Name | Description |
|------|-------------|
| STAGING_API_KEY | Staging API |
```

### Emergency Procedures

```markdown
# Secret Compromise Response

1. Immediately revoke compromised secret
2. Generate new secret
3. Update all usages
4. Audit access logs
5. Notify security team
6. Document incident
```

### Validation Workflow

```yaml
name: Validate Secrets

on:
  workflow_dispatch:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Check API key
        run: |
          if curl -s -o /dev/null -w "%{http_code}" \
            -H "Authorization: Bearer $API_KEY" \
            https://api.example.com/health | grep -q "200"; then
            echo "✅ API key valid"
          else
            echo "❌ API key invalid"
            exit 1
          fi
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

### Checklist

```
Secret Management:
□ Use descriptive names
□ Document all secrets
□ Set rotation schedule
□ Limit access scope
□ Use OIDC when possible

Security:
□ Never log secrets
□ Validate inputs
□ Use environment protection
□ Enable secret scanning
□ Review access regularly

Organization:
□ Define ownership
□ Emergency procedures
□ Audit trail
□ Compliance requirements
```

### Anti-Patterns

```yaml
# ❌ Hardcoded secrets
env:
  API_KEY: "abc123"

# ❌ Secrets in logs
- run: echo "Key: ${{ secrets.API_KEY }}"

# ❌ Secrets in artifacts
- uses: actions/upload-artifact@v4
  with:
    path: config-with-secrets.json

# ❌ Overly broad access
permissions: write-all
```

### Complete Template

```yaml
name: Secure Workflow

on:
  push:
    branches: [main]

permissions:
  contents: read

env:
  # Non-sensitive configuration
  NODE_ENV: production
  API_URL: ${{ vars.API_URL }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    permissions:
      contents: read
      id-token: write
      
    steps:
      - uses: actions/checkout@v4
      
      # Use OIDC for cloud auth
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: us-east-1
          
      # Use secrets only where needed
      - name: Deploy
        run: ./deploy.sh
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Best Practices Summary

```
✅ Use clear naming conventions
✅ Document all secrets
✅ Rotate regularly
✅ Use OIDC over static credentials
✅ Limit access scope
✅ Enable secret scanning
✅ Audit access regularly
✅ Have emergency procedures
```

