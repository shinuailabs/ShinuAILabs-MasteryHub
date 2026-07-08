# Lab 820: GitHub Context

## LEARNING CONCEPT

Understanding GitHub Actions context objects.

## EXERCISE

1. Learn available contexts
2. Access context data
3. Use contexts in workflows

## SOLUTION

### Available Contexts

```
github    - Workflow run information
env       - Environment variables
vars      - Repository/org variables
job       - Current job information
jobs      - Job outputs (reusable workflows)
steps     - Step outputs
runner    - Runner information
secrets   - Secret values
strategy  - Matrix strategy info
matrix    - Current matrix values
needs     - Dependent job outputs
inputs    - Workflow inputs
```

### GitHub Context

```yaml
jobs:
  info:
    runs-on: ubuntu-latest
    steps:
      - name: GitHub context
        run: |
          echo "Event: ${{ github.event_name }}"
          echo "Ref: ${{ github.ref }}"
          echo "SHA: ${{ github.sha }}"
          echo "Actor: ${{ github.actor }}"
          echo "Repository: ${{ github.repository }}"
          echo "Run ID: ${{ github.run_id }}"
          echo "Run Number: ${{ github.run_number }}"
          echo "Workflow: ${{ github.workflow }}"
          echo "Job: ${{ github.job }}"
```

### Common GitHub Properties

```yaml
# Branch/tag info
${{ github.ref }}           # refs/heads/main
${{ github.ref_name }}      # main
${{ github.head_ref }}      # PR source branch
${{ github.base_ref }}      # PR target branch

# Commit info
${{ github.sha }}           # Full commit SHA
${{ github.event.head_commit.message }}

# Repository info
${{ github.repository }}    # owner/repo
${{ github.repository_owner }}

# Event info
${{ github.event_name }}    # push, pull_request, etc.
${{ github.event.action }}  # opened, closed, etc.
```

### Runner Context

```yaml
jobs:
  info:
    runs-on: ubuntu-latest
    steps:
      - name: Runner context
        run: |
          echo "OS: ${{ runner.os }}"
          echo "Arch: ${{ runner.arch }}"
          echo "Name: ${{ runner.name }}"
          echo "Temp: ${{ runner.temp }}"
          echo "Tool Cache: ${{ runner.tool_cache }}"
```

### Job Context

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Job context
        run: |
          echo "Status: ${{ job.status }}"
```

### Steps Context

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Generate output
        id: generate
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
        
      - name: Use output
        run: echo "Version is ${{ steps.generate.outputs.version }}"
```

### Env Context

```yaml
env:
  GLOBAL_VAR: global

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      JOB_VAR: job
      
    steps:
      - name: Access env
        env:
          STEP_VAR: step
        run: |
          echo "Global: ${{ env.GLOBAL_VAR }}"
          echo "Job: ${{ env.JOB_VAR }}"
          echo "Step: ${{ env.STEP_VAR }}"
```

### Secrets Context

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Use secret
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh
```

### Matrix Context

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        os: [ubuntu-latest, windows-latest]
        
    runs-on: ${{ matrix.os }}
    
    steps:
      - name: Matrix info
        run: |
          echo "Node: ${{ matrix.node }}"
          echo "OS: ${{ matrix.os }}"
```

### Needs Context

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
    steps:
      - id: version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

### Conditional with Context

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Only on main
        if: github.ref == 'refs/heads/main'
        run: echo "On main branch"
        
      - name: Only on PR
        if: github.event_name == 'pull_request'
        run: echo "This is a PR"
        
      - name: Only on tag
        if: startsWith(github.ref, 'refs/tags/')
        run: echo "This is a tag"
```

### Dump All Contexts

```yaml
jobs:
  dump:
    runs-on: ubuntu-latest
    steps:
      - name: Dump contexts
        env:
          GITHUB_CONTEXT: ${{ toJson(github) }}
          JOB_CONTEXT: ${{ toJson(job) }}
          RUNNER_CONTEXT: ${{ toJson(runner) }}
        run: |
          echo "$GITHUB_CONTEXT"
          echo "$JOB_CONTEXT"
          echo "$RUNNER_CONTEXT"
```

### Best Practices

```
✅ Use contexts for dynamic values
✅ Check event type before actions
✅ Use outputs for job communication
✅ Don't log secrets
✅ Validate context values
```

