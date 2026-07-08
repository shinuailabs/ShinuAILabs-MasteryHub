# Lab 878: Test Sharding

## LEARNING CONCEPT

Splitting tests across parallel jobs for faster execution.

## EXERCISE

1. Implement test sharding
2. Balance shard distribution
3. Aggregate shard results

## SOLUTION

### Basic Sharding

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --shard=${{ matrix.shard }}/4
```

### Jest Sharding

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4, 5]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - run: npm ci
      
      - name: Run tests
        run: npx jest --shard=${{ matrix.shard }}/${{ strategy.job-total }}
```

### Playwright Sharding

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/4
        
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

### Cypress Sharding

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        containers: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: cypress-io/github-action@v6
        with:
          record: true
          parallel: true
          group: 'CI'
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Pytest Sharding

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [0, 1, 2, 3]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          
      - run: pip install pytest pytest-split
      
      - name: Run tests
        run: pytest --splits 4 --group ${{ matrix.shard }}
```

### Custom Sharding Script

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Get test files for shard
        id: tests
        run: |
          ALL_TESTS=$(find tests -name "*.test.js" | sort)
          TOTAL=$(echo "$ALL_TESTS" | wc -l)
          PER_SHARD=$((TOTAL / 4 + 1))
          START=$(( (${{ matrix.shard }} - 1) * PER_SHARD + 1 ))
          
          SHARD_TESTS=$(echo "$ALL_TESTS" | sed -n "${START},$((START + PER_SHARD - 1))p" | tr '\n' ' ')
          echo "files=$SHARD_TESTS" >> $GITHUB_OUTPUT
          
      - run: npm test -- ${{ steps.tests.outputs.files }}
```

### Merge Shard Results

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --shard=${{ matrix.shard }}/4 --coverage
      
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ matrix.shard }}
          path: coverage/
          
  merge:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v4
        with:
          pattern: coverage-*
          merge-multiple: true
          path: coverage/
          
      - name: Merge coverage
        run: npx nyc merge coverage coverage/merged.json
```

### Dynamic Shard Count

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      shards: ${{ steps.set-shards.outputs.shards }}
      
    steps:
      - uses: actions/checkout@v4
      
      - id: set-shards
        run: |
          TEST_COUNT=$(find tests -name "*.test.js" | wc -l)
          SHARD_COUNT=$((TEST_COUNT / 50 + 1))
          SHARDS=$(seq 1 $SHARD_COUNT | jq -R . | jq -s .)
          echo "shards=$SHARDS" >> $GITHUB_OUTPUT
          
  test:
    needs: setup
    strategy:
      matrix:
        shard: ${{ fromJson(needs.setup.outputs.shards) }}
```

### Complete Example

```yaml
name: Sharded Tests

on: [push, pull_request]

jobs:
  test:
    name: Shard ${{ matrix.shard }}/4
    
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
        
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - run: npm ci
      
      - name: Run tests
        run: npm test -- --shard=${{ matrix.shard }}/4
        
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-${{ matrix.shard }}
          path: test-results/
          
  report:
    needs: test
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          pattern: results-*
          merge-multiple: true
          
      - name: Generate report
        run: npx jest-html-reporter
```

### Best Practices

```
✅ Balance shard sizes
✅ Use fail-fast: false
✅ Merge results after
✅ Handle flaky tests
✅ Monitor shard times
```

