# Lab 841: Webhook Events

## LEARNING CONCEPT

Triggering workflows from various GitHub webhook events.

## EXERCISE

1. Understand available webhook events
2. Configure event-specific triggers
3. Access event data

## SOLUTION

### Issue Events

```yaml
on:
  issues:
    types:
      - opened
      - edited
      - closed
      - labeled
      - assigned

jobs:
  handle-issue:
    runs-on: ubuntu-latest
    steps:
      - name: Issue info
        run: |
          echo "Issue #${{ github.event.issue.number }}"
          echo "Title: ${{ github.event.issue.title }}"
          echo "Action: ${{ github.event.action }}"
```

### Issue Comment Events

```yaml
on:
  issue_comment:
    types: [created, edited]

jobs:
  handle-comment:
    runs-on: ubuntu-latest
    # Only on PR comments
    if: github.event.issue.pull_request
    steps:
      - name: Comment info
        run: |
          echo "Comment: ${{ github.event.comment.body }}"
          echo "Author: ${{ github.event.comment.user.login }}"
```

### Release Events

```yaml
on:
  release:
    types:
      - published
      - created
      - released

jobs:
  on-release:
    runs-on: ubuntu-latest
    steps:
      - name: Release info
        run: |
          echo "Tag: ${{ github.event.release.tag_name }}"
          echo "Name: ${{ github.event.release.name }}"
          echo "Prerelease: ${{ github.event.release.prerelease }}"
```

### Label Events

```yaml
on:
  label:
    types: [created, edited, deleted]

jobs:
  handle-label:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Label: ${{ github.event.label.name }}"
```

### Discussion Events

```yaml
on:
  discussion:
    types: [created, answered]

jobs:
  handle-discussion:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Discussion: ${{ github.event.discussion.title }}"
```

### Project Events

```yaml
on:
  project:
    types: [created, closed]
  project_card:
    types: [created, moved]

jobs:
  handle-project:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Project event"
```

### Deployment Events

```yaml
on:
  deployment:
  deployment_status:

jobs:
  handle-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Deployment info
        run: |
          echo "Environment: ${{ github.event.deployment.environment }}"
          echo "Status: ${{ github.event.deployment_status.state }}"
```

### Check Events

```yaml
on:
  check_run:
    types: [completed]
  check_suite:
    types: [completed]

jobs:
  handle-check:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Check completed"
```

### Star Events

```yaml
on:
  watch:
    types: [started]  # Star event

jobs:
  on-star:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Starred by ${{ github.event.sender.login }}"
```

### Fork Events

```yaml
on:
  fork:

jobs:
  on-fork:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Forked to ${{ github.event.forkee.full_name }}"
```

### Wiki Events

```yaml
on:
  gollum:  # Wiki page events

jobs:
  on-wiki:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Wiki updated"
```

### Branch/Tag Events

```yaml
on:
  create:  # Branch or tag created
  delete:  # Branch or tag deleted

jobs:
  handle-ref:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Ref type: ${{ github.event.ref_type }}"
          echo "Ref: ${{ github.event.ref }}"
```

### Complete Example

```yaml
name: Issue Automation

on:
  issues:
    types: [opened, labeled]
  issue_comment:
    types: [created]

permissions:
  issues: write

jobs:
  welcome:
    if: github.event_name == 'issues' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Thanks for opening this issue!'
            })
            
  auto-label:
    if: github.event_name == 'issues' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const title = context.payload.issue.title.toLowerCase();
            const labels = [];
            if (title.includes('bug')) labels.push('bug');
            if (title.includes('feature')) labels.push('enhancement');
            if (labels.length > 0) {
              github.rest.issues.addLabels({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                labels: labels
              });
            }
```

### Best Practices

```
✅ Use specific event types
✅ Check event action in conditions
✅ Handle events idempotently
✅ Validate event data
✅ Document automation behavior
```

