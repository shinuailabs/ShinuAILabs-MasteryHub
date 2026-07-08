# Lab 868: Secret Rotation

## LEARNING CONCEPT

Implementing secret rotation strategies.

## EXERCISE

1. Plan rotation strategy
2. Implement automated rotation
3. Handle rotation gracefully

## SOLUTION

### Rotation Strategy

```
Rotation frequency recommendations:
- API keys: Every 90 days
- Database passwords: Every 30-90 days
- Service accounts: Every 90 days
- SSH keys: Every 6-12 months
- Certificates: Before expiration
```

### Manual Rotation

```bash
# 1. Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# 2. Update in GitHub
gh secret set API_KEY --body "$NEW_SECRET"

# 3. Update in application
# Deploy with new secret

# 4. Verify new secret works

# 5. Revoke old secret
```

### Automated Rotation Workflow

```yaml
name: Rotate Secrets

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly
  workflow_dispatch:

jobs:
  rotate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Generate new API key
        id: generate
        run: |
          NEW_KEY=$(openssl rand -hex 32)
          echo "::add-mask::$NEW_KEY"
          echo "key=$NEW_KEY" >> $GITHUB_OUTPUT
          
      - name: Update external service
        run: |
          curl -X POST "https://api.service.com/rotate-key" \
            -H "Authorization: Bearer ${{ secrets.SERVICE_TOKEN }}" \
            -d '{"new_key":"${{ steps.generate.outputs.key }}"}'
            
      - name: Update GitHub secret
        run: |
          gh secret set API_KEY --body "${{ steps.generate.outputs.key }}"
        env:
          GH_TOKEN: ${{ secrets.PAT }}
```

### Dual-Key Rotation

```yaml
# Support both old and new keys during transition
name: Dual-Key Rotation

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      # 1. Generate new key
      - name: Generate new key
        id: new-key
        run: echo "key=$(openssl rand -hex 32)" >> $GITHUB_OUTPUT
        
      # 2. Store as secondary key
      - name: Set secondary key
        run: gh secret set API_KEY_V2 --body "${{ steps.new-key.outputs.key }}"
        env:
          GH_TOKEN: ${{ secrets.PAT }}
          
      # 3. Deploy with both keys
      - name: Deploy
        run: ./deploy.sh
        
      # 4. After verification, promote to primary
      - name: Promote to primary
        run: |
          gh secret set API_KEY --body "${{ steps.new-key.outputs.key }}"
          gh secret delete API_KEY_V2
        env:
          GH_TOKEN: ${{ secrets.PAT }}
```

### Application Support

```javascript
// Support multiple keys during rotation
const validKeys = [
  process.env.API_KEY,
  process.env.API_KEY_V2
].filter(Boolean);

function validateApiKey(key) {
  return validKeys.includes(key);
}
```

### AWS Key Rotation

```yaml
name: Rotate AWS Keys

on:
  schedule:
    - cron: '0 0 1 * *'

jobs:
  rotate:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      
    steps:
      - name: Configure AWS (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123:role/KeyRotationRole
          aws-region: us-east-1
          
      - name: Rotate IAM keys
        run: |
          # Create new key
          NEW_KEY=$(aws iam create-access-key --user-name github-actions)
          
          # Update GitHub secrets
          ACCESS_KEY=$(echo $NEW_KEY | jq -r '.AccessKey.AccessKeyId')
          SECRET_KEY=$(echo $NEW_KEY | jq -r '.AccessKey.SecretAccessKey')
          
          gh secret set AWS_ACCESS_KEY_ID --body "$ACCESS_KEY"
          gh secret set AWS_SECRET_ACCESS_KEY --body "$SECRET_KEY"
          
          # Delete old key (after grace period)
        env:
          GH_TOKEN: ${{ secrets.PAT }}
```

### Database Password Rotation

```yaml
name: Rotate Database Password

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate new password
        id: password
        run: |
          NEW_PASS=$(openssl rand -base64 32)
          echo "::add-mask::$NEW_PASS"
          echo "password=$NEW_PASS" >> $GITHUB_OUTPUT
          
      - name: Update database
        run: |
          psql "${{ secrets.DATABASE_URL }}" -c \
            "ALTER USER app_user PASSWORD '${{ steps.password.outputs.password }}';"
            
      - name: Update secret
        run: |
          NEW_URL="postgres://app_user:${{ steps.password.outputs.password }}@host/db"
          gh secret set DATABASE_URL --body "$NEW_URL"
        env:
          GH_TOKEN: ${{ secrets.PAT }}
```

### Rotation Notification

```yaml
- name: Notify on rotation
  if: success()
  run: |
    curl -X POST "$SLACK_WEBHOOK" \
      -H "Content-Type: application/json" \
      -d '{"text":"✅ Secret rotation completed successfully"}'
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    
- name: Alert on failure
  if: failure()
  run: |
    curl -X POST "$SLACK_WEBHOOK" \
      -H "Content-Type: application/json" \
      -d '{"text":"❌ Secret rotation failed! Manual intervention required."}'
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### Rotation Checklist

```
Before rotation:
□ Identify all secret usages
□ Plan rollback procedure
□ Schedule during low-traffic period
□ Notify team

During rotation:
□ Generate new secret
□ Update all systems
□ Verify functionality
□ Monitor for errors

After rotation:
□ Revoke old secret
□ Update documentation
□ Log rotation event
□ Schedule next rotation
```

### Best Practices

```
✅ Automate rotation
✅ Support dual keys
✅ Test rotation process
✅ Monitor for failures
✅ Document procedures
✅ Notify stakeholders
```

