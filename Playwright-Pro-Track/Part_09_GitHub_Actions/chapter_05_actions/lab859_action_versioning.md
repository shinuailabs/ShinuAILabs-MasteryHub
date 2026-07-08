# Lab 859: Action Versioning

## LEARNING CONCEPT

Versioning and releasing GitHub Actions.

## EXERCISE

1. Implement semantic versioning
2. Create release workflow
3. Manage version tags

## SOLUTION

### Semantic Versioning

```
v1.0.0 - Major.Minor.Patch

Major: Breaking changes
Minor: New features (backward compatible)
Patch: Bug fixes (backward compatible)

Examples:
v1.0.0 - Initial release
v1.0.1 - Bug fix
v1.1.0 - New feature
v2.0.0 - Breaking change
```

### Version Tags

```bash
# Create version tag
git tag v1.0.0
git push origin v1.0.0

# Create major version tag
git tag -f v1
git push -f origin v1

# Update major version tag
git tag -f v1 v1.2.0
git push -f origin v1
```

### Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Get version
        id: version
        run: echo "version=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT
        
      - name: Build
        run: npm run build
        
      - name: Update major tag
        run: |
          VERSION=${{ steps.version.outputs.version }}
          MAJOR=$(echo $VERSION | cut -d. -f1)
          
          git config user.name github-actions
          git config user.email github-actions@github.com
          
          git tag -f $MAJOR
          git push -f origin $MAJOR
          
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

### Version in action.yml

```yaml
# action.yml
name: 'My Action'
description: 'My action description'
author: 'Your Name'

# No version field - use git tags instead

runs:
  using: 'node20'
  main: 'dist/index.js'
```

### Using Versions

```yaml
# Major version (recommended)
- uses: owner/action@v1

# Specific version
- uses: owner/action@v1.2.3

# Commit SHA (most secure)
- uses: owner/action@a1b2c3d4e5f6

# Branch (not recommended)
- uses: owner/action@main
```

### Changelog

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- New input `debug` for verbose logging
- Support for custom configuration file

### Changed
- Improved error messages

### Fixed
- Fixed issue with special characters in input

## [1.1.0] - 2024-01-01

### Added
- New output `duration`

## [1.0.0] - 2023-12-15

### Added
- Initial release
```

### Automated Versioning

```yaml
# .github/workflows/version.yml
name: Version

on:
  push:
    branches: [main]

jobs:
  version:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Get next version
        id: version
        uses: paulhatch/semantic-version@v5
        with:
          tag_prefix: 'v'
          major_pattern: 'BREAKING CHANGE:'
          minor_pattern: 'feat:'
          
      - name: Create tag
        if: steps.version.outputs.changed == 'true'
        run: |
          git tag v${{ steps.version.outputs.version }}
          git push origin v${{ steps.version.outputs.version }}
```

### Pre-release Versions

```yaml
# Release workflow with pre-release support
- name: Create Release
  uses: softprops/action-gh-release@v1
  with:
    prerelease: ${{ contains(github.ref, '-beta') || contains(github.ref, '-alpha') }}
    generate_release_notes: true
```

### Version Compatibility

```yaml
# action.yml - Document compatibility
name: 'My Action'
description: |
  My action description
  
  ## Compatibility
  - v2.x: Node.js 20+
  - v1.x: Node.js 18+
```

### Migration Guide

```markdown
# Migration Guide

## v1 to v2

### Breaking Changes

1. Input `old-name` renamed to `new-name`
2. Output format changed from string to JSON
3. Minimum Node.js version is now 20

### Migration Steps

```yaml
# Before (v1)
- uses: owner/action@v1
  with:
    old-name: value

# After (v2)
- uses: owner/action@v2
  with:
    new-name: value
```
```

### Complete Release Workflow

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - name: Get version info
        id: version
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          MAJOR=$(echo $VERSION | cut -d. -f1)
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "major=$MAJOR" >> $GITHUB_OUTPUT
          
      - name: Update major tag
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git tag -f ${{ steps.version.outputs.major }}
          git push -f origin ${{ steps.version.outputs.major }}
          
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
          files: |
            dist/*
```

### Best Practices

```
✅ Use semantic versioning
✅ Maintain major version tags
✅ Generate release notes
✅ Document breaking changes
✅ Provide migration guides
```

