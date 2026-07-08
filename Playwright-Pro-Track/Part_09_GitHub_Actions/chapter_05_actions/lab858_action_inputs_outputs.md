# Lab 858: Action Inputs and Outputs

## LEARNING CONCEPT

Managing inputs and outputs in GitHub Actions.

## EXERCISE

1. Define action inputs
2. Handle outputs
3. Validate inputs

## SOLUTION

### Input Definition

```yaml
# action.yml
inputs:
  # Required input
  name:
    description: 'Name to greet'
    required: true
    
  # Optional with default
  greeting:
    description: 'Greeting message'
    required: false
    default: 'Hello'
    
  # Boolean input
  uppercase:
    description: 'Use uppercase'
    required: false
    default: 'false'
    
  # Sensitive input
  token:
    description: 'GitHub token'
    required: true
```

### Output Definition

```yaml
# action.yml
outputs:
  message:
    description: 'The greeting message'
    value: ${{ steps.greet.outputs.message }}
    
  timestamp:
    description: 'When the greeting was made'
    value: ${{ steps.greet.outputs.timestamp }}
```

### Composite Action I/O

```yaml
# action.yml
name: 'Greet Action'

inputs:
  name:
    required: true
  greeting:
    default: 'Hello'

outputs:
  message:
    value: ${{ steps.greet.outputs.message }}

runs:
  using: 'composite'
  steps:
    - id: greet
      run: |
        MESSAGE="${{ inputs.greeting }}, ${{ inputs.name }}!"
        echo "message=$MESSAGE" >> $GITHUB_OUTPUT
      shell: bash
```

### JavaScript Action I/O

```javascript
const core = require('@actions/core');

async function run() {
  // Get inputs
  const name = core.getInput('name', { required: true });
  const greeting = core.getInput('greeting') || 'Hello';
  const uppercase = core.getBooleanInput('uppercase');
  
  // Process
  let message = `${greeting}, ${name}!`;
  if (uppercase) {
    message = message.toUpperCase();
  }
  
  // Set outputs
  core.setOutput('message', message);
  core.setOutput('timestamp', new Date().toISOString());
}

run();
```

### Input Validation

```yaml
# Composite action validation
runs:
  using: 'composite'
  steps:
    - name: Validate inputs
      run: |
        if [ -z "${{ inputs.name }}" ]; then
          echo "Error: name is required"
          exit 1
        fi
        
        if [[ ! "${{ inputs.version }}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
          echo "Error: Invalid version format"
          exit 1
        fi
      shell: bash
```

```javascript
// JavaScript validation
const core = require('@actions/core');

function validateInputs() {
  const name = core.getInput('name');
  if (!name) {
    throw new Error('name is required');
  }
  
  const version = core.getInput('version');
  if (version && !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error('Invalid version format');
  }
  
  return { name, version };
}
```

### Multi-line Inputs

```yaml
# Using action
- uses: ./.github/actions/my-action
  with:
    config: |
      key1: value1
      key2: value2
      key3: value3
```

```javascript
// Handling multi-line input
const config = core.getMultilineInput('config');
// Returns array of lines
```

### JSON Inputs

```yaml
# Using action
- uses: ./.github/actions/my-action
  with:
    matrix: '{"node":["18","20"],"os":["ubuntu","windows"]}'
```

```javascript
// Parsing JSON input
const matrixStr = core.getInput('matrix');
const matrix = JSON.parse(matrixStr);
```

### Sensitive Outputs

```javascript
// Mask sensitive output
const token = generateToken();
core.setSecret(token);
core.setOutput('token', token);
```

### Output to Summary

```javascript
const core = require('@actions/core');

// Add to job summary
await core.summary
  .addHeading('Results')
  .addTable([
    ['Name', 'Value'],
    ['Status', 'Success'],
    ['Duration', '2m 30s']
  ])
  .write();
```

### Passing Outputs Between Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.action.outputs.version }}
    steps:
      - id: action
        uses: ./.github/actions/version
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Version: ${{ needs.build.outputs.version }}"
```

### Complete Example

```yaml
# action.yml
name: 'Build Info'
description: 'Get build information'

inputs:
  path:
    description: 'Path to package.json'
    required: false
    default: '.'
  include-git:
    description: 'Include git info'
    required: false
    default: 'true'

outputs:
  version:
    description: 'Package version'
    value: ${{ steps.info.outputs.version }}
  name:
    description: 'Package name'
    value: ${{ steps.info.outputs.name }}
  sha:
    description: 'Git SHA'
    value: ${{ steps.info.outputs.sha }}

runs:
  using: 'composite'
  steps:
    - id: info
      run: |
        cd "${{ inputs.path }}"
        
        VERSION=$(node -p "require('./package.json').version")
        NAME=$(node -p "require('./package.json').name")
        
        echo "version=$VERSION" >> $GITHUB_OUTPUT
        echo "name=$NAME" >> $GITHUB_OUTPUT
        
        if [ "${{ inputs.include-git }}" = "true" ]; then
          SHA=$(git rev-parse --short HEAD)
          echo "sha=$SHA" >> $GITHUB_OUTPUT
        fi
      shell: bash
```

### Best Practices

```
✅ Document all inputs/outputs
✅ Validate required inputs
✅ Use sensible defaults
✅ Mask sensitive data
✅ Handle missing inputs gracefully
```

