# Lab 842: Filter Patterns

## LEARNING CONCEPT

Using filter patterns for branches, tags, and paths.

## EXERCISE

1. Use glob patterns for filtering
2. Combine include and exclude patterns
3. Apply path filters effectively

## SOLUTION

### Branch Patterns

```yaml
on:
  push:
    branches:
      # Exact match
      - main
      - develop
      
      # Wildcard
      - 'feature/*'      # feature/login
      - 'release/**'     # release/v1/hotfix
      
      # Character set
      - 'release-[0-9]'  # release-1, release-2
```

### Branch Exclusion

```yaml
on:
  push:
    branches-ignore:
      - 'dependabot/**'
      - 'renovate/**'
      - 'temp-*'
```

### Tag Patterns

```yaml
on:
  push:
    tags:
      # Semantic versioning
      - 'v*'
      - 'v[0-9]+.[0-9]+.[0-9]+'
      - 'v[0-9]+.[0-9]+.[0-9]+-*'
      
      # Release tags
      - 'release-*'
      - 'prod-*'
```

### Tag Exclusion

```yaml
on:
  push:
    tags-ignore:
      - '*-beta'
      - '*-alpha'
      - '*-rc*'
```

### Path Patterns

```yaml
on:
  push:
    paths:
      # Specific files
      - 'package.json'
      - 'package-lock.json'
      
      # Directory
      - 'src/**'
      
      # File types
      - '**.js'
      - '**.ts'
      
      # Multiple directories
      - 'src/**'
      - 'tests/**'
      - 'lib/**'
```

### Path Exclusion

```yaml
on:
  push:
    paths-ignore:
      # Documentation
      - '**.md'
      - 'docs/**'
      
      # Config files
      - '.github/**'
      - '.vscode/**'
      
      # Assets
      - 'images/**'
      - '**.png'
      - '**.jpg'
```

### Glob Pattern Reference

```
*       - Matches any character except /
**      - Matches any character including /
?       - Matches single character
[abc]   - Matches a, b, or c
[a-z]   - Matches a through z
[0-9]   - Matches 0 through 9
!       - Negates pattern (in some contexts)
```

### Combined Patterns

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    paths:
      - 'src/**'
      - 'tests/**'
    paths-ignore:
      - '**.md'
```

### PR Path Filtering

```yaml
on:
  pull_request:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package*.json'
```

### Monorepo Patterns

```yaml
# Frontend changes only
on:
  push:
    paths:
      - 'packages/frontend/**'
      - 'packages/shared/**'

# Backend changes only
on:
  push:
    paths:
      - 'packages/backend/**'
      - 'packages/shared/**'
```

### Conditional Jobs with Paths

```yaml
on:
  push:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.filter.outputs.frontend }}
      backend: ${{ steps.filter.outputs.backend }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            frontend:
              - 'frontend/**'
            backend:
              - 'backend/**'
              
  build-frontend:
    needs: detect-changes
    if: needs.detect-changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building frontend"
      
  build-backend:
    needs: detect-changes
    if: needs.detect-changes.outputs.backend == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building backend"
```

### Complex Filtering

```yaml
on:
  push:
    branches:
      - main
      - 'release/v[0-9]+.[0-9]+'
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'
    paths:
      - 'src/**/*.ts'
      - 'src/**/*.tsx'
      - 'package*.json'
      - 'tsconfig*.json'
    paths-ignore:
      - 'src/**/*.test.ts'
      - 'src/**/*.spec.ts'
      - '**.md'
```

### Testing Patterns

```bash
# Test glob patterns locally
# Using bash
shopt -s globstar
ls src/**/*.ts

# Using find
find src -name "*.ts"
```

### Best Practices

```
✅ Use specific patterns
✅ Exclude documentation changes
✅ Consider monorepo structure
✅ Test patterns before deploying
✅ Document pattern intentions
```

