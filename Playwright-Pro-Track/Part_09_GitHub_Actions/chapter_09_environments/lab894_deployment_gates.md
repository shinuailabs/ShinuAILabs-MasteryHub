# Lab 894: Deployment Gates

## LEARNING CONCEPT

Implementing deployment gates and checks.

## EXERCISE

1. Configure wait timers
2. Implement custom gates
3. Use deployment protection rules

## SOLUTION

### Wait Timer

```
Configure in Settings > Environments:

1. Select environment
2. Check "Wait timer"
3. Set minutes (0-43200)
4. Deployment waits before starting
```

### Wait Timer Use Cases

```
Use wait timers for:
- Scheduled maintenance windows
- Allowing time to cancel
- Coordinating with external systems
- Compliance requirements
```

### Required Reviewers

```
Configure reviewers:

1. Check "Required reviewers"
2. Add up to 6 reviewers
3. Any reviewer can approve
4. Deployment waits for approval
```

### Custom Deployment Protection

```
GitHub Apps can provide custom rules:

1. Install protection app
2. Configure in environment
3. App validates before deployment
```

### Pre-Deployment Checks

```yaml
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: npm test
        
      - name: Security scan
        run: npm audit
        
      - name: Check dependencies
        run: npm outdated || true
        
  deploy:
    needs: checks
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
```

### Health Check Gate

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Pre-deploy health check
        run: |
          if ! curl -sf https://myapp.com/health; then
            echo "::error::Current deployment unhealthy"
            exit 1
          fi
          
      - run: ./deploy.sh
      
      - name: Post-deploy health check
        run: |
          sleep 30
          for i in {1..5}; do
            if curl -sf https://myapp.com/health; then
              echo "Deployment healthy"
              exit 0
            fi
            sleep 10
          done
          echo "::error::Deployment unhealthy"
          exit 1
```

### External Approval Gate

```yaml
jobs:
  request-approval:
    runs-on: ubuntu-latest
    steps:
      - name: Request approval
        run: |
          curl -X POST "$APPROVAL_API/request" \
            -H "Authorization: Bearer $TOKEN" \
            -d '{"deployment": "${{ github.sha }}"}'
        env:
          APPROVAL_API: ${{ vars.APPROVAL_API }}
          TOKEN: ${{ secrets.APPROVAL_TOKEN }}
          
  wait-approval:
    needs: request-approval
    runs-on: ubuntu-latest
    steps:
      - name: Wait for approval
        run: |
          for i in {1..60}; do
            STATUS=$(curl -s "$APPROVAL_API/status/${{ github.sha }}")
            if [ "$STATUS" == "approved" ]; then
              exit 0
            elif [ "$STATUS" == "rejected" ]; then
              exit 1
            fi
            sleep 60
          done
          exit 1
        env:
          APPROVAL_API: ${{ vars.APPROVAL_API }}
          
  deploy:
    needs: wait-approval
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh
```

### Change Management Gate

```yaml
jobs:
  create-change:
    runs-on: ubuntu-latest
    outputs:
      change-id: ${{ steps.change.outputs.id }}
      
    steps:
      - id: change
        name: Create change request
        run: |
          CHANGE_ID=$(curl -X POST "$SERVICENOW_API/change" \
            -H "Authorization: Bearer $TOKEN" \
            -d '{"description": "Deploy ${{ github.sha }}"}' \
            | jq -r '.id')
          echo "id=$CHANGE_ID" >> $GITHUB_OUTPUT
        env:
          SERVICENOW_API: ${{ vars.SERVICENOW_API }}
          TOKEN: ${{ secrets.SERVICENOW_TOKEN }}
          
  deploy:
    needs: create-change
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh
      
      - name: Close change
        if: always()
        run: |
          curl -X PATCH "$SERVICENOW_API/change/${{ needs.create-change.outputs.change-id }}" \
            -d '{"status": "${{ job.status }}"}'
```

### Canary Gate

```yaml
jobs:
  canary:
    runs-on: ubuntu-latest
    environment: canary
    
    steps:
      - run: ./deploy.sh --canary --percentage=5
      
      - name: Monitor canary
        run: |
          sleep 300  # 5 minutes
          ERROR_RATE=$(curl -s "$METRICS_API/error-rate")
          if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
            echo "::error::Canary error rate too high: $ERROR_RATE"
            exit 1
          fi
          
  production:
    needs: canary
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - run: ./deploy.sh --full
```

### Complete Example

```yaml
name: Gated Deployment

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      
  staging:
    needs: [test, security]
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh staging
      
      - name: Smoke tests
        run: npm run test:smoke
        
  production:
    needs: staging
    runs-on: ubuntu-latest
    environment: production  # Has wait timer + reviewers
    
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production
```

### Best Practices

```
✅ Use multiple gate types
✅ Implement health checks
✅ Monitor after deployment
✅ Document gate requirements
✅ Plan for gate failures
```

