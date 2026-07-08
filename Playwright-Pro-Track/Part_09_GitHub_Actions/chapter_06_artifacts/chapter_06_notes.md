# Part 06: Artifacts

## 📚 Overview
Artifacts persist data between jobs and store build outputs for later access.

---

## 🎯 Key Concepts

### 1. Upload Artifacts

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Upload Options

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      playwright-report/
      test-results/
    retention-days: 30
    if-no-files-found: warn  # warn, error, ignore
    compression-level: 6     # 0-9, default 6
```

### 3. Always Upload (Even on Failure)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()  # Upload even if tests fail
        with:
          name: playwright-report
          path: playwright-report/
```

### 4. Download Artifacts

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/

  report:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: test-results
          path: downloaded-results/
          
      - run: ls -la downloaded-results/
```

### 5. Download All Artifacts

```yaml
jobs:
  merge:
    needs: [test-chromium, test-firefox, test-webkit]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: all-reports/
          pattern: report-*
          merge-multiple: true
```

### 6. Artifacts Between Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: npx playwright test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: ./deploy.sh
```

### 7. Sharded Test Reports

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: blob-report-${{ matrix.shard }}
          path: blob-report/

  merge-reports:
    needs: test
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      
      - uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true
          
      - run: npx playwright merge-reports --reporter html ./all-blob-reports
      
      - uses: actions/upload-artifact@v4
        with:
          name: merged-playwright-report
          path: playwright-report/
```

### 8. Artifact Retention

```yaml
# Default retention: 90 days
# Can be configured per artifact or repository-wide

- uses: actions/upload-artifact@v4
  with:
    name: important-report
    path: report/
    retention-days: 90  # Max 90 days

- uses: actions/upload-artifact@v4
  with:
    name: temp-files
    path: temp/
    retention-days: 1  # Delete after 1 day
```

### 9. Exclude Files

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: |
      test-results/
      !test-results/**/*.tmp
      !test-results/cache/
```

---

## 💻 Practice Exercises

1. Upload test reports
2. Download artifacts between jobs
3. Merge sharded reports
4. Configure retention
5. Handle upload failures

---

## ✅ Best Practices

- ✅ Use `if: always()` for reports
- ✅ Set appropriate retention
- ✅ Use meaningful artifact names
- ✅ Merge sharded reports
- ❌ Don't upload large files
- ❌ Avoid uploading node_modules

---

## 📝 Quick Reference

```yaml
# Upload
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: artifact-name
    path: path/to/files/
    retention-days: 30

# Download
- uses: actions/download-artifact@v4
  with:
    name: artifact-name
    path: destination/

# Download all
- uses: actions/download-artifact@v4
  with:
    pattern: report-*
    merge-multiple: true
```

