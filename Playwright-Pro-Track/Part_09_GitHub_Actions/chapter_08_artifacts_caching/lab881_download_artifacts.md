# Lab 881: Download Artifacts

## LEARNING CONCEPT

Downloading artifacts in GitHub Actions workflows.

## EXERCISE

1. Download artifacts between jobs
2. Download from other workflows
3. Handle artifact patterns

## SOLUTION

### Basic Download

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          
      - run: ls -la  # Files in current directory
```

### Download to Specific Path

```yaml
- uses: actions/download-artifact@v4
  with:
    name: build
    path: dist/
    
- run: ls -la dist/
```

### Download All Artifacts

```yaml
- uses: actions/download-artifact@v4
  # No name = download all

- run: |
    ls -la
    # Each artifact in its own directory
```

### Download with Pattern

```yaml
- uses: actions/download-artifact@v4
  with:
    pattern: build-*
    path: builds/
    
- run: ls -la builds/
```

### Merge Multiple Artifacts

```yaml
- uses: actions/download-artifact@v4
  with:
    pattern: coverage-*
    path: coverage/
    merge-multiple: true
    
- run: ls -la coverage/
```

### Download from Matrix Jobs

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
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          pattern: build-*
          path: builds/
          merge-multiple: true
```

### Download from Other Workflow

```yaml
- uses: actions/download-artifact@v4
  with:
    name: build
    github-token: ${{ secrets.GITHUB_TOKEN }}
    repository: ${{ github.repository }}
    run-id: ${{ github.event.workflow_run.id }}
```

### Workflow Run Trigger

```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["Build"]
    types: [completed]

jobs:
  deploy:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
```

### Check Artifact Exists

```yaml
- name: Download artifact
  id: download
  uses: actions/download-artifact@v4
  with:
    name: optional-artifact
  continue-on-error: true
  
- name: Use artifact
  if: steps.download.outcome == 'success'
  run: ./process-artifact.sh
```

### List Downloaded Files

```yaml
- uses: actions/download-artifact@v4
  with:
    name: build
    path: dist/
    
- name: List files
  run: |
    echo "Downloaded files:"
    find dist -type f
```

### Complete Example

```yaml
name: Build and Deploy

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
          
      - run: npm ci
      - run: npm test
      
  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
          
      - name: Deploy
        run: |
          echo "Deploying files:"
          ls -la dist/
          ./deploy.sh
```

### Best Practices

```
✅ Specify download path
✅ Handle missing artifacts
✅ Use patterns for matrix
✅ Merge when appropriate
✅ Verify downloaded files
```

