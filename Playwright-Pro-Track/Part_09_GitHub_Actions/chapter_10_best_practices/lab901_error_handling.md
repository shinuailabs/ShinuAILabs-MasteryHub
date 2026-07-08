# Lab 901: Error Handling

## LEARNING CONCEPT

Handling errors in GitHub Actions workflows.

## EXERCISE

1. Implement error handling
2. Use continue-on-error
3. Create retry logic

## SOLUTION

### Continue on Error

```yaml
steps:
  - name: Optional step
    run: ./optional-script.sh
    continue-on-error: true
    
  - name: Always runs
    run: echo "This runs regardless"
```

### Check Step Outcome

```yaml
steps:
  - name: Might fail
    id: check
    run: ./check.sh
    continue-on-error: true
    
  - name: Handle failure
    if: steps.check.outcome == 'failure'
    run: echo "Check failed, handling..."
```

### Job-Level Continue

```yaml
jobs:
  optional:
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - run: ./optional-job.sh
      
  required:
    needs: optional
    runs-on: ubuntu-latest
    steps:
      - run: ./required-job.sh
```

### Retry Logic

```yaml
steps:
  - name: Retry on failure
    run: |
      for i in {1..3}; do
        if ./flaky-script.sh; then
          exit 0
        fi
        echo "Attempt $i failed, retrying..."
        sleep 10
      done
      exit 1
```

### Retry Action

```yaml
- uses: nick-fields/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: npm test
```

### Cleanup on Failure

```yaml
steps:
  - name: Deploy
    id: deploy
    run: ./deploy.sh
    
  - name: Cleanup on failure
    if: failure() && steps.deploy.outcome == 'failure'
    run: ./cleanup.sh
```

### Always Run Cleanup

```yaml
steps:
  - name: Setup
    run: ./setup.sh
    
  - name: Test
    run: npm test
    
  - name: Cleanup
    if: always()
    run: ./cleanup.sh
```

### Error Notifications

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  notify:
    needs: test
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        run: |
          curl -X POST "$SLACK_WEBHOOK" \
            -d '{"text":"Tests failed in ${{ github.repository }}"}'
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### Conditional Job Execution

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  deploy:
    needs: test
    if: success()  # Only if test succeeded
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
      
  rollback:
    needs: deploy
    if: failure()  # Only if deploy failed
    runs-on: ubuntu-latest
    steps:
      - run: ./rollback.sh
```

### Error Context

```yaml
steps:
  - name: Run with error context
    run: |
      set -e
      trap 'echo "Error on line $LINENO"' ERR
      
      ./script.sh
```

### Timeout Handling

```yaml
steps:
  - name: Long running task
    run: ./long-task.sh
    timeout-minutes: 30
    continue-on-error: true
    id: task
    
  - name: Handle timeout
    if: steps.task.outcome == 'failure'
    run: echo "Task timed out or failed"
```

### Complete Example

```yaml
name: Robust CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup
        id: setup
        run: npm ci
        
      - name: Lint
        id: lint
        run: npm run lint
        continue-on-error: true
        
      - name: Test with retry
        uses: nick-fields/retry@v2
        with:
          timeout_minutes: 10
          max_attempts: 3
          command: npm test
          
      - name: Build
        id: build
        run: npm run build
        
      - name: Upload on success
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          
      - name: Cleanup
        if: always()
        run: |
          rm -rf node_modules
          echo "Cleanup complete"
          
  notify:
    needs: test
    if: failure()
    runs-on: ubuntu-latest
    
    steps:
      - name: Send notification
        run: |
          echo "## Build Failed" >> $GITHUB_STEP_SUMMARY
          echo "Workflow: ${{ github.workflow }}" >> $GITHUB_STEP_SUMMARY
          echo "Run: ${{ github.run_id }}" >> $GITHUB_STEP_SUMMARY
```

### Best Practices

```
✅ Use continue-on-error wisely
✅ Implement retry for flaky tests
✅ Always cleanup resources
✅ Notify on failures
✅ Check step outcomes
```

