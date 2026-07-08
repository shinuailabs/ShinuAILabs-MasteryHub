# Lab 855: Composite Actions

## LEARNING CONCEPT

Creating and using composite actions for reusable workflows.

## EXERCISE

1. Create composite actions
2. Handle inputs and outputs
3. Use conditional logic

## SOLUTION

### Basic Composite Action

```yaml
# .github/actions/greet/action.yml
name: 'Greet'
description: 'Greet a user'

inputs:
  name:
    description: 'Name to greet'
    required: true

runs:
  using: 'composite'
  steps:
    - run: echo "Hello, ${{ inputs.name }}!"
      shell: bash
```

### Using the Action

```yaml
jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/greet
        with:
          name: 'World'
```

### Action with Outputs

```yaml
# .github/actions/version/action.yml
name: 'Get Version'
description: 'Extract version from package.json'

outputs:
  version:
    description: 'The version number'
    value: ${{ steps.version.outputs.version }}
  major:
    description: 'Major version'
    value: ${{ steps.version.outputs.major }}

runs:
  using: 'composite'
  steps:
    - id: version
      run: |
        VERSION=$(node -p "require('./package.json').version")
        echo "version=$VERSION" >> $GITHUB_OUTPUT
        echo "major=$(echo $VERSION | cut -d. -f1)" >> $GITHUB_OUTPUT
      shell: bash
```

### Conditional Steps

```yaml
# .github/actions/setup/action.yml
name: 'Setup'
description: 'Setup project'

inputs:
  install-deps:
    description: 'Install dependencies'
    default: 'true'
  run-build:
    description: 'Run build'
    default: 'false'

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      if: inputs.install-deps == 'true'
      run: npm ci
      shell: bash
      
    - name: Build
      if: inputs.run-build == 'true'
      run: npm run build
      shell: bash
```

### Action with Environment

```yaml
# .github/actions/deploy/action.yml
name: 'Deploy'
description: 'Deploy to environment'

inputs:
  environment:
    required: true
  api-key:
    required: true

runs:
  using: 'composite'
  steps:
    - name: Deploy
      run: ./deploy.sh ${{ inputs.environment }}
      shell: bash
      env:
        API_KEY: ${{ inputs.api-key }}
        DEPLOY_ENV: ${{ inputs.environment }}
```

### Nested Actions

```yaml
# .github/actions/ci/action.yml
name: 'CI Pipeline'
description: 'Run full CI'

inputs:
  node-version:
    default: '20'

runs:
  using: 'composite'
  steps:
    - uses: actions/checkout@v4
    
    - uses: ./.github/actions/setup
      with:
        install-deps: 'true'
        
    - name: Lint
      run: npm run lint
      shell: bash
      
    - name: Test
      run: npm test
      shell: bash
```

### Action with Working Directory

```yaml
# .github/actions/build-package/action.yml
name: 'Build Package'
description: 'Build a package in monorepo'

inputs:
  package:
    description: 'Package name'
    required: true

runs:
  using: 'composite'
  steps:
    - name: Install
      working-directory: packages/${{ inputs.package }}
      run: npm ci
      shell: bash
      
    - name: Build
      working-directory: packages/${{ inputs.package }}
      run: npm run build
      shell: bash
```

### Error Handling

```yaml
# .github/actions/safe-deploy/action.yml
name: 'Safe Deploy'
description: 'Deploy with rollback'

inputs:
  environment:
    required: true

outputs:
  status:
    value: ${{ steps.deploy.outcome }}

runs:
  using: 'composite'
  steps:
    - name: Deploy
      id: deploy
      continue-on-error: true
      run: ./deploy.sh ${{ inputs.environment }}
      shell: bash
      
    - name: Rollback on failure
      if: steps.deploy.outcome == 'failure'
      run: ./rollback.sh ${{ inputs.environment }}
      shell: bash
```

### Complete Example

```yaml
# .github/actions/release/action.yml
name: 'Release'
description: 'Create a release'

inputs:
  version:
    description: 'Version to release'
    required: true
  prerelease:
    description: 'Is prerelease'
    default: 'false'
  token:
    description: 'GitHub token'
    required: true

outputs:
  release-url:
    description: 'URL of the release'
    value: ${{ steps.release.outputs.url }}

runs:
  using: 'composite'
  steps:
    - name: Validate version
      run: |
        if [[ ! "${{ inputs.version }}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+ ]]; then
          echo "Invalid version format"
          exit 1
        fi
      shell: bash
      
    - name: Build
      run: npm run build
      shell: bash
      
    - name: Create Release
      id: release
      uses: softprops/action-gh-release@v1
      with:
        tag_name: ${{ inputs.version }}
        prerelease: ${{ inputs.prerelease == 'true' }}
        files: dist/*
      env:
        GITHUB_TOKEN: ${{ inputs.token }}
```

### Best Practices

```
✅ Document all inputs/outputs
✅ Use sensible defaults
✅ Handle errors gracefully
✅ Keep actions focused
✅ Test actions thoroughly
```

