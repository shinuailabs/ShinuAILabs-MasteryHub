# Lab 851: Timeouts

## LEARNING CONCEPT

Configuring timeouts for jobs and steps.

## EXERCISE

1. Set job timeouts
2. Configure step timeouts
3. Handle timeout scenarios

## SOLUTION

### Job Timeout

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Default is 360 (6 hours)
    
    steps:
      - run: npm run build
```

### Step Timeout

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Quick step
        timeout-minutes: 5
        run: npm ci
        
      - name: Long step
        timeout-minutes: 20
        run: npm run e2e-tests
```

### Combined Timeouts

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 60  # Total job limit
    
    steps:
      - name: Install
        timeout-minutes: 10
        run: npm ci
        
      - name: Build
        timeout-minutes: 15
        run: npm run build
        
      - name: Test
        timeout-minutes: 30
        run: npm test
```

### Timeout with Retry

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Flaky test with timeout
        uses: nick-fields/retry@v2
        with:
          timeout_minutes: 10
          max_attempts: 3
          command: npm test
```

### Handling Timeout

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - name: Long operation
        id: long-op
        timeout-minutes: 20
        continue-on-error: true
        run: ./long-running-task.sh
        
      - name: Check if timed out
        if: steps.long-op.outcome == 'failure'
        run: |
          echo "Operation may have timed out"
          ./handle-timeout.sh
```

### Timeout for External Services

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Wait for service
        timeout-minutes: 5
        run: |
          for i in {1..30}; do
            if curl -s http://localhost:8080/health; then
              echo "Service is ready"
              exit 0
            fi
            echo "Waiting for service..."
            sleep 10
          done
          echo "Service did not start in time"
          exit 1
```

### Timeout with Cleanup

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - name: Setup
        run: ./setup.sh
        
      - name: Run tests
        timeout-minutes: 20
        run: npm test
        
      - name: Cleanup
        if: always()
        timeout-minutes: 5
        run: ./cleanup.sh
```

### Matrix with Timeouts

```yaml
jobs:
  test:
    strategy:
      matrix:
        test-suite: [unit, integration, e2e]
        include:
          - test-suite: unit
            timeout: 10
          - test-suite: integration
            timeout: 20
          - test-suite: e2e
            timeout: 30
            
    runs-on: ubuntu-latest
    timeout-minutes: ${{ matrix.timeout }}
    
    steps:
      - run: npm run test:${{ matrix.test-suite }}
```

### Timeout Best Practices

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # Set reasonable job timeout
    timeout-minutes: 45
    
    steps:
      # Fast operations
      - name: Checkout
        timeout-minutes: 2
        uses: actions/checkout@v4
        
      # Medium operations
      - name: Install
        timeout-minutes: 10
        run: npm ci
        
      # Potentially slow operations
      - name: Build
        timeout-minutes: 15
        run: npm run build
        
      # Variable duration
      - name: Tests
        timeout-minutes: 20
        run: npm test
```

### Timeout Monitoring

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - name: Start timer
        run: echo "START_TIME=$(date +%s)" >> $GITHUB_ENV
        
      - name: Long operation
        run: npm run build
        
      - name: Check duration
        run: |
          END_TIME=$(date +%s)
          DURATION=$((END_TIME - START_TIME))
          echo "Build took $DURATION seconds"
          if [ $DURATION -gt 1200 ]; then
            echo "::warning::Build took longer than 20 minutes"
          fi
```

### Complete Example

```yaml
name: CI with Timeouts

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    
    steps:
      - uses: actions/checkout@v4
        timeout-minutes: 2
        
      - uses: actions/setup-node@v4
        timeout-minutes: 2
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        timeout-minutes: 10
        run: npm ci
        
      - name: Lint
        timeout-minutes: 5
        run: npm run lint
        
      - name: Unit tests
        timeout-minutes: 10
        run: npm run test:unit
        
      - name: Integration tests
        timeout-minutes: 15
        run: npm run test:integration
        
      - name: Build
        timeout-minutes: 10
        run: npm run build
        
      - name: Cleanup
        if: always()
        timeout-minutes: 2
        run: ./cleanup.sh
```

### Best Practices

```
✅ Set job-level timeout
✅ Set step-level timeouts
✅ Allow buffer time
✅ Handle timeouts gracefully
✅ Monitor build durations
```

