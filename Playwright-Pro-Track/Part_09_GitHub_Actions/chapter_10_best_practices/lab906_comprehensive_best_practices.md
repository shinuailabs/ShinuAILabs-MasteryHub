# Lab 906: Comprehensive Best Practices

## LEARNING CONCEPT

Complete best practices guide for GitHub Actions.

## EXERCISE

1. Review all best practices
2. Create workflow checklist
3. Apply comprehensive guidelines

## SOLUTION

### Workflow Design

```yaml
# ✅ Good workflow structure
name: CI/CD Pipeline

on:
  push:
    branches: [main]
    paths-ignore:
      - '**.md'
  pull_request:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

env:
  NODE_VERSION: '20'

jobs:
  # Jobs defined here
```

### Security Checklist

```
□ Minimal permissions
□ Pin action versions to SHA
□ Use environment secrets
□ Validate inputs
□ Prevent script injection
□ Use OIDC for cloud auth
□ Review third-party actions
□ Protect production environment
```

### Performance Checklist

```
□ Cache dependencies
□ Use path filters
□ Run jobs in parallel
□ Shard large test suites
□ Set appropriate timeouts
□ Use concurrency control
□ Minimize checkout depth
□ Optimize Docker builds
```

### Reliability Checklist

```
□ Handle errors gracefully
□ Implement retry logic
□ Use continue-on-error wisely
□ Always cleanup resources
□ Test workflows locally
□ Validate YAML syntax
□ Monitor workflow health
□ Set up failure alerts
```

### Maintainability Checklist

```
□ Use descriptive names
□ Document workflows
□ Create reusable components
□ Keep workflows focused
□ Use consistent patterns
□ Maintain changelog
□ Review regularly
```

### Complete CI Template

```yaml
name: CI

on:
  push:
    branches: [main]
    paths-ignore: ['**.md', 'docs/**']
  pull_request:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --shard=${{ matrix.shard }}/2
      
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7
```

### Complete CD Template

```yaml
name: CD

on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write

concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: ${{ vars.STAGING_URL }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: ./deploy.sh staging
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ vars.PRODUCTION_URL }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: ./deploy.sh production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Anti-Patterns to Avoid

```yaml
# ❌ No permissions specified
# ❌ Using @main instead of SHA
# ❌ No concurrency control
# ❌ No caching
# ❌ No path filters
# ❌ Hardcoded secrets
# ❌ No error handling
# ❌ No documentation
```

### Quick Reference

```
Triggers:
  push, pull_request, workflow_dispatch,
  schedule, workflow_run, release

Contexts:
  github, env, job, steps, runner,
  secrets, vars, needs, inputs

Expressions:
  ${{ expression }}
  contains(), startsWith(), endsWith()
  toJson(), fromJson()
  success(), failure(), always(), cancelled()

Common Actions:
  actions/checkout@v4
  actions/setup-node@v4
  actions/cache@v4
  actions/upload-artifact@v4
  actions/download-artifact@v4
```

### Final Checklist

```
Before Merging:
□ Workflow tested locally
□ YAML validated
□ Permissions minimized
□ Actions pinned
□ Secrets configured
□ Documentation updated

After Deployment:
□ Workflow runs successfully
□ Metrics collected
□ Alerts configured
□ Team notified
```

### Best Practices Summary

```
Security:
✅ Minimal permissions
✅ Pin actions to SHA
✅ Use OIDC authentication
✅ Protect environments

Performance:
✅ Cache dependencies
✅ Parallel execution
✅ Path filters
✅ Concurrency control

Reliability:
✅ Error handling
✅ Retry logic
✅ Health checks
✅ Monitoring

Maintainability:
✅ Clear naming
✅ Documentation
✅ Reusable components
✅ Regular reviews
```

### Resources

```
Documentation:
- https://docs.github.com/actions

Tools:
- act (local testing)
- actionlint (linting)

Community:
- GitHub Actions Marketplace
- awesome-actions repository
```

