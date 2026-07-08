# Part 03: Matrix Builds

## 📚 Overview
Matrix builds run jobs across multiple configurations simultaneously for comprehensive testing.

---

## 🎯 Key Concepts

### 1. Basic Matrix

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

### 2. Multi-Dimensional Matrix

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18, 20]
        browser: [chromium, firefox]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }}
```

### 3. Include Additional Configurations

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        include:
          - browser: chromium
            install-deps: true
          - browser: webkit
            os: macos-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=${{ matrix.browser }}
```

### 4. Exclude Configurations

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        browser: [chromium, firefox, webkit]
        exclude:
          - os: windows-latest
            browser: webkit
          - os: ubuntu-latest
            browser: webkit
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=${{ matrix.browser }}
```

### 5. Fail-Fast Control

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false  # Continue other jobs if one fails
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=${{ matrix.browser }}
```

### 6. Max Parallel Jobs

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      max-parallel: 2  # Run max 2 jobs at a time
      matrix:
        shard: [1, 2, 3, 4, 5, 6]
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --shard=${{ matrix.shard }}/6
```

### 7. Dynamic Matrix

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - id: set-matrix
        run: |
          echo "matrix={\"browser\":[\"chromium\",\"firefox\"]}" >> $GITHUB_OUTPUT

  test:
    needs: setup
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=${{ matrix.browser }}
```

### 8. Sharding with Matrix

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: report-${{ matrix.shardIndex }}
          path: playwright-report/
```

### 9. Environment-Based Matrix

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [dev, staging, production]
        include:
          - environment: dev
            url: https://dev.example.com
          - environment: staging
            url: https://staging.example.com
          - environment: production
            url: https://example.com
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run tests
        env:
          BASE_URL: ${{ matrix.url }}
        run: npx playwright test
```

---

## 💻 Practice Exercises

1. Create basic matrix
2. Use multi-dimensional matrix
3. Add include/exclude
4. Configure fail-fast
5. Implement sharding matrix

---

## ✅ Best Practices

- ✅ Use fail-fast: false for test jobs
- ✅ Limit parallel jobs if needed
- ✅ Use include for special cases
- ✅ Exclude invalid combinations
- ❌ Don't create too many combinations
- ❌ Avoid redundant configurations

---

## 📝 Quick Reference

```yaml
strategy:
  fail-fast: false
  max-parallel: 4
  matrix:
    os: [ubuntu-latest, macos-latest]
    node: [18, 20]
    include:
      - os: ubuntu-latest
        extra: value
    exclude:
      - os: macos-latest
        node: 16

# Access values
${{ matrix.os }}
${{ matrix.node }}
```

