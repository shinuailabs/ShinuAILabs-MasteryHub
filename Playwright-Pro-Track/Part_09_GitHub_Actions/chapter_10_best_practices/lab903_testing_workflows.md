# Lab 903: Testing Workflows

## LEARNING CONCEPT

Testing GitHub Actions workflows locally and in CI.

## EXERCISE

1. Test workflows locally
2. Validate workflow syntax
3. Implement workflow tests

## SOLUTION

### Local Testing with Act

```bash
# Install act
brew install act

# Run workflow
act push

# Run specific job
act -j build

# Run with secrets
act -s GITHUB_TOKEN=xxx

# Run with specific event
act pull_request
```

### Act Configuration

```yaml
# .actrc
-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
-P ubuntu-22.04=ghcr.io/catthehacker/ubuntu:act-22.04
```

### Event Payloads

```json
// .github/workflows/test-event.json
{
  "push": {
    "ref": "refs/heads/main",
    "repository": {
      "full_name": "owner/repo"
    }
  }
}
```

```bash
act push -e .github/workflows/test-event.json
```

### Workflow Linting

```bash
# Install actionlint
brew install actionlint

# Lint workflows
actionlint

# Lint specific file
actionlint .github/workflows/ci.yml
```

### YAML Validation

```yaml
# Use yamllint
# .yamllint.yml
extends: default
rules:
  line-length:
    max: 120
  truthy:
    check-keys: false
```

```bash
yamllint .github/workflows/
```

### Schema Validation

```yaml
# VS Code settings.json
{
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": ".github/workflows/*.yml"
  }
}
```

### Workflow Test Job

```yaml
name: Test Workflows

on:
  pull_request:
    paths:
      - '.github/workflows/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install actionlint
        run: |
          bash <(curl https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)
          
      - name: Lint workflows
        run: ./actionlint
```

### Dry Run

```yaml
name: Deploy

on:
  workflow_dispatch:
    inputs:
      dry-run:
        type: boolean
        default: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          if [ "${{ inputs.dry-run }}" == "true" ]; then
            echo "DRY RUN: Would deploy..."
            ./deploy.sh --dry-run
          else
            ./deploy.sh
          fi
```

### Test Reusable Workflows

```yaml
# .github/workflows/test-reusable.yml
name: Test Reusable Workflow

on:
  pull_request:
    paths:
      - '.github/workflows/reusable/**'

jobs:
  test:
    uses: ./.github/workflows/reusable/build.yml
    with:
      node-version: '20'
```

### Mock External Services

```yaml
steps:
  - name: Start mock server
    run: |
      npm install -g json-server
      json-server --watch db.json --port 3000 &
      sleep 5
      
  - name: Run tests
    run: npm test
    env:
      API_URL: http://localhost:3000
```

### Integration Tests

```yaml
name: Workflow Integration Test

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  test-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Trigger CI workflow
        run: |
          gh workflow run ci.yml
          sleep 30
          
      - name: Check workflow status
        run: |
          STATUS=$(gh run list --workflow=ci.yml --limit=1 --json status -q '.[0].status')
          if [ "$STATUS" != "completed" ]; then
            echo "Workflow not completed"
            exit 1
          fi
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Complete Example

```yaml
name: Validate Workflows

on:
  pull_request:
    paths:
      - '.github/**'
  push:
    branches: [main]
    paths:
      - '.github/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Lint YAML
        run: |
          pip install yamllint
          yamllint .github/workflows/
          
      - name: Lint Actions
        run: |
          bash <(curl https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)
          ./actionlint
          
  test-reusable:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Test build workflow
        uses: ./.github/workflows/reusable/build.yml
        with:
          node-version: '20'
          
  dry-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Dry run deploy
        run: ./deploy.sh --dry-run
```

### Best Practices

```
✅ Use act for local testing
✅ Lint workflows with actionlint
✅ Validate YAML syntax
✅ Test reusable workflows
✅ Implement dry-run mode
```

