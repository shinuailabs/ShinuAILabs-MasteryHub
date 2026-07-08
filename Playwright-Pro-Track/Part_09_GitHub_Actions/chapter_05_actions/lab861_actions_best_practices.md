# Lab 861: Actions Best Practices

## LEARNING CONCEPT

Best practices for creating and using GitHub Actions.

## EXERCISE

1. Review action development best practices
2. Apply security best practices
3. Optimize action performance

## SOLUTION

### Action Development

```yaml
# Good action structure
name: 'Descriptive Action Name'
description: 'Clear description of what the action does'
author: 'Your Name'

branding:
  icon: 'check-circle'
  color: 'green'

inputs:
  required-input:
    description: 'This input is required'
    required: true
  optional-input:
    description: 'This input is optional'
    required: false
    default: 'default-value'

outputs:
  result:
    description: 'The result of the action'

runs:
  using: 'node20'
  main: 'dist/index.js'
```

### Input Validation

```javascript
const core = require('@actions/core');

function validateInputs() {
  const name = core.getInput('name', { required: true });
  
  if (!name || name.trim() === '') {
    throw new Error('name cannot be empty');
  }
  
  const version = core.getInput('version');
  if (version && !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('version must be in format x.y.z');
  }
  
  return { name, version };
}
```

### Error Handling

```javascript
const core = require('@actions/core');

async function run() {
  try {
    // Main logic
    await doWork();
    
  } catch (error) {
    // Log error details
    core.error(`Error: ${error.message}`);
    core.debug(error.stack);
    
    // Fail the action
    core.setFailed(error.message);
  }
}
```

### Logging Best Practices

```javascript
const core = require('@actions/core');

// Different log levels
core.debug('Debug information');
core.info('General information');
core.notice('Important notice');
core.warning('Warning message');
core.error('Error message');

// Grouped output
core.startGroup('Installing dependencies');
// ... installation logs
core.endGroup();

// Mask sensitive data
core.setSecret(sensitiveValue);
```

### Security Best Practices

```yaml
# Using actions securely
steps:
  # ✅ Pin to commit SHA
  - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
  
  # ✅ Pin to specific version
  - uses: actions/setup-node@v4.0.0
  
  # ❌ Avoid using branches
  - uses: actions/checkout@main
```

### Minimal Permissions

```yaml
# Request only needed permissions
permissions:
  contents: read
  issues: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### Performance Optimization

```yaml
# Use caching
steps:
  - uses: actions/cache@v4
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
  - run: npm ci
    if: steps.cache.outputs.cache-hit != 'true'
```

### Testing Actions

```yaml
# .github/workflows/test.yml
name: Test Action

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        id: test
        with:
          name: 'Test'
      - run: |
          if [ "${{ steps.test.outputs.result }}" != "expected" ]; then
            exit 1
          fi
```

### Documentation

```markdown
# Action Name

## Description
Clear description of what the action does.

## Inputs
| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `input1` | Description | Yes | - |

## Outputs
| Name | Description |
|------|-------------|
| `output1` | Description |

## Example Usage
```yaml
- uses: owner/action@v1
  with:
    input1: value
```

## Troubleshooting
Common issues and solutions.
```

### Versioning Strategy

```bash
# Semantic versioning
v1.0.0  # Initial release
v1.0.1  # Bug fix
v1.1.0  # New feature
v2.0.0  # Breaking change

# Maintain major version tags
git tag -f v1 v1.2.3
git push -f origin v1
```

### Checklist

```
Development:
□ Clear name and description
□ Input validation
□ Error handling
□ Proper logging
□ Unit tests
□ Integration tests

Security:
□ Minimal permissions
□ Input sanitization
□ Secret handling
□ Dependency updates

Documentation:
□ README with examples
□ Input/output documentation
□ Changelog
□ Migration guides

Publishing:
□ Semantic versioning
□ Release notes
□ Major version tags
□ Marketplace listing
```

### Anti-Patterns

```yaml
# ❌ Don't hardcode secrets
env:
  API_KEY: "abc123"

# ✅ Use secrets
env:
  API_KEY: ${{ secrets.API_KEY }}

# ❌ Don't use latest
- uses: actions/checkout@latest

# ✅ Pin versions
- uses: actions/checkout@v4

# ❌ Don't ignore errors
- run: ./script.sh || true

# ✅ Handle errors properly
- run: ./script.sh
  continue-on-error: true
- if: failure()
  run: ./handle-error.sh
```

### Best Practices Summary

```
✅ Clear documentation
✅ Input validation
✅ Error handling
✅ Proper logging
✅ Security first
✅ Performance optimization
✅ Comprehensive testing
✅ Semantic versioning
✅ Regular maintenance
```

