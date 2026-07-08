# Lab 902: Debugging Workflows

## LEARNING CONCEPT

Debugging GitHub Actions workflows.

## EXERCISE

1. Enable debug logging
2. Use debugging techniques
3. Troubleshoot common issues

## SOLUTION

### Enable Debug Logging

```
Set repository secrets:
- ACTIONS_RUNNER_DEBUG: true
- ACTIONS_STEP_DEBUG: true
```

### Debug Output

```yaml
steps:
  - name: Debug info
    run: |
      echo "Event: ${{ github.event_name }}"
      echo "Ref: ${{ github.ref }}"
      echo "SHA: ${{ github.sha }}"
      echo "Actor: ${{ github.actor }}"
```

### Print Context

```yaml
steps:
  - name: Dump contexts
    run: |
      echo "GitHub context:"
      echo '${{ toJson(github) }}'
      
      echo "Job context:"
      echo '${{ toJson(job) }}'
      
      echo "Steps context:"
      echo '${{ toJson(steps) }}'
```

### Environment Variables

```yaml
steps:
  - name: Show environment
    run: |
      echo "Environment variables:"
      env | sort
```

### Debug Action

```yaml
steps:
  - name: Debug
    uses: actions/github-script@v7
    with:
      script: |
        console.log('Context:', JSON.stringify(context, null, 2));
        console.log('Payload:', JSON.stringify(context.payload, null, 2));
```

### Conditional Debug

```yaml
steps:
  - name: Debug (only on failure)
    if: failure()
    run: |
      echo "Previous step failed"
      echo "Dumping logs..."
      cat /tmp/app.log || true
```

### SSH Debug Session

```yaml
steps:
  - name: Setup tmate session
    if: failure()
    uses: mxschmitt/action-tmate@v3
    timeout-minutes: 15
```

### Artifact Debugging

```yaml
steps:
  - name: Run tests
    run: npm test
    continue-on-error: true
    
  - name: Upload debug artifacts
    if: failure()
    uses: actions/upload-artifact@v4
    with:
      name: debug-logs
      path: |
        logs/
        screenshots/
        *.log
```

### Step Summary

```yaml
steps:
  - name: Debug summary
    run: |
      echo "## Debug Information" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "| Variable | Value |" >> $GITHUB_STEP_SUMMARY
      echo "|----------|-------|" >> $GITHUB_STEP_SUMMARY
      echo "| Event | ${{ github.event_name }} |" >> $GITHUB_STEP_SUMMARY
      echo "| Ref | ${{ github.ref }} |" >> $GITHUB_STEP_SUMMARY
      echo "| SHA | ${{ github.sha }} |" >> $GITHUB_STEP_SUMMARY
```

### Verbose Commands

```yaml
steps:
  - name: Verbose npm
    run: npm ci --verbose
    
  - name: Debug shell
    run: |
      set -x  # Print commands
      npm test
```

### Check File System

```yaml
steps:
  - name: Check workspace
    run: |
      echo "Current directory: $(pwd)"
      echo "Workspace: $GITHUB_WORKSPACE"
      echo ""
      echo "Files:"
      ls -la
      echo ""
      echo "Disk usage:"
      df -h
```

### Network Debugging

```yaml
steps:
  - name: Network debug
    run: |
      echo "DNS resolution:"
      nslookup github.com
      
      echo "Connectivity:"
      curl -I https://github.com
```

### Common Issues

```yaml
# Issue: Permission denied
- run: chmod +x ./script.sh && ./script.sh

# Issue: File not found
- run: |
    ls -la
    cat ./config.json || echo "File not found"

# Issue: Environment variable not set
- run: |
    echo "VAR=${VAR:-default}"
    if [ -z "$VAR" ]; then
      echo "VAR is not set"
    fi
```

### Complete Example

```yaml
name: Debug Workflow

on:
  workflow_dispatch:
    inputs:
      debug:
        type: boolean
        default: false

jobs:
  debug:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Context dump
        if: inputs.debug
        run: |
          echo "## GitHub Context" >> $GITHUB_STEP_SUMMARY
          echo '```json' >> $GITHUB_STEP_SUMMARY
          echo '${{ toJson(github) }}' >> $GITHUB_STEP_SUMMARY
          echo '```' >> $GITHUB_STEP_SUMMARY
          
      - name: Environment
        if: inputs.debug
        run: |
          echo "## Environment" >> $GITHUB_STEP_SUMMARY
          echo '```' >> $GITHUB_STEP_SUMMARY
          env | sort >> $GITHUB_STEP_SUMMARY
          echo '```' >> $GITHUB_STEP_SUMMARY
          
      - name: Run tests
        id: test
        run: npm test
        continue-on-error: true
        
      - name: Debug on failure
        if: steps.test.outcome == 'failure'
        run: |
          echo "Test failed, collecting debug info..."
          cat npm-debug.log || true
          
      - name: Upload debug artifacts
        if: failure() || inputs.debug
        uses: actions/upload-artifact@v4
        with:
          name: debug
          path: |
            *.log
            test-results/
```

### Best Practices

```
✅ Use debug secrets sparingly
✅ Add context to summaries
✅ Upload artifacts on failure
✅ Use verbose commands
✅ Check common issues first
```

