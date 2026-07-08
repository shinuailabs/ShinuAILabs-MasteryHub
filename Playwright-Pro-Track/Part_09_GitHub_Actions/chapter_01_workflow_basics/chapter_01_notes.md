# Part 01: Workflow Basics

## 📚 Overview
GitHub Actions workflows automate software development tasks directly in your repository.

---

## 🎯 Key Concepts

### 1. Workflow File Structure

```yaml
# .github/workflows/test.yml
name: Test Workflow

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
```

### 2. Workflow Components

```
Workflow: Automated process defined in YAML
Event: Trigger that starts workflow
Job: Set of steps running on same runner
Step: Individual task in a job
Action: Reusable unit of code
Runner: Server that runs workflows
```

### 3. Basic Triggers

```yaml
# Push to any branch
on: push

# Push to specific branches
on:
  push:
    branches: [main, develop]

# Pull requests
on:
  pull_request:
    branches: [main]

# Multiple events
on: [push, pull_request]

# Scheduled (cron)
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

# Manual trigger
on: workflow_dispatch
```

### 4. Jobs Configuration

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build

  test:
    runs-on: ubuntu-latest
    needs: build  # Depends on build job
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### 5. Steps

```yaml
steps:
  # Use an action
  - uses: actions/checkout@v4
  
  # Run a command
  - run: npm install
  
  # Named step
  - name: Run tests
    run: npm test
  
  # Multi-line command
  - name: Build and test
    run: |
      npm install
      npm run build
      npm test
```

### 6. Environment Variables

```yaml
env:
  NODE_ENV: test
  CI: true

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      JOB_VAR: job-level
    steps:
      - name: Test
        env:
          STEP_VAR: step-level
        run: |
          echo "NODE_ENV: $NODE_ENV"
          echo "JOB_VAR: $JOB_VAR"
          echo "STEP_VAR: $STEP_VAR"
```

### 7. Runners

```yaml
jobs:
  linux:
    runs-on: ubuntu-latest
    # Also: ubuntu-22.04, ubuntu-20.04
    
  macos:
    runs-on: macos-latest
    # Also: macos-13, macos-12
    
  windows:
    runs-on: windows-latest
    # Also: windows-2022, windows-2019
```

### 8. Working Directory

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./app
    steps:
      - uses: actions/checkout@v4
      - run: npm install  # Runs in ./app
      - run: npm test     # Runs in ./app
```

### 9. Conditional Execution

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        if: success()
        run: ./deploy.sh
```

---

## 💻 Practice Exercises

1. Create basic workflow
2. Configure triggers
3. Add multiple jobs
4. Use environment variables
5. Set up conditional execution

---

## ✅ Best Practices

- ✅ Use descriptive workflow names
- ✅ Pin action versions
- ✅ Use environment variables
- ✅ Add job dependencies
- ❌ Don't use `@master` for actions
- ❌ Avoid hardcoded values

---

## 📝 Quick Reference

```yaml
name: Workflow Name
on: [push, pull_request]
env:
  GLOBAL_VAR: value
jobs:
  job-name:
    runs-on: ubuntu-latest
    env:
      JOB_VAR: value
    steps:
      - uses: actions/checkout@v4
      - name: Step name
        run: command
```

