# Lab 884: Artifact Retention

## LEARNING CONCEPT

Managing artifact storage and retention policies.

## EXERCISE

1. Configure retention periods
2. Manage storage costs
3. Implement cleanup strategies

## SOLUTION

### Default Retention

```yaml
# Default retention is 90 days
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    # retention-days: 90 (default)
```

### Custom Retention

```yaml
# Short retention for temporary artifacts
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results/
    retention-days: 7

# Longer retention for releases
- uses: actions/upload-artifact@v4
  with:
    name: release
    path: dist/
    retention-days: 365
```

### Retention by Purpose

```yaml
steps:
  # Build artifacts - short retention
  - uses: actions/upload-artifact@v4
    with:
      name: build
      path: dist/
      retention-days: 7
      
  # Test results - medium retention
  - uses: actions/upload-artifact@v4
    with:
      name: test-results
      path: test-results/
      retention-days: 30
      
  # Coverage reports - longer retention
  - uses: actions/upload-artifact@v4
    with:
      name: coverage
      path: coverage/
      retention-days: 90
```

### Repository Settings

```
Configure default retention:
1. Go to repository Settings
2. Click "Actions" > "General"
3. Set "Artifact and log retention"
4. Choose 1-400 days
```

### Organization Settings

```
Configure org-wide retention:
1. Go to organization Settings
2. Click "Actions" > "General"
3. Set default retention for all repos
```

### Conditional Retention

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    retention-days: ${{ github.ref == 'refs/heads/main' && 90 || 7 }}
```

### Release Artifacts

```yaml
jobs:
  release:
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest
    
    steps:
      - run: npm run build
      
      # Long retention for releases
      - uses: actions/upload-artifact@v4
        with:
          name: release-${{ github.ref_name }}
          path: dist/
          retention-days: 365
```

### Cleanup Old Artifacts

```yaml
name: Cleanup Artifacts

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const artifacts = await github.rest.actions.listArtifactsForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              per_page: 100
            });
            
            const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
            
            for (const artifact of artifacts.data.artifacts) {
              const created = new Date(artifact.created_at).getTime();
              if (created < cutoff) {
                await github.rest.actions.deleteArtifact({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  artifact_id: artifact.id
                });
                console.log(`Deleted: ${artifact.name}`);
              }
            }
```

### Storage Monitoring

```yaml
- name: Check artifact size
  run: |
    SIZE=$(du -sh dist/ | cut -f1)
    echo "Artifact size: $SIZE"
    
    # Warn if too large
    SIZE_MB=$(du -sm dist/ | cut -f1)
    if [ $SIZE_MB -gt 100 ]; then
      echo "::warning::Artifact size exceeds 100MB"
    fi
```

### Compression for Storage

```yaml
- name: Compress before upload
  run: tar -czvf build.tar.gz dist/
  
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: build.tar.gz
    compression-level: 9
```

### Delete Artifact After Use

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
          
      - run: ./deploy.sh
      
      # Delete after successful deploy
      - uses: geekyeggo/delete-artifact@v4
        with:
          name: build
```

### Complete Example

```yaml
name: Build with Retention

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - name: Upload build
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: ${{ startsWith(github.ref, 'refs/tags/') && 365 || (github.ref == 'refs/heads/main' && 30 || 7) }}
          
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
          retention-days: 14
```

### Best Practices

```
✅ Set appropriate retention
✅ Shorter for PR artifacts
✅ Longer for releases
✅ Monitor storage usage
✅ Implement cleanup jobs
```

