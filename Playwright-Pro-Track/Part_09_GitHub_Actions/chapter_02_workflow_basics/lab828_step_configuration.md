# Lab 828: Step Configuration

## LEARNING CONCEPT

Configuring steps in GitHub Actions jobs.

## EXERCISE

1. Configure different step types
2. Use step options
3. Handle step outputs

## SOLUTION

### Basic Steps

```yaml
steps:
  # Run command
  - run: echo "Hello World"
  
  # Named step
  - name: Install dependencies
    run: npm ci
    
  # Use action
  - uses: actions/checkout@v4
```

### Step with All Options

```yaml
steps:
  - name: Complete step example
    id: my-step
    if: success()
    run: echo "Running step"
    shell: bash
    working-directory: ./app
    env:
      MY_VAR: value
    continue-on-error: false
    timeout-minutes: 10
```

### Run Commands

```yaml
steps:
  # Single command
  - run: npm ci
  
  # Multi-line commands
  - run: |
      npm ci
      npm run build
      npm test
      
  # With pipe
  - run: |
      echo "Building..."
      npm run build 2>&1 | tee build.log
```

### Shell Options

```yaml
steps:
  # Bash (default on Linux/macOS)
  - run: echo $SHELL
    shell: bash
    
  # PowerShell (Windows)
  - run: Write-Host "Hello"
    shell: pwsh
    
  # Python
  - run: |
      import os
      print(os.environ.get('GITHUB_ACTOR'))
    shell: python
    
  # Custom shell
  - run: echo "Hello"
    shell: bash -e {0}
```

### Working Directory

```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: Build frontend
    working-directory: ./frontend
    run: npm run build
    
  - name: Build backend
    working-directory: ./backend
    run: npm run build
```

### Environment Variables

```yaml
steps:
  - name: Step with env
    env:
      NODE_ENV: production
      API_URL: https://api.example.com
      SECRET_KEY: ${{ secrets.SECRET_KEY }}
    run: |
      echo "Environment: $NODE_ENV"
      echo "API URL: $API_URL"
```

### Conditional Steps

```yaml
steps:
  - name: Always run
    if: always()
    run: echo "This always runs"
    
  - name: On success
    if: success()
    run: echo "Previous steps succeeded"
    
  - name: On failure
    if: failure()
    run: echo "A previous step failed"
    
  - name: On specific condition
    if: github.ref == 'refs/heads/main'
    run: echo "On main branch"
    
  - name: Complex condition
    if: |
      github.event_name == 'push' &&
      github.ref == 'refs/heads/main' &&
      !contains(github.event.head_commit.message, '[skip ci]')
    run: ./deploy.sh
```

### Step Outputs

```yaml
steps:
  - name: Set output
    id: my-step
    run: |
      echo "version=1.0.0" >> $GITHUB_OUTPUT
      echo "name=my-app" >> $GITHUB_OUTPUT
      
  - name: Use output
    run: |
      echo "Version: ${{ steps.my-step.outputs.version }}"
      echo "Name: ${{ steps.my-step.outputs.name }}"
```

### Continue on Error

```yaml
steps:
  - name: May fail
    id: flaky
    continue-on-error: true
    run: ./flaky-script.sh
    
  - name: Check result
    run: |
      if [ "${{ steps.flaky.outcome }}" == "failure" ]; then
        echo "Previous step failed but we continued"
      fi
```

### Timeout

```yaml
steps:
  - name: Quick step
    timeout-minutes: 5
    run: npm test
    
  - name: Long step
    timeout-minutes: 30
    run: ./long-running-task.sh
```

### Using Actions

```yaml
steps:
  # Basic action
  - uses: actions/checkout@v4
  
  # Action with inputs
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
      
  # Action from different repo
  - uses: owner/repo@v1
    with:
      input1: value1
      
  # Action from local path
  - uses: ./.github/actions/my-action
    with:
      input: value
```

### Action Outputs

```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: Get changed files
    id: changed
    uses: tj-actions/changed-files@v40
    
  - name: Use action output
    run: |
      echo "Changed files: ${{ steps.changed.outputs.all_changed_files }}"
```

### Step Summary

```yaml
steps:
  - name: Add summary
    run: |
      echo "## Build Results" >> $GITHUB_STEP_SUMMARY
      echo "- Status: ✅ Success" >> $GITHUB_STEP_SUMMARY
      echo "- Duration: 2m 30s" >> $GITHUB_STEP_SUMMARY
```

### Best Practices

```
✅ Use meaningful step names
✅ Set appropriate timeouts
✅ Use IDs for outputs
✅ Handle errors appropriately
✅ Keep steps focused
✅ Use environment variables
```

