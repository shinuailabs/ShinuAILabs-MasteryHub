# Lab 830: Conditionals

## LEARNING CONCEPT

Using conditional execution in GitHub Actions.

## EXERCISE

1. Use if conditions on jobs and steps
2. Apply status check functions
3. Create complex conditions

## SOLUTION

### Basic Conditionals

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Only on push
        if: github.event_name == 'push'
        run: echo "This is a push event"
        
      - name: Only on PR
        if: github.event_name == 'pull_request'
        run: echo "This is a pull request"
```

### Job-Level Conditions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-staging.sh
      
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-production.sh
```

### Status Check Functions

```yaml
steps:
  - name: Run tests
    id: test
    run: npm test
    continue-on-error: true
    
  - name: Always run
    if: always()
    run: echo "This always runs"
    
  - name: On success
    if: success()
    run: echo "Tests passed"
    
  - name: On failure
    if: failure()
    run: echo "Tests failed"
    
  - name: On cancel
    if: cancelled()
    run: echo "Workflow cancelled"
```

### Branch Conditions

```yaml
steps:
  - name: On main branch
    if: github.ref == 'refs/heads/main'
    run: echo "On main"
    
  - name: On any feature branch
    if: startsWith(github.ref, 'refs/heads/feature/')
    run: echo "On feature branch"
    
  - name: On tag
    if: startsWith(github.ref, 'refs/tags/')
    run: echo "On tag"
    
  - name: Not on main
    if: github.ref != 'refs/heads/main'
    run: echo "Not on main"
```

### Event Conditions

```yaml
steps:
  - name: On push to main
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    run: echo "Push to main"
    
  - name: On PR opened
    if: github.event_name == 'pull_request' && github.event.action == 'opened'
    run: echo "PR opened"
    
  - name: On manual trigger
    if: github.event_name == 'workflow_dispatch'
    run: echo "Manual trigger"
```

### Complex Conditions

```yaml
steps:
  - name: Complex condition
    if: |
      github.event_name == 'push' &&
      github.ref == 'refs/heads/main' &&
      !contains(github.event.head_commit.message, '[skip ci]')
    run: ./deploy.sh
    
  - name: Multiple events
    if: |
      github.event_name == 'push' ||
      github.event_name == 'pull_request' ||
      github.event_name == 'workflow_dispatch'
    run: npm test
```

### Using Outputs in Conditions

```yaml
steps:
  - name: Check changes
    id: changes
    run: |
      if git diff --name-only HEAD~1 | grep -q "^src/"; then
        echo "src_changed=true" >> $GITHUB_OUTPUT
      else
        echo "src_changed=false" >> $GITHUB_OUTPUT
      fi
      
  - name: Build if changed
    if: steps.changes.outputs.src_changed == 'true'
    run: npm run build
```

### Checking Previous Step Outcome

```yaml
steps:
  - name: May fail
    id: test
    continue-on-error: true
    run: npm test
    
  - name: On test success
    if: steps.test.outcome == 'success'
    run: echo "Tests passed"
    
  - name: On test failure
    if: steps.test.outcome == 'failure'
    run: echo "Tests failed"
```

### Actor Conditions

```yaml
steps:
  - name: Skip for bots
    if: github.actor != 'dependabot[bot]'
    run: npm test
    
  - name: Only for specific user
    if: github.actor == 'admin-user'
    run: ./admin-task.sh
```

### Contains Function

```yaml
steps:
  - name: Skip CI
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    run: npm test
    
  - name: Check labels
    if: contains(github.event.pull_request.labels.*.name, 'deploy')
    run: ./deploy.sh
```

### Needs Conditions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      
  deploy:
    needs: build
    # Only if build succeeded
    if: needs.build.result == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
      
  notify:
    needs: [build, deploy]
    # Run even if previous jobs failed
    if: always()
    runs-on: ubuntu-latest
    steps:
      - run: ./notify.sh
```

### Best Practices

```
✅ Use clear, readable conditions
✅ Test conditions thoroughly
✅ Use status functions appropriately
✅ Document complex conditions
✅ Consider all edge cases
```

