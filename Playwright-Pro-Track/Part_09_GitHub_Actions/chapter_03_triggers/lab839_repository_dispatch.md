# Lab 839: Repository Dispatch

## LEARNING CONCEPT

Triggering workflows from external events.

## EXERCISE

1. Configure repository dispatch
2. Send custom events
3. Handle event payloads

## SOLUTION

### Basic Repository Dispatch

```yaml
name: External Trigger

on:
  repository_dispatch:
    types: [deploy]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Triggered by external event"
```

### Multiple Event Types

```yaml
on:
  repository_dispatch:
    types:
      - deploy
      - build
      - test
      - notify

jobs:
  handle:
    runs-on: ubuntu-latest
    steps:
      - name: Handle event
        run: echo "Event type: ${{ github.event.action }}"
```

### Triggering via API

```bash
# Using curl
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type":"deploy"}'

# Using GitHub CLI
gh api repos/OWNER/REPO/dispatches \
  -f event_type=deploy
```

### With Payload

```bash
# Send event with payload
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{
    "event_type": "deploy",
    "client_payload": {
      "environment": "production",
      "version": "1.0.0",
      "triggered_by": "external-system"
    }
  }'
```

### Accessing Payload

```yaml
on:
  repository_dispatch:
    types: [deploy]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Show payload
        run: |
          echo "Event: ${{ github.event.action }}"
          echo "Environment: ${{ github.event.client_payload.environment }}"
          echo "Version: ${{ github.event.client_payload.version }}"
          echo "Triggered by: ${{ github.event.client_payload.triggered_by }}"
```

### Conditional on Event Type

```yaml
on:
  repository_dispatch:
    types: [deploy, rollback]

jobs:
  deploy:
    if: github.event.action == 'deploy'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh ${{ github.event.client_payload.version }}
      
  rollback:
    if: github.event.action == 'rollback'
    runs-on: ubuntu-latest
    steps:
      - run: ./rollback.sh ${{ github.event.client_payload.version }}
```

### Cross-Repository Trigger

```yaml
# In source repository
name: Trigger Target Repo

on:
  push:
    branches: [main]

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deployment
        run: |
          curl -X POST \
            -H "Authorization: token ${{ secrets.DISPATCH_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/OWNER/TARGET-REPO/dispatches \
            -d '{
              "event_type": "deploy",
              "client_payload": {
                "source_repo": "${{ github.repository }}",
                "commit_sha": "${{ github.sha }}"
              }
            }'
```

### Webhook Integration

```yaml
# Triggered by external webhook
on:
  repository_dispatch:
    types: [webhook]

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Process webhook
        run: |
          echo "Webhook data:"
          echo '${{ toJson(github.event.client_payload) }}'
```

### CI/CD Pipeline Trigger

```yaml
on:
  repository_dispatch:
    types: [ci-trigger]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.client_payload.ref || 'main' }}
          
      - run: npm ci
      - run: npm test
      - run: npm run build
      
  deploy:
    needs: build
    if: github.event.client_payload.deploy == true
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Complete Example

```yaml
name: External Deployment

on:
  repository_dispatch:
    types: [deploy, rollback, restart]

jobs:
  validate:
    runs-on: ubuntu-latest
    outputs:
      valid: ${{ steps.check.outputs.valid }}
    steps:
      - name: Validate payload
        id: check
        run: |
          if [ -z "${{ github.event.client_payload.environment }}" ]; then
            echo "Missing environment"
            echo "valid=false" >> $GITHUB_OUTPUT
          else
            echo "valid=true" >> $GITHUB_OUTPUT
          fi
          
  deploy:
    needs: validate
    if: needs.validate.outputs.valid == 'true' && github.event.action == 'deploy'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          echo "Deploying to ${{ github.event.client_payload.environment }}"
          ./deploy.sh
          
  rollback:
    needs: validate
    if: needs.validate.outputs.valid == 'true' && github.event.action == 'rollback'
    runs-on: ubuntu-latest
    steps:
      - run: ./rollback.sh ${{ github.event.client_payload.version }}
```

### Best Practices

```
✅ Use specific event types
✅ Validate payloads
✅ Secure dispatch tokens
✅ Document expected payloads
✅ Handle missing data gracefully
```

