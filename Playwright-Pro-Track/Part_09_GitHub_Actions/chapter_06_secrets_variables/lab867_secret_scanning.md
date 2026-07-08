# Lab 867: Secret Scanning

## LEARNING CONCEPT

Preventing secret exposure in repositories.

## EXERCISE

1. Enable secret scanning
2. Handle secret alerts
3. Prevent secret commits

## SOLUTION

### Enable Secret Scanning

```
Via GitHub UI:
1. Go to repository Settings
2. Click "Code security and analysis"
3. Enable "Secret scanning"
4. Optionally enable "Push protection"
```

### Supported Secrets

```
GitHub detects patterns for:
- AWS Access Keys
- Azure credentials
- Google Cloud keys
- GitHub tokens
- Slack tokens
- Stripe keys
- Database connection strings
- And 100+ more providers
```

### Secret Alerts

```
When a secret is detected:
1. Alert created in Security tab
2. Email notification sent
3. Partner notified (if applicable)
4. Secret may be revoked automatically
```

### Handling Alerts

```
Steps to resolve:
1. Review the alert
2. Revoke the exposed secret
3. Generate new secret
4. Update all usages
5. Close the alert
```

### Push Protection

```yaml
# Push protection blocks commits with secrets
# Before push completes, GitHub scans for secrets

# If secret detected:
# - Push is blocked
# - Developer sees warning
# - Can bypass with justification (if allowed)
```

### Custom Patterns

```
Create custom secret patterns:
1. Go to repository Settings
2. Click "Code security and analysis"
3. Click "New pattern" under Secret scanning
4. Define regex pattern
5. Add test strings
```

### Example Custom Pattern

```
Pattern name: Internal API Key
Pattern: internal_api_[a-zA-Z0-9]{32}
Test string: internal_api_abc123def456ghi789jkl012mno345

This will detect:
internal_api_abcdefghijklmnopqrstuvwxyz123456
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for common secret patterns
if git diff --cached | grep -E "(api_key|password|secret|token)\s*[:=]\s*['\"][^'\"]+['\"]"; then
    echo "Potential secret detected!"
    exit 1
fi
```

### GitHub Action for Scanning

```yaml
name: Secret Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: TruffleHog Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

### Gitleaks Integration

```yaml
name: Gitleaks

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### .gitignore for Secrets

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Credential files
credentials.json
secrets.json
*.pem
*.key

# IDE settings with potential secrets
.idea/
.vscode/settings.json
```

### Secret in History

```bash
# If secret was committed, remove from history
# WARNING: This rewrites history

# Using git-filter-repo
git filter-repo --invert-paths --path secrets.txt

# Using BFG Repo-Cleaner
bfg --delete-files secrets.txt
bfg --replace-text passwords.txt
```

### Notification Workflow

```yaml
name: Secret Alert Notification

on:
  secret_scanning_alert:
    types: [created]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify team
        run: |
          curl -X POST "$SLACK_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d '{"text":"⚠️ Secret scanning alert created!"}'
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### API Access

```bash
# List secret scanning alerts
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo/secret-scanning/alerts

# Get specific alert
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo/secret-scanning/alerts/1
```

### Best Practices

```
✅ Enable secret scanning
✅ Enable push protection
✅ Use pre-commit hooks
✅ Review alerts promptly
✅ Rotate exposed secrets immediately
✅ Never commit secrets
```

