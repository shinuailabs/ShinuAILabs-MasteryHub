# Lab 835: Push Trigger

## LEARNING CONCEPT

Triggering workflows on push events.

## EXERCISE

1. Configure push triggers
2. Filter by branches and paths
3. Handle tag pushes

## SOLUTION

### Basic Push Trigger

```yaml
name: CI

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### Branch Filtering

```yaml
on:
  push:
    branches:
      - main
      - develop
      - 'release/**'
      - 'feature/*'
```

### Branch Exclusion

```yaml
on:
  push:
    branches-ignore:
      - 'dependabot/**'
      - 'renovate/**'
```

### Path Filtering

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - 'package-lock.json'
```

### Path Exclusion

```yaml
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
      - '.github/**'
```

### Combined Filters

```yaml
on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'src/**'
      - 'tests/**'
    paths-ignore:
      - '**.md'
```

### Tag Triggers

```yaml
on:
  push:
    tags:
      - 'v*'
      - 'release-*'
```

### Tag Pattern Examples

```yaml
on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'  # v1.0.0
      - 'v[0-9]+.[0-9]+.[0-9]+-*'  # v1.0.0-beta
```

### Branches and Tags Together

```yaml
on:
  push:
    branches:
      - main
    tags:
      - 'v*'
```

### Accessing Push Data

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Push info
        run: |
          echo "Ref: ${{ github.ref }}"
          echo "SHA: ${{ github.sha }}"
          echo "Actor: ${{ github.actor }}"
          echo "Pusher: ${{ github.event.pusher.name }}"
          echo "Commit message: ${{ github.event.head_commit.message }}"
```

### Commit Information

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Commit details
        run: |
          echo "Commits: ${{ toJson(github.event.commits) }}"
          echo "Head commit: ${{ github.event.head_commit.id }}"
          echo "Message: ${{ github.event.head_commit.message }}"
          echo "Author: ${{ github.event.head_commit.author.name }}"
```

### Skip CI

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    steps:
      - run: npm test
```

### Conditional on Branch

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Force Push Detection

```yaml
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check force push
        if: github.event.forced
        run: echo "This was a force push!"
```

### Complete Example

```yaml
name: CI

on:
  push:
    branches:
      - main
      - develop
      - 'feature/**'
    paths:
      - 'src/**'
      - 'tests/**'
      - 'package*.json'
    paths-ignore:
      - '**.md'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Show push info
        run: |
          echo "Branch: ${{ github.ref_name }}"
          echo "Commit: ${{ github.sha }}"
          
      - run: npm ci
      - run: npm test
      
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
```

### Best Practices

```
✅ Filter branches appropriately
✅ Use path filters to reduce runs
✅ Handle tags separately
✅ Skip CI when appropriate
✅ Document trigger conditions
```

