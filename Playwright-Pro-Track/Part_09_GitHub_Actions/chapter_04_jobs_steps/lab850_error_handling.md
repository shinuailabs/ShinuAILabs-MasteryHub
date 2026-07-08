# Lab 850: Error Handling

## LEARNING CONCEPT

Handling errors and failures in GitHub Actions.

## EXERCISE

1. Handle step failures
2. Implement retry logic
3. Create cleanup steps

## SOLUTION

### Continue on Error

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: May fail
        continue-on-error: true
        run: ./flaky-script.sh
        
      - name: Always runs
        run: echo "This runs regardless"
```

### Check Step Outcome

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Test
        id: test
        continue-on-error: true
        run: npm test
        
      - name: On success
        if: steps.test.outcome == 'success'
        run: echo "Tests passed!"
        
      - name: On failure
        if: steps.test.outcome == 'failure'
        run: echo "Tests failed!"
```

### Status Check Functions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
      - name: On success
        if: success()
        run: echo "All previous steps succeeded"
        
      - name: On failure
        if: failure()
        run: echo "A previous step failed"
        
      - name: Always run
        if: always()
        run: echo "This always runs"
        
      - name: On cancel
        if: cancelled()
        run: echo "Workflow was cancelled"
```

### Retry Logic

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Retry flaky operation
        uses: nick-fields/retry@v2
        with:
          timeout_minutes: 5
          max_attempts: 3
          retry_wait_seconds: 10
          command: npm test
```

### Manual Retry

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Retry with script
        run: |
          for i in 1 2 3; do
            echo "Attempt $i"
            if npm test; then
              echo "Success!"
              exit 0
            fi
            echo "Failed, retrying..."
            sleep 10
          done
          echo "All attempts failed"
          exit 1
```

### Cleanup on Failure

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Setup
        run: ./setup.sh
        
      - name: Run tests
        run: npm test
        
      - name: Cleanup
        if: always()
        run: ./cleanup.sh
```

### Job-Level Error Handling

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  notify-failure:
    needs: build
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - run: ./notify-team.sh "Build failed"
```

### Try-Catch Pattern

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Try operation
        id: try
        continue-on-error: true
        run: ./risky-operation.sh
        
      - name: Catch failure
        if: steps.try.outcome == 'failure'
        run: |
          echo "Operation failed, running fallback"
          ./fallback.sh
          
      - name: Finally
        if: always()
        run: ./cleanup.sh
```

### Error Notification

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Build failed',
              body: `Build failed for commit ${context.sha}`
            })
```

### Timeout Handling

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - name: Long operation
        timeout-minutes: 10
        run: ./long-task.sh
        
      - name: Handle timeout
        if: failure()
        run: echo "Task may have timed out"
```

### Conditional Job Execution

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      status: ${{ steps.build.outcome }}
    steps:
      - id: build
        continue-on-error: true
        run: npm run build
        
  deploy:
    needs: build
    if: needs.build.outputs.status == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
      
  rollback:
    needs: build
    if: needs.build.outputs.status == 'failure'
    runs-on: ubuntu-latest
    steps:
      - run: ./rollback.sh
```

### Complete Example

```yaml
name: CI with Error Handling

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        id: test
        continue-on-error: true
        run: npm test
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
          
      - name: Build
        if: steps.test.outcome == 'success'
        run: npm run build
        
      - name: Notify failure
        if: failure()
        run: echo "Build failed!"
        
      - name: Cleanup
        if: always()
        run: ./cleanup.sh
```

### Best Practices

```
✅ Use continue-on-error wisely
✅ Always have cleanup steps
✅ Implement retry for flaky tests
✅ Notify on failures
✅ Check step outcomes explicitly
```

