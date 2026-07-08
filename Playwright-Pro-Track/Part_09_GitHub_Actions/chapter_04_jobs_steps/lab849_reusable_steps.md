# Lab 849: Reusable Steps

## LEARNING CONCEPT

Creating reusable step patterns and composite actions.

## EXERCISE

1. Create composite actions
2. Use YAML anchors
3. Share steps across workflows

## SOLUTION

### Composite Action

```yaml
# .github/actions/setup-node-project/action.yml
name: 'Setup Node Project'
description: 'Setup Node.js and install dependencies'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'

runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4
      
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
        
    - run: npm ci
      shell: bash
```

### Using Composite Action

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup-node-project
        with:
          node-version: '20'
          
      - run: npm test
      - run: npm run build
```

### Composite Action with Outputs

```yaml
# .github/actions/build/action.yml
name: 'Build'
description: 'Build the application'

outputs:
  version:
    description: 'Built version'
    value: ${{ steps.version.outputs.version }}
  artifact:
    description: 'Artifact name'
    value: ${{ steps.build.outputs.artifact }}

runs:
  using: 'composite'
  steps:
    - id: version
      run: echo "version=$(cat VERSION)" >> $GITHUB_OUTPUT
      shell: bash
      
    - run: npm run build
      shell: bash
      
    - id: build
      run: echo "artifact=build-${{ steps.version.outputs.version }}" >> $GITHUB_OUTPUT
      shell: bash
```

### YAML Anchors (Limited Support)

```yaml
# Note: GitHub Actions has limited YAML anchor support
# Use composite actions instead for reusability

# This works for simple cases:
env: &common-env
  CI: true
  NODE_ENV: test

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      <<: *common-env
      EXTRA_VAR: value
```

### Reusable Workflow for Steps

```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test

on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'
          
      - run: npm ci
      - run: npm test
```

### Shared Setup Pattern

```yaml
# .github/actions/setup/action.yml
name: 'Project Setup'
description: 'Common setup steps'

inputs:
  install-deps:
    description: 'Install dependencies'
    default: 'true'

runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - if: inputs.install-deps == 'true'
      run: npm ci
      shell: bash
```

### Deploy Action

```yaml
# .github/actions/deploy/action.yml
name: 'Deploy'
description: 'Deploy to environment'

inputs:
  environment:
    description: 'Target environment'
    required: true
  version:
    description: 'Version to deploy'
    required: true

runs:
  using: 'composite'
  steps:
    - run: |
        echo "Deploying ${{ inputs.version }} to ${{ inputs.environment }}"
        ./scripts/deploy.sh ${{ inputs.environment }} ${{ inputs.version }}
      shell: bash
```

### Notification Action

```yaml
# .github/actions/notify/action.yml
name: 'Notify'
description: 'Send notification'

inputs:
  status:
    description: 'Build status'
    required: true
  channel:
    description: 'Notification channel'
    default: 'builds'

runs:
  using: 'composite'
  steps:
    - run: |
        curl -X POST "$SLACK_WEBHOOK" \
          -H "Content-Type: application/json" \
          -d '{"channel":"${{ inputs.channel }}","text":"Build ${{ inputs.status }}"}'
      shell: bash
      env:
        SLACK_WEBHOOK: ${{ env.SLACK_WEBHOOK }}
```

### Using Multiple Actions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup
        with:
          install-deps: 'true'
          
      - run: npm test
      - run: npm run build
      
      - uses: ./.github/actions/deploy
        with:
          environment: staging
          version: ${{ github.sha }}
          
      - uses: ./.github/actions/notify
        if: always()
        with:
          status: ${{ job.status }}
```

### Complete Composite Action

```yaml
# .github/actions/ci/action.yml
name: 'CI Pipeline'
description: 'Run full CI pipeline'

inputs:
  node-version:
    default: '20'
  run-tests:
    default: 'true'
  run-build:
    default: 'true'

outputs:
  test-result:
    value: ${{ steps.test.outcome }}
  build-result:
    value: ${{ steps.build.outcome }}

runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
        
    - run: npm ci
      shell: bash
      
    - id: test
      if: inputs.run-tests == 'true'
      run: npm test
      shell: bash
      
    - id: build
      if: inputs.run-build == 'true'
      run: npm run build
      shell: bash
```

### Best Practices

```
✅ Create focused, single-purpose actions
✅ Document inputs and outputs
✅ Use sensible defaults
✅ Handle errors gracefully
✅ Version your actions
```

