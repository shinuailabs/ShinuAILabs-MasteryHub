# Lab 854: Creating Actions

## LEARNING CONCEPT

Creating custom GitHub Actions.

## EXERCISE

1. Create composite actions
2. Create JavaScript actions
3. Create Docker actions

## SOLUTION

### Composite Action

```yaml
# .github/actions/setup-project/action.yml
name: 'Setup Project'
description: 'Setup Node.js project with dependencies'
author: 'Your Name'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'

outputs:
  cache-hit:
    description: 'Whether cache was hit'
    value: ${{ steps.cache.outputs.cache-hit }}

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        
    - name: Cache dependencies
      id: cache
      uses: actions/cache@v4
      with:
        path: node_modules
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        
    - name: Install dependencies
      if: steps.cache.outputs.cache-hit != 'true'
      run: npm ci
      shell: bash
```

### JavaScript Action

```yaml
# action.yml
name: 'Hello World'
description: 'Greet someone'
author: 'Your Name'

inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'World'

outputs:
  time:
    description: 'The time we greeted you'

runs:
  using: 'node20'
  main: 'dist/index.js'
```

```javascript
// index.js
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    
    const time = new Date().toTimeString();
    core.setOutput('time', time);
    
    // Get the JSON webhook payload
    const payload = JSON.stringify(github.context.payload, null, 2);
    console.log(`Event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

### Docker Action

```yaml
# action.yml
name: 'Docker Action'
description: 'Run action in Docker container'

inputs:
  myInput:
    description: 'Input description'
    required: true

runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.myInput }}
```

```dockerfile
# Dockerfile
FROM alpine:3.18

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

```bash
#!/bin/sh
# entrypoint.sh
echo "Input: $1"
echo "result=success" >> $GITHUB_OUTPUT
```

### Action Metadata

```yaml
# action.yml
name: 'My Custom Action'
description: 'A detailed description of what this action does'
author: 'Your Name <email@example.com>'

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
  using: 'composite'
  steps:
    - run: echo "Running action"
      shell: bash
```

### Action with Multiple Steps

```yaml
# .github/actions/deploy/action.yml
name: 'Deploy'
description: 'Deploy application'

inputs:
  environment:
    required: true
  version:
    required: true
  token:
    required: true

outputs:
  url:
    value: ${{ steps.deploy.outputs.url }}

runs:
  using: 'composite'
  steps:
    - name: Validate inputs
      run: |
        if [ -z "${{ inputs.environment }}" ]; then
          echo "Environment is required"
          exit 1
        fi
      shell: bash
      
    - name: Deploy
      id: deploy
      run: |
        echo "Deploying ${{ inputs.version }} to ${{ inputs.environment }}"
        echo "url=https://${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT
      shell: bash
      env:
        DEPLOY_TOKEN: ${{ inputs.token }}
```

### Testing Actions Locally

```bash
# Using act
act -j test

# Test composite action
cd .github/actions/my-action
# Create test workflow
```

### Publishing Action

```yaml
# Release workflow
name: Release Action

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

### Action Repository Structure

```
my-action/
├── action.yml
├── README.md
├── LICENSE
├── src/
│   └── index.js
├── dist/
│   └── index.js
├── package.json
└── .github/
    └── workflows/
        └── test.yml
```

### Best Practices

```
✅ Clear documentation
✅ Semantic versioning
✅ Input validation
✅ Error handling
✅ Test your action
✅ Use branding
```

