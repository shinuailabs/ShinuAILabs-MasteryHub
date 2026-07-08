# Lab 860: Marketplace Publishing

## LEARNING CONCEPT

Publishing actions to the GitHub Marketplace.

## EXERCISE

1. Prepare action for publishing
2. Create marketplace listing
3. Maintain published action

## SOLUTION

### Requirements

```
To publish to Marketplace:
1. Action must be in a public repository
2. Repository must contain only one action
3. action.yml must be in root directory
4. Must have name, description, and author
5. Must have branding (icon and color)
```

### Action Metadata

```yaml
# action.yml
name: 'My Awesome Action'
description: 'A detailed description of what this action does and why it is useful'
author: 'Your Name <email@example.com>'

branding:
  icon: 'check-circle'
  color: 'green'

inputs:
  name:
    description: 'Name to greet'
    required: true
    default: 'World'

outputs:
  greeting:
    description: 'The greeting message'

runs:
  using: 'node20'
  main: 'dist/index.js'
```

### Branding Options

```yaml
# Available icons (Feather icons)
branding:
  icon: 'activity'      # or 'alert-circle', 'archive', 'award'
                        # 'bell', 'book', 'box', 'briefcase'
                        # 'calendar', 'check', 'check-circle'
                        # 'cloud', 'code', 'coffee', 'cpu'
                        # 'database', 'download', 'edit'
                        # 'eye', 'file', 'folder', 'gift'
                        # 'globe', 'heart', 'home', 'image'
                        # 'inbox', 'key', 'layers', 'link'
                        # 'lock', 'mail', 'map', 'message-circle'
                        # 'package', 'play', 'plus', 'power'
                        # 'refresh-cw', 'search', 'send', 'server'
                        # 'settings', 'shield', 'star', 'tag'
                        # 'terminal', 'tool', 'trash', 'truck'
                        # 'upload', 'user', 'zap'
  
  # Available colors
  color: 'white'        # or 'yellow', 'blue', 'green'
                        # 'orange', 'red', 'purple', 'gray-dark'
```

### README Template

```markdown
# My Awesome Action

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-My%20Action-blue)](https://github.com/marketplace/actions/my-awesome-action)
[![GitHub release](https://img.shields.io/github/release/owner/my-action.svg)](https://github.com/owner/my-action/releases)

A detailed description of what this action does.

## Usage

```yaml
- uses: owner/my-action@v1
  with:
    name: 'World'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `name` | Name to greet | Yes | `World` |

## Outputs

| Output | Description |
|--------|-------------|
| `greeting` | The greeting message |

## Example

```yaml
name: Greet

on: push

jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - uses: owner/my-action@v1
        id: greet
        with:
          name: 'GitHub'
          
      - run: echo "${{ steps.greet.outputs.greeting }}"
```

## License

MIT
```

### Publishing Steps

```
1. Go to your action repository
2. Click "Draft a release"
3. Create a new tag (e.g., v1.0.0)
4. Check "Publish this Action to the GitHub Marketplace"
5. Select primary and secondary categories
6. Fill in release notes
7. Click "Publish release"
```

### Categories

```
Available categories:
- Code quality
- Code review
- Continuous integration
- Dependency management
- Deployment
- IDEs
- Learning
- Localization
- Mobile
- Monitoring
- Project management
- Publishing
- Security
- Support
- Testing
- Utilities
```

### Verification Badge

```markdown
# To get verified badge:
1. Action must be from a verified organization
2. Organization must have verified domain
3. Action must meet quality guidelines
```

### Update Workflow

```yaml
# .github/workflows/release.yml
name: Release to Marketplace

on:
  release:
    types: [published]

jobs:
  update-tags:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update major version tag
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          MAJOR=$(echo $VERSION | cut -d. -f1)
          
          git config user.name github-actions
          git config user.email github-actions@github.com
          
          git tag -f $MAJOR
          git push -f origin $MAJOR
```

### Quality Guidelines

```
Marketplace quality guidelines:
✅ Clear, descriptive name
✅ Detailed description
✅ Comprehensive README
✅ Input/output documentation
✅ Usage examples
✅ Proper error handling
✅ Semantic versioning
✅ Regular maintenance
```

### Maintenance

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      
  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        with:
          name: 'Test'
```

### Best Practices

```
✅ Unique, descriptive name
✅ Comprehensive documentation
✅ Regular updates
✅ Respond to issues
✅ Semantic versioning
✅ Test before release
```

