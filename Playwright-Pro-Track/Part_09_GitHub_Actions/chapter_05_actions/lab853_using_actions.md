# Lab 853: Using Actions

## LEARNING CONCEPT

Using pre-built actions from the GitHub Marketplace.

## EXERCISE

1. Find and use marketplace actions
2. Configure action inputs
3. Use action outputs

## SOLUTION

### Basic Action Usage

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
```

### Action Sources

```yaml
steps:
  # From GitHub Marketplace
  - uses: actions/checkout@v4
  
  # From another repository
  - uses: owner/repo@v1
  
  # From a specific branch
  - uses: owner/repo@main
  
  # From a specific commit
  - uses: owner/repo@a1b2c3d4
  
  # From local path
  - uses: ./.github/actions/my-action
```

### Version Pinning

```yaml
steps:
  # ✅ Good: Major version
  - uses: actions/checkout@v4
  
  # ✅ Better: Specific version
  - uses: actions/checkout@v4.1.1
  
  # ✅ Best: Commit SHA
  - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
  
  # ❌ Bad: Branch name
  - uses: actions/checkout@main
```

### Action Inputs

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      fetch-depth: 0
      token: ${{ secrets.PAT }}
      
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      registry-url: 'https://npm.pkg.github.com'
```

### Action Outputs

```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: Get changed files
    id: changed
    uses: tj-actions/changed-files@v40
    
  - name: Use outputs
    run: |
      echo "Changed files: ${{ steps.changed.outputs.all_changed_files }}"
      echo "Any changed: ${{ steps.changed.outputs.any_changed }}"
```

### Common Actions

```yaml
steps:
  # Checkout code
  - uses: actions/checkout@v4
  
  # Setup languages
  - uses: actions/setup-node@v4
  - uses: actions/setup-python@v5
  - uses: actions/setup-java@v4
  - uses: actions/setup-go@v5
  
  # Caching
  - uses: actions/cache@v4
  
  # Artifacts
  - uses: actions/upload-artifact@v4
  - uses: actions/download-artifact@v4
  
  # GitHub API
  - uses: actions/github-script@v7
```

### Checkout Action

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      # Fetch all history
      fetch-depth: 0
      
      # Checkout specific ref
      ref: develop
      
      # Use PAT for private repos
      token: ${{ secrets.PAT }}
      
      # Checkout submodules
      submodules: recursive
      
      # Checkout to specific path
      path: my-repo
```

### Setup Node Action

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      node-version-file: '.nvmrc'
      cache: 'npm'
      registry-url: 'https://registry.npmjs.org'
```

### Cache Action

```yaml
steps:
  - uses: actions/cache@v4
    with:
      path: |
        ~/.npm
        node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

### Upload/Download Artifacts

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
          retention-days: 7
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
```

### GitHub Script Action

```yaml
steps:
  - uses: actions/github-script@v7
    with:
      script: |
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: 'Thanks for your contribution!'
        })
```

### Docker Actions

```yaml
steps:
  - uses: docker/setup-buildx-action@v3
  
  - uses: docker/login-action@v3
    with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}
      
  - uses: docker/build-push-action@v5
    with:
      push: true
      tags: ghcr.io/${{ github.repository }}:latest
```

### Best Practices

```
✅ Pin action versions
✅ Review action source code
✅ Use official actions when available
✅ Check action permissions
✅ Document action usage
```

