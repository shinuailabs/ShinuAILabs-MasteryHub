# Lab 880: Upload Artifacts

## LEARNING CONCEPT

Uploading build artifacts in GitHub Actions.

## EXERCISE

1. Upload build outputs
2. Configure artifact settings
3. Handle multiple artifacts

## SOLUTION

### Basic Upload

```yaml
steps:
  - run: npm run build
  
  - uses: actions/upload-artifact@v4
    with:
      name: build
      path: dist/
```

### Upload Multiple Paths

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: outputs
    path: |
      dist/
      coverage/
      test-results/
```

### Exclude Files

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: |
      dist/
      !dist/**/*.map
      !dist/**/*.test.js
```

### Retention Period

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    retention-days: 7  # Default is 90
```

### Compression Level

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    compression-level: 9  # 0-9, higher = smaller
```

### If No Files Found

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: logs
    path: logs/
    if-no-files-found: warn  # error, warn, ignore
```

### Upload Single File

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: binary
    path: target/release/myapp
```

### Upload with Overwrite

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    overwrite: true  # Replace existing artifact
```

### Multiple Artifacts

```yaml
steps:
  - run: npm run build
  
  - uses: actions/upload-artifact@v4
    with:
      name: frontend
      path: packages/frontend/dist/
      
  - uses: actions/upload-artifact@v4
    with:
      name: backend
      path: packages/backend/dist/
```

### Matrix Artifacts

```yaml
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ matrix.os }}
          path: dist/
```

### Conditional Upload

```yaml
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: failure-logs
    path: |
      logs/
      screenshots/
```

### Upload Test Results

```yaml
- run: npm test
  continue-on-error: true
  
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results
    path: |
      test-results/
      coverage/
```

### Upload Screenshots

```yaml
- run: npm run test:e2e
  continue-on-error: true
  
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: screenshots
    path: |
      screenshots/
      videos/
    retention-days: 3
```

### Complete Example

```yaml
name: Build and Upload

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7
          
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 30
          
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
          if-no-files-found: ignore
```

### Best Practices

```
✅ Use descriptive names
✅ Set appropriate retention
✅ Exclude unnecessary files
✅ Upload on failure for debugging
✅ Use compression for large artifacts
```

