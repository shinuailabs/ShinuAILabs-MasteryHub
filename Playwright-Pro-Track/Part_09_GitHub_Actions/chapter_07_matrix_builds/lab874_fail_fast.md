# Lab 874: Fail-Fast Strategy

## LEARNING CONCEPT

Controlling matrix job failure behavior.

## EXERCISE

1. Configure fail-fast
2. Handle partial failures
3. Implement custom failure logic

## SOLUTION

### Default Behavior (fail-fast: true)

```yaml
# Default: If one job fails, cancel all others
jobs:
  test:
    strategy:
      # fail-fast: true is the default
      matrix:
        node: [18, 20, 22]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Disable Fail-Fast

```yaml
# Continue all jobs even if one fails
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm test
```

### When to Use fail-fast: false

```yaml
# Use for:
# 1. Full test coverage across platforms
# 2. Finding all failures at once
# 3. Independent test suites

jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        browser: [chrome, firefox, safari]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e -- --browser=${{ matrix.browser }}
```

### When to Use fail-fast: true

```yaml
# Use for:
# 1. Fast feedback
# 2. Resource conservation
# 3. Sequential dependencies

jobs:
  test:
    strategy:
      fail-fast: true  # Default
      matrix:
        stage: [lint, unit, integration]
        
    runs-on: ubuntu-latest
    steps:
      - run: npm run ${{ matrix.stage }}
```

### Continue on Error

```yaml
# Allow specific jobs to fail without affecting others
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        include:
          - node: 22
            experimental: true
            
    runs-on: ubuntu-latest
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - run: npm test
```

### Partial Failure Handling

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - run: npm test
      
  report:
    needs: test
    if: always()  # Run even if test jobs failed
    runs-on: ubuntu-latest
    
    steps:
      - name: Check results
        run: |
          echo "Test job results:"
          echo "${{ toJson(needs.test) }}"
```

### Aggregate Results

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [18, 20, 22]
        
    runs-on: ubuntu-latest
    outputs:
      result: ${{ job.status }}
      
    steps:
      - run: npm test
      
  summary:
    needs: test
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - name: Check all results
        run: |
          if [ "${{ needs.test.result }}" == "failure" ]; then
            echo "Some tests failed"
            exit 1
          fi
          echo "All tests passed"
```

### Conditional Fail-Fast

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      fail-fast: ${{ steps.config.outputs.fail-fast }}
      
    steps:
      - id: config
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            echo "fail-fast=true" >> $GITHUB_OUTPUT
          else
            echo "fail-fast=false" >> $GITHUB_OUTPUT
          fi
          
  test:
    needs: setup
    strategy:
      fail-fast: ${{ fromJson(needs.setup.outputs.fail-fast) }}
      matrix:
        node: [18, 20, 22]
```

### Notification on Failure

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm test
      
  notify:
    needs: test
    if: failure()
    runs-on: ubuntu-latest
    
    steps:
      - name: Notify on failure
        run: |
          curl -X POST "$SLACK_WEBHOOK" \
            -d '{"text":"Matrix tests failed!"}'
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### Complete Example

```yaml
name: Matrix with Fail-Fast Control

on: [push, pull_request]

jobs:
  test:
    name: Test Node ${{ matrix.node }} on ${{ matrix.os }}
    
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
        include:
          - os: ubuntu-latest
            node: 22
            experimental: true
            
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.experimental || false }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          
      - run: npm ci
      - run: npm test
      
  results:
    needs: test
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - name: Summary
        run: |
          echo "## Test Results" >> $GITHUB_STEP_SUMMARY
          echo "Status: ${{ needs.test.result }}" >> $GITHUB_STEP_SUMMARY
```

### Best Practices

```
✅ Use fail-fast: false for full coverage
✅ Use fail-fast: true for fast feedback
✅ Handle failures gracefully
✅ Report all results
✅ Consider resource usage
```

