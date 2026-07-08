# Lab 824: Debugging Workflows

## LEARNING CONCEPT

Debugging GitHub Actions workflows.

## EXERCISE

1. Enable debug logging
2. Use debugging techniques
3. Troubleshoot common issues

## SOLUTION

### Enable Debug Logging

```
Method 1: Repository secret
Settings → Secrets → Actions → New secret
Name: ACTIONS_STEP_DEBUG
Value: true

Method 2: Re-run with debug
Actions → Select run → Re-run jobs → Enable debug logging
```

### Debug Output in Workflow

```yaml
steps:
  - name: Debug info
    run: |
      echo "::debug::Starting debug output"
      echo "Event: ${{ github.event_name }}"
      echo "Ref: ${{ github.ref }}"
      echo "SHA: ${{ github.sha }}"
```

### Dump Contexts

```yaml
steps:
  - name: Dump GitHub context
    env:
      GITHUB_CONTEXT: ${{ toJson(github) }}
    run: echo "$GITHUB_CONTEXT"
    
  - name: Dump job context
    env:
      JOB_CONTEXT: ${{ toJson(job) }}
    run: echo "$JOB_CONTEXT"
    
  - name: Dump runner context
    env:
      RUNNER_CONTEXT: ${{ toJson(runner) }}
    run: echo "$RUNNER_CONTEXT"
```

### Interactive Debugging with tmate

```yaml
steps:
  - name: Setup tmate session
    uses: mxschmitt/action-tmate@v3
    if: ${{ github.event_name == 'workflow_dispatch' && inputs.debug }}
    with:
      limit-access-to-actor: true
```

### Conditional Debug Steps

```yaml
on:
  workflow_dispatch:
    inputs:
      debug:
        description: 'Enable debug mode'
        type: boolean
        default: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Debug environment
        if: ${{ inputs.debug }}
        run: |
          env | sort
          pwd
          ls -la
```

### Check Exit Codes

```yaml
steps:
  - name: Run with error handling
    run: |
      set -e  # Exit on error
      npm ci
      npm test
    continue-on-error: false
    
  - name: Check command result
    run: |
      if npm test; then
        echo "Tests passed"
      else
        echo "Tests failed"
        exit 1
      fi
```

### Verbose Output

```yaml
steps:
  - name: Verbose npm
    run: npm ci --verbose
    
  - name: Verbose git
    run: |
      git config --list
      git status
      git log --oneline -5
```

### Artifact for Debugging

```yaml
steps:
  - name: Run tests
    run: npm test
    continue-on-error: true
    
  - name: Upload logs
    if: always()
    uses: actions/upload-artifact@v4
    with:
      name: debug-logs
      path: |
        logs/
        *.log
        test-results/
```

### Common Issues

```yaml
# Issue: Command not found
steps:
  - name: Check PATH
    run: |
      echo $PATH
      which node || echo "node not found"
      
# Issue: Permission denied
steps:
  - name: Fix permissions
    run: chmod +x ./script.sh
    
# Issue: File not found
steps:
  - name: Check files
    run: |
      pwd
      ls -la
      find . -name "*.js" | head -20
```

### Workflow Validation

```bash
# Local validation with act
act -n  # Dry run

# GitHub CLI
gh workflow view ci.yml
gh run list --workflow=ci.yml
gh run view <run-id> --log
```

### Retry Failed Steps

```yaml
steps:
  - name: Flaky operation
    uses: nick-fields/retry@v2
    with:
      timeout_minutes: 5
      max_attempts: 3
      command: npm test
```

### Log Grouping for Clarity

```yaml
steps:
  - name: Organized output
    run: |
      echo "::group::Environment"
      env | sort
      echo "::endgroup::"
      
      echo "::group::Node info"
      node --version
      npm --version
      echo "::endgroup::"
      
      echo "::group::Git info"
      git log -3 --oneline
      echo "::endgroup::"
```

### Troubleshooting Checklist

```
□ Check workflow syntax
□ Verify trigger conditions
□ Check permissions
□ Review environment variables
□ Verify secrets are set
□ Check file paths
□ Review action versions
□ Check runner compatibility
```

### Best Practices

```
✅ Use debug logging sparingly
✅ Add meaningful log messages
✅ Upload artifacts on failure
✅ Use continue-on-error wisely
✅ Group related output
✅ Document known issues
```

