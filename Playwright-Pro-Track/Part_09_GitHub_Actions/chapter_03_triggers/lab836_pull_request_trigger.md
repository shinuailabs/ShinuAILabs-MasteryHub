# Lab 836: Pull Request Trigger

## LEARNING CONCEPT

Triggering workflows on pull request events.

## EXERCISE

1. Configure PR triggers
2. Filter by activity types
3. Handle PR from forks

## SOLUTION

### Basic PR Trigger

```yaml
name: PR Check

on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### Activity Types

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - closed
      - edited
      - labeled
      - unlabeled
      - ready_for_review
      - converted_to_draft
```

### Common Activity Types

```yaml
# Default (if types not specified)
on:
  pull_request:
    types: [opened, synchronize, reopened]

# For CI
on:
  pull_request:
    types: [opened, synchronize]

# For deployment
on:
  pull_request:
    types: [closed]
```

### Branch Filtering

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
      - 'release/**'
```

### Path Filtering

```yaml
on:
  pull_request:
    paths:
      - 'src/**'
      - 'tests/**'
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### Accessing PR Data

```yaml
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: PR info
        run: |
          echo "PR Number: ${{ github.event.pull_request.number }}"
          echo "PR Title: ${{ github.event.pull_request.title }}"
          echo "PR Author: ${{ github.event.pull_request.user.login }}"
          echo "Source: ${{ github.head_ref }}"
          echo "Target: ${{ github.base_ref }}"
          echo "Action: ${{ github.event.action }}"
```

### Checkout PR Code

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
```

### PR Labels

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.labels.*.name, 'deploy')
    steps:
      - run: ./deploy-preview.sh
```

### Draft PR Handling

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    # Skip draft PRs
    if: github.event.pull_request.draft == false
    steps:
      - run: npm test
```

### Merged PR

```yaml
on:
  pull_request:
    types: [closed]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true
    steps:
      - run: ./deploy.sh
```

### PR from Forks

```yaml
# pull_request - limited permissions for forks
# pull_request_target - runs in base repo context

on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # Be careful with checkout from forks
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
```

### Comment on PR

```yaml
permissions:
  pull-requests: write

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Thanks for your PR! 🎉'
            })
```

### PR Review Trigger

```yaml
on:
  pull_request_review:
    types: [submitted]

jobs:
  on-approval:
    runs-on: ubuntu-latest
    if: github.event.review.state == 'approved'
    steps:
      - run: echo "PR approved!"
```

### Complete Example

```yaml
name: PR Check

on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]
    paths:
      - 'src/**'
      - 'tests/**'

permissions:
  contents: read
  pull-requests: write

jobs:
  test:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm ci
      - run: npm test
      
      - name: Comment result
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All tests passed!'
            })
```

### Best Practices

```
✅ Use appropriate activity types
✅ Filter by branches and paths
✅ Handle draft PRs
✅ Be careful with fork PRs
✅ Use pull_request_target carefully
```

